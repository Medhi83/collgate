/**
 * @file entitypath.js
 * @brief Classification entry path + entity name item view
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2016-12-29
 * @copyright Copyright (c) 2016 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

var Marionette = require('backbone.marionette');
var Dialog = require('../../main/views/dialog');

var ClassificationEntryModel = require('../models/classificationentry');

var View = Marionette.View.extend({
    tagName: 'div',
    template: require('../templates/entitypath.html'),
    templateContext: function () {
        return {
            classificationEntry: this.classificationEntry
        };
    },

    classificationEntry: {name: '', rank: 0, parent_details: []},
    noLink: false,

    attributes: {
        style: "height: 25px; overflow-y: auto;"
    },

    ui: {
        view_classification_entry: ".view-classification-entry",
        change_parent: ".change-parent"
    },

    events: {
        'click @ui.view_classification_entry': 'onViewClassificationEntry',
        'click @ui.change_parent': 'onChangeParent'
    },

    initialize: function(options) {
        this.mergeOptions(options, ['classificationEntry']);

        this.listenTo(this.model, 'change:name', this.render, this);
        this.listenTo(this.model, 'change:primary_classification_entry', this.updateParent, this);
    },

    updateParent: function(model, value) {
        var view = this;

        // update the classificationEntry
        this.classificationEntry = new ClassificationEntryModel({id: value});
        this.classificationEntry.fetch().then(function() {
            view.render();
        });
    },

    onRender: function() {
        var values = [];
        var self = this;
/*
        this.$el.find('span.classification-rank').popupcell('init', {
            type: 'entity',
            className: ''
            format: {
                model: 'classification.classificationrank',
                details: true
            }
        });*/

        // @todo factorize
        this.$el.find('span.classification-rank').each(function(i, element) {
            values.push(parseInt($(this).attr('value')));
        });

        application.main.cache.lookup({
            type: 'entity',
            format: {
                model: 'classification.classificationrank',
                details: true
            }
        }, values).done(function (data) {
            self.$el.find('span.classification-rank').each(function(i, element) {
                var value = $(this).attr('value');

                $(this).attr('data-content', data[value].value.label)
                    .popover({trigger: 'hover', placement: 'bottom'});
            });
        });

        if (this.getOption('noLink')) {
            this.ui.view_classification_entry.removeClass('action');
        }
    },

    onViewClassificationEntry: function(e) {
        if (this.getOption('noLink')) {
            return;
        }

        var cls_id = $(e.target).data('classification-entry-id');
        Backbone.history.navigate("app/classification/classificationentry/" + cls_id + "/", {trigger: true});
    },

    onChangeParent: function() {
        var ChangeParent = Dialog.extend({
            template: require('../templates/classificationentrychangeparent.html'),

            attributes: {
                id: "dlg_change_parent"
            },

            ui: {
                parent: "#classification_entry_parent"
            },

            initialize: function (options) {
                ChangeParent.__super__.initialize.apply(this);
            },

            onRender: function () {
                ChangeParent.__super__.onRender.apply(this);

                var classificationRankId = this.getOption('classificationEntry').get('id');

                $(this.ui.parent).select2({
                    dropdownParent: $(this.el),
                    ajax: {
                        url: application.baseUrl + "classification/classificationentry/search/",
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            params.term || (params.term = '');

                            var filters = {
                                method: 'icontains',
                                fields: ['name', 'rank'],
                                'name': params.term,
                                'rank': classificationRankId
                            };

                            return {
                                page: params.page,
                                filters: JSON.stringify(filters),
                            };
                        },
                        processResults: function (data, params) {
                            // no pagination
                            params.page = params.page || 1;

                            var results = [];

                            for (var i = 0; i < data.items.length; ++i) {
                                results.push({
                                    id: data.items[i].id,
                                    text: data.items[i].label
                                });
                            }

                            return {
                                results: results,
                                pagination: {
                                    more: (params.page * 30) < data.total_count
                                }
                            };
                        },
                        cache: true
                    },
                    minimumInputLength: 3,
                    placeholder: gt.gettext("Enter a classification entry name. 3 characters at least for auto-completion"),
                });
            },

            onBeforeDestroy: function() {
                this.ui.parent.select2('destroy');

                ChangeParent.__super__.onBeforeDestroy.apply(this);
            },

            onApply: function() {
                var model = this.getOption('model');
                var classificationEntryId = parseInt($(this.ui.parent).val());

                if (isNaN(classificationEntryId)) {
                    $.alert.error(gt.gettext('Undefined classification entry.'));
                    return false;
                }

                if (model.isNew()) {
                    model.set('primary_classification_entry', classificationEntryId);
                } else {
                    model.save({primary_classification_entry: classificationEntryId}, {patch: true, wait: true});
                }

                this.destroy();
            },
        });

        var changeParent = new ChangeParent({
            model: this.model,
            classificationEntry: this.classificationEntry
        });

        changeParent.render();
    }
});

module.exports = View;
