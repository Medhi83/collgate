/**
 * @file panelaccessionlist.js
 * @brief Panel accession list view
 * @author Medhi BOULNEMOUR (INRA UMR1095)
 * @date 2016-12-19
 * @copyright Copyright (c) 2016 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

var AccessionView = require('../views/panelaccession');
var AdvancedTable = require('../../main/views/advancedtable');
var DescriptorsColumnsView = require('../../descriptor/mixins/descriptorscolumns');

var View = AdvancedTable.extend({
    template: require("../../descriptor/templates/entitylist.html"),
    className: 'advanced-table-container',
    childView: AccessionView,
    childViewContainer: 'tbody.entity-list',
    userSettingName: 'panel_accessions_list_columns',
    userSettingVersion: '1.0',

    defaultColumns: [
        {name: 'select', width: 'auto', sort_by: null},
        {name: 'code', width: 'auto', sort_by: null},
        {name: 'name', width: 'auto', sort_by: '+0'},
        {name: 'primary_classification_entry', width: 'auto', sort_by: null},
        {name: 'descriptor_meta_model', width: 'auto', sort_by: null},
        {name: 'synonym', width: 'auto', sort_by: null}
    ],

    columnsOptions: {
        'select': {
            label: '',
            width: 'auto',
            type: 'checkbox',
            glyphicon: ['fa-square-o', 'fa-square-o'],
            event: 'accession-select',
            fixed: true
        },
        'code': {label: _t('Code'), width: 'auto', minWidth: true, event: 'view-accession-details'},
        'name': {label: _t('Name'), width: 'auto', minWidth: true, event: 'view-accession-details'},
        'primary_classification_entry': {
            label: _t('Classification'),
            width: 'auto',
            minWidth: true,
            event: 'view-primary-classification-entry-details',
            custom: 'primaryClassificationEntryCell',
            field: 'name'
        },
        'descriptor_meta_model': {label: _t('Model'), width: 'auto', minWidth: true},
        'synonym': {
            label: _t('Synonym'),
            width: 'auto',
            minWidth: true,
            custom: 'synonymCell',
            field: 'name'
        }
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
        this.related_entity = this.getOption('related_entity');
        // var context_menu = options.context_menu;
        // this.listenTo(this.collection, 'reset', this.render, this);
    },

    onShowTab: function () {
        var view = this;

        var contextLayout = application.getView().getChildView('right');
        if (!contextLayout) {
            var DefaultLayout = require('../../main/views/defaultlayout');
            contextLayout = new DefaultLayout();
            application.getView().showChildView('right', contextLayout);
        }

        var TitleView = require('../../main/views/titleview');
        contextLayout.showChildView('title', new TitleView({
            title: _t("Accession actions"),
            glyphicon: 'fa-wrench'
        }));

        var actions = [
            'create-panel',
            'unlink-accessions'
        ];

        var PanelAccessionListContextView = require('./panelaccessionlistcontext');
        var contextView = new PanelAccessionListContextView({actions: actions});
        contextLayout.showChildView('content', contextView);

        contextView.on("panel:create", function () {
            view.onCreatePanel();
        });

        contextView.on("accessions:unlink", function () {
            view.onUnlinkAccessions();
        });

        View.__super__.onShowTab.apply(this, arguments);
    },

    onBeforeDetach: function () {
        application.main.defaultRightView();
    },

    onUnlinkAccessions: function () {
        var view = this;
        $.ajax({
                type: 'PATCH',
                url: application.baseUrl + 'accession/panel/' + this.model.id + '/accession/',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    'action': 'remove',
                    'selection': {
                        'select': view.getSelection('select'),
                        'from': {
                            'content_type': 'accession.accessionpanel',
                            'id': view.model.id
                        }
                        // 'filters': filters,
                        // 'search': search
                    }
                })
            }
        ).done(function () {
            // view.render();
            view.collection.fetch();
        });
    },

    onCreatePanel: function () {
        application.accession.controllers.panel.create(this.getSelection('select'), this.related_entity, this.collection.filters, this.collection.search);
    }
});

// support of descriptors columns extension
_.extend(View.prototype, DescriptorsColumnsView);

module.exports = View;
