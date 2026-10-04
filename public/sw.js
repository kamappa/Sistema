/* Service worker do Sistema — Missão 26.
 *
 * Minimo de proposito. Faz UMA coisa: guardar a shell (HTML, JS, CSS) para a
 * app abrir sem rede. NAO guarda dados — nem estado, nem Radar, nem relatorios.
 *
 * O motivo e a primeira lei: nada exibido pode contradizer o estado guardado.
 * Um service worker que servisse dados em cache mostraria o Sistema de ontem
 * como se fosse o de hoje, e isso e exatamente a mentira que o projeto proibe.
 * A shell e codigo; o codigo de ontem desenha na mesma o estado de hoje.
 *
 * Estrategia:
 *  - navegacao  -> rede primeiro, cache como rede de seguranca. Assim uma versao
 *                  nova chega sempre que houver ligacao;
 *  - assets     -> cache primeiro (tem hash no nome, logo nunca ficam velhos);
 *  - Supabase   -> NUNCA intercetado. Passa sempre direto a rede.
 */
const V = 'sistema-shell-v1';
const SHELL = ['/Sistema/', '/Sistema/index.html'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // dados reais nunca passam por aqui
  if (url.origin !== self.location.origin) return;
  if (e.request.method !== 'GET') return;

  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((r) => { const c = r.clone(); caches.open(V).then((k) => k.put(e.request, c)); return r; })
        .catch(() => caches.match('/Sistema/index.html'))
    );
    return;
  }

  if (/\.(js|css|woff2?|png|svg)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then((hit) => hit || fetch(e.request).then((r) => {
        const c = r.clone(); caches.open(V).then((k) => k.put(e.request, c)); return r;
      }))
    );
  }
});
