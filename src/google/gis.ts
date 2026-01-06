// src/google/gis.ts
declare global {
  interface Window {
    google?: any;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForGoogleIdentity(maxMs = 10_000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const ok = !!window.google?.accounts?.oauth2?.initTokenClient;
    if (ok) return;
    await sleep(100);
  }
  throw new Error(
    "Google Identity Services não carregou. Confira o <script> no index.html."
  );
}

export type TokenResult = {
  accessToken: string;
  expiresIn?: number; // segundos
};

export async function requestAccessToken(opts: {
  clientId: string;
  scopes: string[];
  prompt?: "" | "consent" | "select_account";
}): Promise<TokenResult> {
  await waitForGoogleIdentity();

  return new Promise<TokenResult>((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: opts.clientId,
      scope: opts.scopes.join(" "),
      callback: (resp: any) => {
        if (!resp || resp.error) {
          reject(new Error(resp?.error ?? "Falha ao obter access token"));
          return;
        }
        resolve({
          accessToken: resp.access_token as string,
          expiresIn:
            typeof resp.expires_in === "number" ? resp.expires_in : undefined,
        });
      },
    });

    tokenClient.requestAccessToken({ prompt: opts.prompt ?? "" });
  });
}
