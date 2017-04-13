/**
 * @file config.js
 * @brief Config item view
 * @author Frederic SCHERMA
 * @date 2017-03-22
 * @copyright Copyright (c) 2017 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var Marionette = require('backbone.marionette');
var ConfigModel = require('../models/config');

var View = Marionette.ItemView.extend({
    tagName: 'div',
    template: require('../templates/config.html'),
    className: "object config",

    ui: {
    },

    events: {
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.render, this);
    },

    onRender: function() {
    }
});

module.exports = View;