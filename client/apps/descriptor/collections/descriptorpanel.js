/**
 * @file descriptorpaneltype.js
 * @brief Panel of descriptors collection
 * @author Frederic SCHERMA
 * @date 2016-10-27
 * @copyright Copyright (c) 2016 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var DescriptorPanelModel = require('../models/descriptorpanel');

var Collection = Backbone.Collection.extend({
    url: function() {
        return application.baseUrl + 'descriptor/meta-model/' + this.model_id + '/panel/';
    },

    model: DescriptorPanelModel,

    initialize: function(models, options) {
        options || (options = {});
        this.model_id = options.model_id;
    },

    parse: function(data) {
        this.prev = data.prev;
        this.cursor = data.cursor;
        this.next = data.next;

        return data.items;
    },

    comparator: 'position'
});

module.exports = Collection;