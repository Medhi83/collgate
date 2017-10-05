/**
 * @file classificationentrylayout.js
 * @brief Optimized layout for classification entry details
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2016-12-27
 * @copyright Copyright (c) 2016 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

var LayoutView = require('../../main/views/layout');
var ScrollingMoreView = require('../../main/views/scrollingmore');
var ContentBottomLayout = require('../../main/views/contentbottomlayout');
var ClassificationEntryDescriptorEditView = require('./classificationentrydescriptoredit');

var Layout = LayoutView.extend({
    template: require("../templates/classificationentrylayout.html"),

    ui: {
        synonyms_tab: 'a[aria-controls=synonyms]',
        children_tab: 'a[aria-controls=children]',
        entities_tab: 'a[aria-controls=entities]',
        related_tab: 'a[aria-controls=related]'
    },

    regions: {
        'details': 'div[name=details]',
        'synonyms': 'div.tab-pane[name=synonyms]',
        'descriptors': 'div.tab-pane[name=descriptors]',
        'children': 'div.tab-pane[name=children]',
        'entities': 'div.tab-pane[name=entities]',
        'related': 'div.tab-pane[name=batches]'
    },

    initialize: function(options) {
        Layout.__super__.initialize.apply(this, arguments);

        this.listenTo(this.model, 'change:descriptor_meta_model', this.onDescriptorMetaModelChange, this);

        if (this.model.isNew()) {
            this.listenTo(this.model, 'change:id', this.onClassificationEntryCreate, this);
        }
    },

    onClassificationEntryCreate: function(model, value) {
        // re-render once created
        this.render();

        // and update history
        Backbone.history.navigate('app/classification/classificationentry/' + this.model.get('id') + '/', {/*trigger: true,*/ replace: false});
    },

    disableSynonymsTab: function () {
        this.ui.synonyms_tab.parent().addClass('disabled');
    },

    disableChildrenTab: function () {
        this.ui.children_tab.parent().addClass('disabled');
    },

    disableEntitiesTab: function () {
        this.ui.entities_tab.parent().addClass('disabled');
    },

    disableRelatedTab: function () {
        this.ui.related_tab.parent().addClass('disabled');
    },

    enableTabs: function() {
        this.ui.synonyms_tab.parent().removeClass('disabled');
        this.ui.children_tab.parent().removeClass('disabled');
        this.ui.entities_tab.parent().removeClass('disabled');
        this.ui.related_tab.parent().removeClass('disabled');
    },

    onDescriptorMetaModelChange: function(model, value) {
        if (value == null) {
            this.getRegion('descriptors').empty();
            // var ClassificationEntryDescriptorCreateView = require('./classificationentrydescriptorcreate');
            // var classificationEntryDescriptorCreateView = new ClassificationEntryDescriptorCreateView({model: model});
            //
            // this.showChildView('descriptors', classificationEntryDescriptorCreateView);
        } else {
            var classificationEntryLayout = this;

            // get the layout before creating the view
            $.ajax({
                method: "GET",
                url: application.baseUrl + 'descriptor/meta-model/' + value + '/layout/',
                dataType: 'json'
            }).done(function (data) {
                if (!classificationEntryLayout.isRendered()) {
                    return;
                }

                var ClassificationEntryDescriptorView = require('./classificationentrydescriptor');
                var classificationEntryDescriptorView = new ClassificationEntryDescriptorView({
                    model: model,
                    descriptorMetaModelLayout: data
                });

                classificationEntryLayout.showChildView('descriptors', classificationEntryDescriptorView);
            });
        }
    },

    onRender: function() {
        var classificationEntryLayout = this;

        // details view
        if (!this.model.isNew()) {
            // details views
            var ClassificationEntryDetailsView = require('./classificationentrydetails');
            this.showChildView('details', new ClassificationEntryDetailsView({model: this.model}));

            // synonyms tab
            var ClassificationEntrySynonymsView = require('./classificationentrysynonyms');
            this.showChildView('synonyms', new ClassificationEntrySynonymsView({model: this.model}));

            // direct classification entry sub-levels tab
            var ClassificationEntryChildrenCollection = require('../collections/classificationentrychildren');
            var classificationEntryChildren = new ClassificationEntryChildrenCollection([], {model_id: this.model.id});

            // get available columns
            var columns = application.main.cache.lookup({
                type: 'entity_columns',
                format: {model: 'classification.classificationentry'}
            });

            $.when(columns, classificationEntryChildren.fetch()).then(function(data) {
                if (!classificationEntryLayout.isRendered()) {
                    return;
                }

                var ClassificationEntryChildrenView = require('./classificationentrychildren');
                var classificationEntryChildrenView = new ClassificationEntryChildrenView({
                    collection: classificationEntryChildren,
                    model: classificationEntryLayout.model,
                    columns: data[0].value});

                var contentBottomLayout = new ContentBottomLayout();
                classificationEntryLayout.showChildView('children', contentBottomLayout);

                contentBottomLayout.showChildView('content', classificationEntryChildrenView);
                contentBottomLayout.showChildView('bottom', new ScrollingMoreView({
                    targetView: classificationEntryChildrenView, collection: classificationEntryChildren}));
            });

            // entities relating this classificationEntry tab
            var ClassificationEntryEntitiesCollection = require('../collections/classificationentryentities');
            var classificationEntryEntities = new ClassificationEntryEntitiesCollection([], {model_id: this.model.id});

            classificationEntryEntities.fetch().then(function () {
                if (!classificationEntryLayout.isRendered()) {
                    return;
                }

                var ClassificationEntryEntitiesView = require('./classificationentryentities');
                var classificationEntryEntitiesView = new ClassificationEntryEntitiesView({
                    collection: classificationEntryEntities, model: classificationEntryLayout.model});

                var contentBottomLayout = new ContentBottomLayout();
                classificationEntryLayout.showChildView('entities', contentBottomLayout);

                contentBottomLayout.showChildView('content', classificationEntryEntitiesView);
                contentBottomLayout.showChildView('bottom', new ScrollingMoreView({targetView: classificationEntryEntitiesView}));
            });

            this.onDescriptorMetaModelChange(this.model, this.model.get('descriptor_meta_model'));
            this.enableTabs();
        } else {
            // details views
            var ClassificationEntryDetailsView = require('./classificationentrydetails');
            this.showChildView('details', new ClassificationEntryDetailsView({model: this.model}));

            // descriptors edit tab
            $.ajax({
                method: "GET",
                url: application.baseUrl + 'descriptor/meta-model/' + this.model.get('descriptor_meta_model') + '/layout/',
                dataType: 'json'
            }).done(function(data) {
                if (!classificationEntryLayout.isRendered()) {
                    return;
                }

                var classificationEntryDescriptorView = new ClassificationEntryDescriptorEditView({
                    model: classificationEntryLayout.model, descriptorMetaModelLayout: data});

                classificationEntryLayout.showChildView('descriptors', classificationEntryDescriptorView);
            });

            this.setActiveTab("descriptors");

            this.disableSynonymsTab();
            this.disableChildrenTab();
            this.disableEntitiesTab();
            this.disableRelatedTab();
        }
    },

    // onDomRefresh: function() {
    //     No longer useful
    //     descriptors tab (on this event because of the child event not fired otherwise)
    //     var ClassificationEntryDescriptorCreateView = require('../views/classificationentrydescriptorcreate');
    //     var classificationEntryDescriptorCreateView = new ClassificationEntryDescriptorCreateView({model: this.model});
    //     this.showChildView('descriptors', classificationEntryDescriptorCreateView);
    // }
});

module.exports = Layout;
