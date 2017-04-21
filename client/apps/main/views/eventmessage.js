/**
 * @file eventmessage.js
 * @brief Eventmessage item view
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2017-01-01
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

var Marionette = require('backbone.marionette');

var View = Marionette.ItemView.extend({
    tagName: 'div',
    template: require('../templates/eventmessage.html'),
    className: "object event-message",

    ui: {
        "remove_event_message": "span.remove-event-message"
    },

    events: {
        "click @ui.remove_event_message": "onRemoveEventMessage"
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.render, this);
    },


    onRemoveEventMessage: function() {
        this.model.destroy();
    }
});

module.exports = View;

