self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (_) {
    payload = { body: event.data ? event.data.text() : '' };
  }
  const title = payload.title || 'LinkUp';
  const options = {
    body: payload.body || 'You have a new LinkUp notification.',
    icon: '/assets/images/LinkUp.png',
    badge: '/assets/images/LinkUp.png',
    tag: payload.tag || 'linkup-notification',
    data: { ...(payload.data || {}), url: payload.url || payload.data?.url || '/messages' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const parsed = new URL(event.notification.data?.url || '/messages', self.location.origin);
  if (parsed.origin !== self.location.origin) return;
  const targetUrl = parsed.href;
  event.waitUntil((async () => {
    const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existingClient = clientsList.find((client) => client.url.startsWith(self.location.origin));
    if (existingClient) {
      await existingClient.focus();
      return existingClient.navigate(targetUrl);
    }
    return self.clients.openWindow(targetUrl);
  })());
});
