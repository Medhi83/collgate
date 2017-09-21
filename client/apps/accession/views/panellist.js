/**
 * @file panellist.js
 * @brief
 * @author Medhi BOULNEMOUR (INRA UMR1095)
 * @date 2017-09-12
 * @copyright Copyright (c) 2016 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

var PanelView = require('../views/panel');
var ScrollView = require('../../main/views/scroll');

var View = ScrollView.extend({
    template: require("../../descriptor/templates/entitylist.html"),
    className: "panel-list advanced-table-container",
    childView: PanelView,
    childViewContainer: 'tbody.entity-list',
    userSettingName: 'panel_list_columns',

    defaultColumns: [
        // {name: 'select', width: 'auto', sort_by: null},
        {name: 'name', width: 'auto', sort_by: '+0'}
    ],

    columnsOptions: {
        // 'select': {
        //     label: '',
        //     width: 'auto',
        //     type: 'checkbox',
        //     glyphicon: ['glyphicon-unchecked', 'glyphicon-unchecked'],
        //     event: 'panel-select',
        //     fixed: true
        // },
        'name': {label: gt.gettext('Name'), width: 'auto', minWidth: true, event: 'view-panel-details'}
    },

    templateContext: function () {
        return {
            columnsList: this.displayedColumns,
            columnsOptions: this.getOption('columns')
        }
    },

    childViewOptions: function () {
        return {
            columnsList: this.displayedColumns,
            columnsOptions: this.getOption('columns')
        }
    },

    initialize: function (options) {
        View.__super__.initialize.apply(this, arguments);
    }
});

module.exports = View;