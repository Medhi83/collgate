/**
 * @file taxonchildren.js
 * @brief Taxon children collection
 * @author Frederic SCHERMA
 * @date 2016-11-10
 * @copyright Copyright (c) 2016 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var TaxonModel = require('../models/taxon');

var Collection = Backbone.Collection.extend({
    url: function() {
        return application.baseUrl + 'taxonomy/taxon/' + this.model_id + '/children/';
    },
    model: TaxonModel,

    comparator: 'name',

    initialize: function(models, options) {
        options || (options = {});
        this.model_id = options.model_id;
    },

    parse: function(data) {
        this.prev = data.prev;
        this.page = data.page;
        this.next = data.next;

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
