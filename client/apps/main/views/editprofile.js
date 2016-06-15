/**
 * @file editprofile.js
 * @brief Edit user profile view
 * @author Frederic SCHERMA
 * @date 2016-06-14
 * @copyright Copyright (c) 2016 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var Marionette = require('backbone.marionette');

var View = Marionette.ItemView.extend({
    tagName: 'div',
    className: 'profile-edit',
    template: require('../templates/editprofile.html'),

    ui: {
    },

    events: {
    },

    initialize: function() {
    },

    onRender: function() {
    },
});

module.exports = View;
