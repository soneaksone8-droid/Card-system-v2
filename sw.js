const CACHE = 'card-system-v2';
const ASSETS = [
  '/Card-system-v2/staff.html',
  '/Card-system-v2/admin.html',
  '/Card-system-v2/index.html',
  '/Card-system-v2/logo.png',
  '/Card-system-v2/jsQR.js',
  '/Card-system-v2/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // ສະເພາະ GET requests ເທົ່ານັ້ນ ທີ່ Cache ໄດ້
  // POST/PUT/DELETE ໄປ Network ໂດຍກົງ ບໍ່ Cache
  if (e.request.method !== 'GET') {
    return; // ປ່ອຍໃຫ້ browser handle ປົກກະຕິ
  }

  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
