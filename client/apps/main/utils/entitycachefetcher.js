/**
 * @file entitycachefetcher.js
 * @brief Cache fetcher specialized for entity display value.
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2017-09-05
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

var CacheFetcher = require('./cachefetcher');

var EntityCacheFetcher = function() {
    CacheFetcher.call(this);

    this.type = "entity";
};

EntityCacheFetcher.prototype = Object.create(CacheFetcher.prototype);
EntityCacheFetcher.prototype.constructor = EntityCacheFetcher;

EntityCacheFetcher.prototype.fetch = function(cacheManager, options, keys) {
    // make the list of values
    var keysToFetch = new Set();

    var cache = cacheManager.get('entity', options.format.model);
    var toFetch = false;
    var now = Date.now();

    if (cacheManager.enabled) {
        // lookup into the global cache
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var entry = undefined;

            toFetch = false;

            if (key !== null && key !== undefined && key !== "") {
                entry = cache[key];
            }

            if (entry !== undefined) {
                // found. look for validity
                if (entry.expire !== null && entry.expire <= now) {
                    toFetch = true;
                }
            } else if (key !== null && key !== undefined && key !== "") {
                toFetch = true;
            }

            if (toFetch) {
                keysToFetch.add(key);
            }
        }
    } else {
        // all when cache disabled
        keysToFetch = new Set(keys);
    }

    var url = "";
    var queryData = {values: JSON.stringify(Array.from(keys))};

    if (options.format.details) {
        url = window.application.url(['main', 'entity', options.format.model, 'details']);
    } else {
        url = window.application.url(['main', 'entity', options.format.model, 'values']);
    }

    if (keysToFetch.size) {
        var promise = $.ajax({
            type: "GET",
            url: url,
            contentType: 'application/json; charset=utf8',
            data: queryData
        });

        promise.done(function (data) {
            // feed the cache and compute expire timestamp. validity of null means it never expires.
            var now = Date.now();
            var expire = data.validity !== null ? data.validity * 1000 + now : null;
            if (!data.cacheable) {
                expire = now;
            }

            for (var key in data.items) {
                cache[key] = {
                    expire: expire,
                    value: data.items[key]
                };
            }

            session.logger.debug("Cache miss for entity " + options.format.model + ".");
        }).fail(function () {
            session.logger.debug("Cache failure for entity " + options.format.model + ".");
        });

        return promise;
    } else {
        return null;
    }
};

EntityCacheFetcher.prototype.get = function(cacheManager, options) {
    return cacheManager.get('entity', options.format.model);
};

module.exports = EntityCacheFetcher;
