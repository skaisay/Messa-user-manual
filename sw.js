/**
 * Service Worker для PWA приложения Веб-Ассистент
 * Обеспечивает оффлайн работу и кеширование ресурсов
 */

const CACHE_NAME = 'web-assistant-v1.0.1';
const STATIC_CACHE_URLS = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './database.js',
    './norwegian-database.js',
    './manifest.json',
    // CDN ресурсы
    'https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.29.0/feather.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.29.0/feather.min.css'
];

/**
 * Установка Service Worker
 */
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching app shell');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('Service Worker: Installed successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Installation failed', error);
            })
    );
});

/**
 * Активация Service Worker
 */
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim();
            })
    );
});

/**
 * Перехват запросов (Fetch)
 */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Возвращаем кешированную версию если есть
                if (response) {
                    return response;
                }
                
                // Иначе делаем сетевой запрос
                return fetch(event.request)
                    .then((response) => {
                        // Проверяем валидность ответа
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Клонируем ответ для кеширования
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // Если оффлайн и запрашивается HTML страница
                        if (event.request.destination === 'document') {
                            return caches.match('./') || caches.match('./index.html');
                        }
                    });
            })
    );
});

/**
 * Background Sync для отложенных операций
 */
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync triggered');
        event.waitUntil(doBackgroundSync());
    }
});

/**
 * Push уведомления (если потребуется в будущем)
 */
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Новое сообщение от Веб-Ассистента',
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('Веб-Ассистент', options)
    );
});

/**
 * Клик по уведомлению
 */
self.addEventListener('notificationclick', (event) => {
    console.log('Notification click: ', event);
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

/**
 * Фоновая синхронизация
 */
async function doBackgroundSync() {
    try {
        // Здесь можно добавить логику для синхронизации данных
        console.log('Background sync completed');
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

/**
 * Обновление кеша
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_UPDATE') {
        event.waitUntil(updateCache());
    }
});

async function updateCache() {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(STATIC_CACHE_URLS);
    console.log('Cache updated');
}