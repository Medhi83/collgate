/**
 * @file establishment.js
 * @brief Establishment model
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2017-02-28
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

var Backbone = require('backbone');

var Model = Backbone.Model.extend({
    url: function() {
        if (this.isNew())
            return application.baseUrl + 'organisation/establishment/';
        else
            return application.baseUrl + 'organisation/establishment/' + this.get('id') + '/';
    },

    defaults: {
        id: null,
        name: "",
        organisation: null,
        descriptor_meta_model: null,
        descriptors: {}
    }
});

module.exports = Model;

