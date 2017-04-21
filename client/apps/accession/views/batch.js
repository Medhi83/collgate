/**
 * @file batch.js
 * @brief Batch item view
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2017-02-14
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

var Marionette = require('backbone.marionette');

var View = Marionette.ItemView.extend({
    tagName: 'tr',
    className: 'object batch element',
    attributes: {
        'scope': 'row',
    },
    template: require('../templates/batch.html'),

    templateHelpers/*templateContext*/: function () {
        return {
            columns: this.getOption('columns')
        }
    },

    ui: {
        details: 'td.view-batch-details',
        accession: 'td.view-accession-details'
    },

    events: {
        'click @ui.details': 'viewDetails',
        'click @ui.accession': 'viewAccession'
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.render, this);
    },

    onRender: function() {
    },

    viewDetails: function () {
        Backbone.history.navigate('app/accession/batch/' + this.model.get('id') + '/', {trigger: true});
    },

    viewAccession: function () {
        Backbone.history.navigate('app/accession/accession/' + this.model.get('accession') + '/', {trigger: true});
    }
});

module.exports = View;

