/**
 * @file descriptorgroup.js
 * @brief Group of descriptors model
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2016-07-20
 * @copyright Copyright (c) 2016 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

var Backbone = require('backbone');

var Model = Backbone.Model.extend({
    url: function() {
        if (this.isNew())
            return application.baseUrl + 'descriptor/group/';
        else
            return application.baseUrl + 'descriptor/group/' + this.get('id') + '/';
    },

    defaults: {
        id: null,
        name: '',
        num_descriptor_types: 0,
        can_delete: false,
        can_modify: false
    },

    parse: function(data) {
        //this.perms = data.perms;
        return data;
    },

    validate: function(attrs) {
        var errors = {};
        var hasError = false;

        if (hasError) {
          return errors;
        }
    },
});

module.exports = Model;

