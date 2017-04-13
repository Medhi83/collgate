/**
 * @file grcdetails.js
 * @brief GRC details item view
 * @author Frederic SCHERMA
 * @date 2017-02-28
 * @copyright Copyright (c) 2017 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var Marionette = require('backbone.marionette');

var View = Marionette.ItemView.extend({
    tagName: 'div',
    className: 'object grc',
    template: require('../templates/grcdetails.html'),

    ui: {
        'name': 'input[name=name]',
        'identifier': 'input[name=identifier]',
        'description': 'textarea[name=description]',
        'save': '#grc_save'
    },

    events: {
        'click @ui.save': 'updateDetails'
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.render, this);
    },

    onRender: function() {
    },

    updateDetails: function() {
        this.model.save({
            name: this.ui.name.val(),
            identifier: this.ui.identifier.val(),
            description: this.ui.description.val()
        }, {
            success: function() {
                $.alert.success(gt.gettext("Done"));
            }
        });
    }
});

module.exports = View;