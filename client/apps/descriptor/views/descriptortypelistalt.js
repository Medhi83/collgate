/**
 * @file descriptortypelistalt.js
 * @brief Alternative list of types of descriptors for a group view
 * @author Frederic SCHERMA
 * @date 2016-10-14
 * @copyright Copyright (c) 2016 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var ScrollView = require('../../main/views/scroll');
var DescriptorTypeAltView = require('../views/descriptortypealt');

var View = ScrollView.extend({
    template: require("../templates/descriptortypelistalt.html"),
    className: "object descriptor-type-list advanced-table-container",
    childView: DescriptorTypeAltView,
    childViewContainer: 'tbody.descriptor-type-list',

    ui: {
        'table': 'table.table'
    },

    events: {
    },

    initialize: function() {
        View.__super__.initialize.apply(this);

        this.listenTo(this.collection, 'reset', this.render, this);
    }
});

module.exports = View;
