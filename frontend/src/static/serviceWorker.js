//Print a starter message so we know when the SW starts working
printLog("Service Worker starting");

//Make a name for the cache
const CACHE_NAME = 'blackJackCache-v0';


/**
 * Method just prints stuff out.
 */
function printLog(...data) {
    console.log(...data);
}

/**
 * Method for intercepting Fetch API calls
 * 
 */

self.addEventListener('install', action => {
    printLog("installing", action);

    action.waitUntil(
        caches.open(CACHE_NAME).then(the_cache => {
            return the_cache.addAll([
                //Offline html page
                '/offline',
                '/practice',
                '/options',
                '/',
                //All JS files
                '/js/APIClient.js',
                '/js/authFront.js',
                '/js/game_script.js',
                '/js/house.js',
                '/js/HTTPClient.js',
                '/js/leaderboard_script.js',
                '/js/login_script.js',
                '/js/menu.js',
                '/js/notifications.js',
                '/js/offline.js',
                '/js/options_script.js',
                '/js/practice_script.js',
                '/js/signup.js',
                '/js/splashpage.js',
                '/SWMethods.js',
                //All CSS files
                '/css/game.css',
                '/css/leaderboard.css',
                '/css/login.css',
                '/css/menu.css',
                '/css/offline.css',
                '/css/options.css',
                '/css/signup.css',
                '/css/splash_page.css',
                '/css/styles.css',
                //Images
                '/images/bjlogo.png',
                '/images/settings.svg',
                '/images/apple-touch-icon.png',
                '/images/favicon-32x32.png',
                '/images/favicon-16x16.png',
                '/images/site.webmanifest',
                '/images/safari-pinned-tab.svg',
                '/images/android-chrome-192x192.png',
                '/images/android-chrome-512x512.png',
                '/images/favicon.ico',
                '/images/mstile-150x150.png',
                '/favicon.ico',
                //External Resources
                //manifest
                '/manifest.json'
            ]);
        })
    );
});

self.addEventListener('activate', action => {
    printLog("activating", action);
    action.waitUntil(
        caches.keys().then(cacheKeys => {
            return Promise.all(
                cacheKeys.filter(cacheKey => {
                    return cacheKey.startsWith('blackJackCache') && cacheKey != CACHE_NAME;
                }).map(cacheKey => {
                    printLog(cacheKey);
                    return caches.delete(cacheKey);
                })
            );
        })
    );
});

/**
 * This portion handles the offline functionality stuff
 * which should be just being able to play the game offline.
 */
self.addEventListener('fetch', action => {
    printLog("Fetching request for " + action.request.url);
    //Makes a new URL variable
    let requestedURL = new URL(action.request.url);
    //If this is an API call
    if (requestedURL.origin === location.origin && requestedURL.pathname.startsWith('/api')) {
        //For all get methods in API
        if (action.request.method === "GET" ) {
            printLog(requestedURL, action);
            //intercept it
            action.respondWith(
                getCacheSW(action.request)
            );
            //FINISH
        }
    }
    //If this is not an API call
    else {
        printLog("Not an API call");
        action.respondWith(
            getCacheSW(action.request)
        );
    }

});


self.addEventListener('message', action => {
    printLog('message', action.data);
    if(action.data.action == 'skipWaiting') {
        self.skipWaiting();
    }
});

function getCacheSW(request) {
    //Tries to find the request
    return caches.match(request).then(response => {
        console.log(response);
        return response ||  fetchSW(request);
    }).catch(err => {
        return caches.match('/offline');
    });
}

/**
 * Handles the actual functionality of the 
 * fetch.
 * @param {*} request 
 * @returns 
 */
function fetchSW(request) {
    return fetch(request).then(response => {
        //Get the request URL for the request
        let requestURL = new URL(request.url);
        //Cache everything except game mode
        printLog(requestURL.pathname.includes('/practice'));
        printLog(response.ok);
        printLog(response);
        //If the request is for playing the game, we should cache it
        if (response.ok && requestURL.pathname.includes('/practice')) {
            caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(request, response);
            });
        }
        //IDEA: Ask if response.clone() is necessary becasue
        //if i throw an error in here it should be fine
        return response.clone();
    });
}