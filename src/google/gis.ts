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

export async function requestAccessToken(opts: {
  clientId: string;
  scopes: string[];
}): Promise<string> {
  await waitForGoogleIdentity();

  return new Promise<string>((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: opts.clientId,
      scope: opts.scopes.join(" "),
      callback: (resp: any) => {
        if (!resp || resp.error) {
          reject(new Error(resp?.error ?? "Falha ao obter access token"));
          return;
        }
        resolve(resp.access_token as string);
      },
    });

    // Abre popup de login/consentimento
    tokenClient.requestAccessToken({ prompt: "" });
  });
}
