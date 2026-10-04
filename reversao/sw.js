/* Interruptor do service worker — só para a reversão da Órbita para o Vanilla.
 *
 * O service worker da Órbita guarda na cache, e serve da cache primeiro, todos os .js, .css,
 * .png, .svg e .woff do sítio. O Vanilla não tem service worker: depois de uma reversão, o da
 * Órbita ficaria registado nos aparelhos que a abriram, e os ficheiros do Vanilla ficariam presos
 * na cache. Este ficheiro, servido em /Sistema/sw.js no lugar do da Órbita, substitui-o: apaga
 * todas as caches, desregista-se e recarrega as janelas abertas. Não interceta nenhum pedido.
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const nomes = await caches.keys();
    await Promise.all(nomes.map((n) => caches.delete(n)));
    await self.registration.unregister();
    const janelas = await self.clients.matchAll({ type: 'window' });
    for (const j of janelas) j.navigate(j.url);
  })());
});
