/**
 * @file classification.js
 * @brief Classification model
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2017-08-31
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

var Backbone = require('backbone');

var ClassificationModel = Backbone.Model.extend({
    url: function() {
        if (this.isNew())
            return application.baseUrl + 'classification/classification/';
        else
            return application.baseUrl + 'classification/classification/' + this.get('id') + '/'; },

    defaults: {
        id: null,
        name: '',
        label: '',
        num_ranks: 0
    },

    parse: function(data) {
        return data;
    },

    validate: function(attrs) {
        var errors = {};
        var hasError = false;
        if (!attrs.name) {
           errors.name = 'Name must be valid and at least 3 characters length';
            hasError = true;
        }

        if (hasError) {
          return errors;
        }
    }
});

module.exports = ClassificationModel;