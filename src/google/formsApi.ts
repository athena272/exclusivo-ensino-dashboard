const FORMS_BASE = "https://forms.googleapis.com/v1";

export type SurveyResponse = {
  responseId: string;
  submittedAt: string; // RFC3339
  rating?: number;
  name?: string;
  comment?: string;
};

type FormsListResponses = {
  responses?: any[];
  nextPageToken?: string;
};

async function gfetch<T>(url: string, accessToken: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Google API ${res.status}: ${txt || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

function normalizeText(s: string) {
  return (s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function firstTextValue(answer: any): string | undefined {
  return answer?.textAnswers?.answers?.[0]?.value;
}

function flattenQuestions(
  form: any
): Array<{ questionId: string; title: string }> {
  const out: Array<{ questionId: string; title: string }> = [];

  const items = form?.items ?? [];
  for (const item of items) {
    const title = item?.title ?? "";

    // Pergunta simples
    const q = item?.questionItem?.question;
    const qid = q?.questionId ?? q?.question_id; // defensivo
    if (qid) out.push({ questionId: qid, title });

    // Se futuramente você usar grupos (não é o seu caso agora)
    const groupQs = item?.questionGroupItem?.questions ?? [];
    for (const gq of groupQs) {
      const gqid = gq?.questionId ?? gq?.question_id;
      if (gqid) out.push({ questionId: gqid, title: gq?.title ?? title });
    }
  }

  return out;
}

export async function loadSurveyResponses(params: {
  formId: string;
  accessToken: string;
}): Promise<SurveyResponse[]> {
  // 1) pega estrutura do form pra mapear IDs das perguntas
  // forms.get requer scopes de body.readonly/body :contentReference[oaicite:4]{index=4}
  const form = await gfetch<any>(
    `${FORMS_BASE}/forms/${params.formId}`,
    params.accessToken
  );
  const questions = flattenQuestions(form);

  // acha as 3 perguntas pelo título (ajuste se você renomear no Forms)
  const qRating = questions.find((q) =>
    normalizeText(q.title).includes("como voce avalia")
  );
  const qName = questions.find((q) =>
    normalizeText(q.title).includes("seu nome")
  );
  const qComment = questions.find((q) =>
    normalizeText(q.title).includes("comentario")
  );

  if (!qRating) {
    throw new Error(
      "Não achei a pergunta de avaliação. Verifique o título no Forms (ex: 'Como você avalia...')."
    );
  }

  // 2) pagina respostas
  const all: any[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(`${FORMS_BASE}/forms/${params.formId}/responses`);
    url.searchParams.set("pageSize", "200"); // ajuste conforme necessário
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const data = await gfetch<FormsListResponses>(
      url.toString(),
      params.accessToken
    );
    all.push(...(data.responses ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  // 3) normaliza
  const normalized: SurveyResponse[] = all.map((r) => {
    const answers = r?.answers ?? {};

    const ratingStr = qRating
      ? firstTextValue(answers[qRating.questionId])
      : undefined;
    const nameStr = qName
      ? firstTextValue(answers[qName.questionId])
      : undefined;
    const commentStr = qComment
      ? firstTextValue(answers[qComment.questionId])
      : undefined;

    const rating =
      ratingStr && /^\d+$/.test(ratingStr.trim())
        ? Number(ratingStr.trim())
        : undefined;

    return {
      responseId: r.responseId,
      submittedAt: r.lastSubmittedTime ?? r.createTime, // ambos existem no FormResponse :contentReference[oaicite:5]{index=5}
      rating,
      name: nameStr?.trim() || undefined,
      comment: commentStr?.trim() || undefined,
    };
  });

  // ordena mais recente primeiro
  normalized.sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
  return normalized;
}
