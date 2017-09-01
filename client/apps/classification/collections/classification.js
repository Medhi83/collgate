/**
 * @file classification.js
 * @brief Classification collection
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2017-08-31
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

var ClassificationModel = require('../models/classification');

var Collection = Backbone.Collection.extend({
    url: application.baseUrl + 'classification/classification/',
    model: ClassificationModel,

    // comparator: 'name',

    parse: function(data) {
        return data.items;
    },

    fetch: function(options) {
        options || (options = {});
        var data = (options.data || {});

        var opts = _.clone(options);
        opts.data = data;

        this.sort_by = data.sort_by;

        if (this.filters) {
            opts.data.filters = JSON.stringify(this.filters)
        }

        if (data.sort_by && typeof data.sort_by !== 'string') {
            opts.data.sort_by = JSON.stringify(data.sort_by);
        }

        return Backbone.Collection.prototype.fetch.call(this, opts);
    },

    count: function(options) {
        options || (options = {});
        var data = (options.data || {});

        var opts = _.clone(options);
        opts.data = data;

        if (this.filters) {
            opts.data.filters = JSON.stringify(this.filters)
        }

        $.ajax({
            type: "GET",
            url: this.url + 'count/',
            dataType: 'json',
            data: opts.data,
            collection: this
        }).done(function (data) {
            this.collection.trigger('count', data.count);
        });
    }
});

module.exports = Collection;