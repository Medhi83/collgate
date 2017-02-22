/**
 * @file batch.js
 * @brief Batch collection
 * @author Frederic SCHERMA
 * @date 2017-02-14
 * @copyright Copyright (c) 2017 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var BatchModel = require('../models/batch');

var Collection = Backbone.Collection.extend({
    url: function() {
        if (this.accession_id) {
            return application.baseUrl + 'accession/accession/' + this.accession_id + '/batch/';
        } else if (this.batch_id) {
            return application.baseUrl + 'accession/batch/' + this.batch_id + '/batch/';
        } else {
            return application.baseUrl + 'accession/accession/batch/';
        }
    },
    model: BatchModel,

    comparator: 'name',

    initialize: function(models, options) {
        options || (options = {});

        this.accession_id = options.accession_id;
        this.batch_id = options.batch_id;
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
