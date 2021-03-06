/**
 * @file descriptorvalue.js
 * @brief Value for a type of descriptor model
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2016-07-21
 * @copyright Copyright (c) 2016 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

let Backbone = require('backbone');

let Model = Backbone.Model.extend({
    url: function() {
        if (this.isNew()) {
            return window.application.url(['descriptor', 'descriptor', this.type_id, 'value']);
        } else {
            return window.application.url(['descriptor', 'descriptor', this.type_id, 'value', this.id]);
        }
    },

    defaults: {
        id: null,
        parent: null,
        ordinal: null,
        value0: null,
        value1: null,
    },

    initialize: function(attributes, options) {
        Model.__super__.initialize.apply(this, arguments);

        options || (options = {});
        this.type_id = options.type_id;

        if (options.collection) {
            this.type_id = options.collection.type_id;
        }
    },

    parse: function(data) {
        //this.perms = data.perms;
        return data;
    },

    validate: function(attrs) {
        let errors = {};
        let hasError = false;

        if (hasError) {
          return errors;
        }
    },
});

module.exports = Model;
