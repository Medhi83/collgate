/**
 * @file taxonentity.js
 * @brief Taxon entity model
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2016-12-28
 * @copyright Copyright (c) 2016 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

var Backbone = require('backbone');

var Model = Backbone.Model.extend({
    defaults: {
        id: null,
        name: '',
        content_type: null
    },

    parse: function(data) {
        return data;
    }
});

module.exports = Model;

