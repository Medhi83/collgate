/**
 * @file descriptormodeltype.js
 * @brief Type of model of descriptor model
 * @author Frederic SCHERMA
 * @date 2016-10-13
 * @copyright Copyright (c) 2016 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var Backbone = require('backbone');

var Model = Backbone.Model.extend({
    url: function() {
        var model_id = this.model_id || this.get('model') || this.collection.model_id;

        if (this.isNew()) {
            return application.baseUrl + 'descriptor/model/' + model_id + '/type/';
        }
        else
            return application.baseUrl + 'descriptor/model/' + model_id + '/type/' + this.get('id') + '/';
    },

    defaults: {
        id: null,
        name: '',
        model: null,
        label: '',
        position: 0,
        descriptor_type_group: 0,
        descriptor_type: 0,
        descriptor_type_name: '',
        descriptor_type_code: '',
        mandatory: false,
        set_once: false,
    },

    initialize: function(attributes, options) {
        Model.__super__.initialize.apply(this, arguments);

        options || (options = {});

        if (options.collection) {
            this.model_id = options.collection.model_id;
        }
    },

    parse: function(data) {
        //this.perms = data.perms;
        this.model = data.model;
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
