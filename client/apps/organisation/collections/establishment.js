/**
 * @file establishment.js
 * @brief Establishment collection
 * @author Frederic SCHERMA
 * @date 2017-02-28
 * @copyright Copyright (c) 2017 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var EstablishmentModel = require('../models/establishment');

var Collection = Backbone.Collection.extend({
    url: function () {
        if (this.organisation_id) {
            return application.baseUrl + 'organisation/organisation/' + this.organisation_id + '/establishment/';
        } else {
            return application.baseUrl + 'organisation/establishment/';
        }
    },
    model: EstablishmentModel,

    comparator: 'name',

    initialize: function(models, options) {
        options || (options = {});

        if (options.organisation_id) {
            this.organisation_id = options.organisation_id;
        }
    },

    parse: function(data) {
        this.prev = data.prev;
        this.cursor = data.cursor;
        this.next = data.next;
        this.perms = data.perms;

        return data.items;
    },

    fetch: function(options) {
        options || (options = {});
        var data = (options.data || {});

        options.data = data;

        this.cursor = options.data.cursor;
        this.sort_by = options.data.sort_by;

        if (this.filters) {
            options.data.filters = JSON.stringify(this.filters)
        }

        return Backbone.Collection.prototype.fetch.call(this, options);
    }
});

module.exports = Collection;