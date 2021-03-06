/**
 * @file paneldescriptor.js
 * @brief Panel descriptor
 * @author Medhi BOULNEMOUR (INRA UMR1095)
 * @date 2017-11-27
 * @copyright Copyright (c) 2016 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

let Marionette = require('backbone.marionette');
let Dialog = require('../../main/views/dialog');
let DescriptorModel = require('../models/descriptor');
let LayoutDescriptorCollection = require('../collections/layoutdescriptor');

let View = Marionette.View.extend({
    className: 'descriptor-view',
    template: require('../templates/paneldescriptor.html'),

    ui: {
        'delete_descriptor_model_type': '.delete-descriptor',
        'name': '[name="name"]',
        'label': '[name="label"]',
        'mandatory': '[name="mandatory"]',
        'set_once': '[name="set_once"]',
        'condition': '[name="condition"]',
        // 'index': '[name="index"]',
        'top_placeholder': 'li.descriptor-top-placeholder',
        'bottom_placeholder': 'li.descriptor-bottom-placeholder',
    },

    events: {
        'dragstart': 'dragStart',
        'dragend': 'dragEnd',
        'dragover': 'dragOver',
        'dragenter': 'dragEnter',
        'dragleave': 'dragLeave',
        'drop': 'drop',
        'click @ui.delete_descriptor_model_type': 'deleteDescriptor',
        'click @ui.name': 'rename',
        'click @ui.label': 'editLabel',
        'click @ui.mandatory': 'toggleMandatory',
        'click @ui.set_once': 'toggleSetOnce',
        'click @ui.condition': 'editCondition',
        // 'click @ui.index': 'changeIndex'
    },

    initialize: function (options) {
        View.__super__.initialize.apply(this, arguments);

        this.listenTo(this.model, 'change', this.render, this);
    },

    onRender: function () {
        if (!session.user.isStaff && !session.user.isSuperUser) {
            $(this.ui.delete_descriptor_model_type).hide();
        }
    },

    dragStart: function (e) {
        if (e.target.classList[1] === 'descriptor-type') {
            // fix for firefox...
            e.originalEvent.dataTransfer.setData('text/plain', null);

            this.$el.css('opacity', '0.4');
            window.application.main.dnd.set(this, 'descriptor-type');
            this.triggerMethod('hide:addButton', this);
        }
    },

    dragEnd: function (e) {
        this.$el.css('opacity', '1.0');
        window.application.main.dnd.unset();
        this.triggerMethod('show:addButton', this);
    },

    dragOver: function (e) {
        if (e.originalEvent.preventDefault) {
            e.originalEvent.preventDefault();
        }

        if (window.application.main.dnd.hasView('descriptor-type')) {
            //e.originalEvent.dataTransfer.dropEffect = 'move';
            return false;
        }
    },

    dragEnter: function (e) {
        if (e.originalEvent.preventDefault) {
            e.originalEvent.preventDefault();
        }

        if (window.application.main.dnd.hasView('descriptor-type')) {

            this.dragEnterCount || (this.dragEnterCount = 0);
            ++this.dragEnterCount;

            if (this.dragEnterCount === 1) {

                if (window.application.main.dnd.get().$el.hasClass('descriptor-view')) {
                    if (this.model.get('position') < window.application.main.dnd.get().model.get('position')) {
                        this.ui.top_placeholder.css('display', 'block');
                    } else if (this.model.get('position') > window.application.main.dnd.get().model.get('position')) {
                        this.ui.bottom_placeholder.css('display', 'block');
                    } else if (this.model.get('panel_index') !== window.application.main.dnd.get().model.get('panel_index')) {
                        this.ui.top_placeholder.css('display', 'block');
                    }
                }

                return false;
            }
        }
    },

    dragLeave: function (e) {

        if (e.originalEvent.preventDefault) {
            e.originalEvent.preventDefault();
        }

        if (window.application.main.dnd.hasView('descriptor-type')) {

            this.dragEnterCount || (this.dragEnterCount = 1);
            --this.dragEnterCount;

            if (this.dragEnterCount === 0) {
                if (window.application.main.dnd.get().$el.hasClass('descriptor-view')) {
                    if (this.model.get('position') < window.application.main.dnd.get().model.get('position')) {
                        this.ui.top_placeholder.css('display', 'none');
                    } else if (this.model.get('position') > window.application.main.dnd.get().model.get('position')) {
                        this.ui.bottom_placeholder.css('display', 'none');
                    } else if (this.model.get('panel_index') !== window.application.main.dnd.get().model.get('panel_index')) {
                        this.ui.top_placeholder.css('display', 'none');
                    }
                }
                return false;
            }
        }
    },

    drop: function (e) {
        if (window.application.main.dnd.hasView('descriptor-type')) {
            if (e.originalEvent.stopPropagation) {
                e.originalEvent.stopPropagation();
            }

            this.dragEnterCount = 0;

            let elt = window.application.main.dnd.get();
            if (elt.$el.hasClass('descriptor-view')) {
                // useless drop on himself
                if (this === elt) {
                    return false;
                }

                // reset borders
                this.ui.top_placeholder.css('display', 'none');
                this.ui.bottom_placeholder.css('display', 'none');

                // ajax call
                let collection = this.model.collection;
                let current_position = elt.model.get('position');
                let current_panel = elt.model.collection.panel_index;
                let new_position = this.model.get('position');
                let new_panel = this.model.collection.panel_index;


                $.ajax({
                    type: "PUT",
                    url: window.application.url(['descriptor', 'layout', this.model.collection.model_id, 'descriptor', 'order']),
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        current_position: current_position,
                        new_position: new_position,
                        current_panel: current_panel,
                        new_panel: new_panel
                    })
                }).done(function () {
                    collection.fetch();
                    elt.model.collection.fetch();
                }).fail(function () {
                    $.alert.error(_t('Unable to reorder the types of model of descriptor'));
                })
            }

            return false;
        }
    },

    rename: function () {
        if (!session.user.isSuperUser || !session.user.isStaff) {
            return;
        }

        let ChangeName = require('../../main/views/entityrename');
        let changeName = new ChangeName({
            model: this.model,
            title: _t("Rename the type of model of descriptors")
        });

        changeName.render();
        changeName.ui.name.val(this.model.get('name'));

        return false;
    },

    editLabel: function () {
        let ChangeLabel = require('../../main/views/entitychangelabel');
        let changeLabel = new ChangeLabel({
            model: this.model,
            title: _t("Change the labels for the type of model of descriptor")
        });

        changeLabel.render();

        return false;
    },

    toggleMandatory: function () {
        if (!this.model.get('conditions') || !this.model.get('mandatory')) {
            this.model.save({mandatory: !this.model.get('mandatory')}, {patch: true, wait: true});
        }
    },

    toggleSetOnce: function () {
        this.model.save({set_once: !this.model.get('set_once')}, {patch: true, wait: true});
    },

    deleteDescriptor: function () {
        let collection = this.model.collection;
        let position = this.model.get('position');

        this.model.destroy({
            wait: true,
            success: function () {
                for (let model in collection.models) {
                    let dmt = collection.models[model];
                    if (dmt.get('position') > position) {
                        let new_position = dmt.get('position') - 1;
                        dmt.set('position', new_position);
                    }
                }
            }
        });
    },

    editCondition: function () {
        // alert("todo")
        let model = this.model;

        $.ajax({
            type: "GET",
            url: this.model.url() + 'condition/',
            dataType: 'json'
        }).done(function (data) {
            let condition = data;

            let ChangeCondition = Dialog.extend({
                template: require('../templates/descriptorcondition.html'),
                templateContext: function () {
                    return {
                        targets: this.collection.models,
                        condition: condition
                    };
                },

                attributes: {
                    id: "dlg_change_condition"
                },

                ui: {
                    condition: "#condition",
                    target: "#target",
                    condition_values: "div.condition-values",
                    destroy: "button.destroy"
                },

                events: {
                    'change @ui.condition': 'onSelectCondition',
                    'change @ui.target': 'onSelectTarget',
                    'click @ui.destroy': 'onDestroyCondition'
                },

                initialize: function (options) {
                    ChangeCondition.__super__.initialize.apply(this);
                },

                onRender: function () {
                    ChangeCondition.__super__.onRender.apply(this);
                    window.application.descriptor.views.conditions.drawSelect(this.ui.condition);

                    $(this.ui.target).selectpicker({container: 'body', style: 'btn-default'});

                    // initial values set after getting them from dropdown or autocomplete initialization
                    let condition = this.getOption('condition');
                    if (condition) {
                        this.definesValues = true;
                        this.defaultValues = condition.values;

                        /** @namespace condition.target_name */
                        let targetModel = this.collection.findWhere({name: condition.target_name});

                        this.ui.target.val(targetModel.get('id')).trigger('change');
                        this.ui.condition.val(condition.condition).trigger('change');
                    } else {
                        this.onSelectCondition();
                        this.onSelectTarget();
                    }
                },

                onBeforeDestroy: function () {
                    this.ui.target.selectpicker('destroy');
                    this.ui.condition.selectpicker('destroy');

                    if (this.descriptor && this.descriptor.widget) {
                        this.descriptor.widget.destroy();
                        this.descriptor.widget = null;
                    }

                    ChangeCondition.__super__.onBeforeDestroy.apply(this);
                },

                toggleCondition: function (condition) {
                    if (condition === 0 || condition === 1) {
                        this.ui.condition_values.hide(false);
                    } else {
                        this.ui.condition_values.show(false);
                    }
                },

                onSelectCondition: function () {
                    let val = parseInt(this.ui.condition.val());
                    this.toggleCondition(val);
                },

                onSelectTarget: function () {
                    let view = this;
                    let targetId = this.ui.target.val();

                    let model = this.collection.findWhere({id: parseInt(targetId)});
                    if (model) {
                        // destroy an older widget and label
                        if (this.descriptor && this.descriptor.widget) {
                            this.descriptor.widget.destroy();
                            this.ui.condition_values.children('label').remove();
                        }

                        this.descriptor = new DescriptorModel(
                            {id: model.get('id')},
                            {group_name: model.get('group_name')}
                        );

                        this.descriptor.fetch().then(function () {
                            let format = view.descriptor.get('format');

                            let condition = parseInt(view.ui.condition.val());
                            view.toggleCondition(condition);

                            // unit label
                            let unit = format.unit === "custom" ? 'custom_unit' in format ? format.custom_unit : "" : format.unit;

                            if (unit !== "") {
                                let label = $('<label class="control-label">' + _t("Value") + '&nbsp;<span>(' + unit + ')</span></label>');
                                view.ui.condition_values.append(label);
                            } else {
                                let label = $('<label class="control-label">' + _t("Value") + '</label>');
                                view.ui.condition_values.append(label);
                            }

                            let widget = window.application.descriptor.widgets.newElement(format.type);
                            widget.create(format, view.ui.condition_values, {
                                readOnly: false,
                                descriptorId: view.descriptor.id
                            });

                            if (view.definesValues) {
                                widget.set(format, view.definesValues, view.defaultValues, {
                                    descriptorId: view.descriptor.id
                                });
                            }

                            // save the descriptor format type widget instance
                            view.descriptor.widget = widget;

                            if (view.definesValues) {
                                view.definesValues = false;
                                view.defaultValues = null;
                            }
                        });
                    }
                },

                onDestroyCondition: function () {
                    let view = this;
                    let model = this.getOption('model');
                    let condition = this.getOption('condition');

                    // destroy the widget
                    if (this.descriptor && this.descriptor.widget) {
                        this.descriptor.widget.destroy();
                        this.descriptor.widget = null;
                    }

                    $.ajax({
                        type: "DELETE",
                        url: model.url() + "condition/",
                        contentType: "application/json; charset=utf-8"
                    }).done(function () {
                        $.alert.success(_t("Successfully removed !"));
                        model.set('condition', null)
                    }).always(function () {
                        view.destroy();
                    });
                },

                onApply: function () {
                    let view = this;
                    let model = this.getOption('model');
                    let condition = this.getOption('condition');

                    let data = {
                        target: parseInt(this.ui.target.val()),
                        condition: parseInt(this.ui.condition.val())
                    };

                    if (!this.descriptor || !this.descriptor.widget) {
                        return this.onDestroyCondition();
                    }

                    if (data.condition === 2 || data.condition === 3) {
                        data.values = this.descriptor.widget.values();
                    } else {
                        data.values = null;
                    }

                    // destroy the widget
                    // this.descriptor.widget.destroy();

                    // depending if the condition previously existed: post or put.
                    if (condition) {
                        $.ajax({
                            type: "PUT",
                            url: model.url() + "condition/",
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify(data)
                        }).done(function (result) {
                            $.alert.success(_t("Successfully defined !"));
                            model.set('condition', result)
                        }).always(function () {
                            view.destroy();
                        });
                    } else {
                        $.ajax({
                            type: "POST",
                            url: model.url() + "condition/",
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify(data)
                        }).done(function (result) {
                            $.alert.success(_t("Successfully defined !"));
                            model.set('condition', result)
                        }).always(function () {
                            view.destroy();
                        });
                    }
                }
            });

            let descriptorTargetCollection = new LayoutDescriptorCollection([], {
                model_id: model.collection.model_id,
            });

            descriptorTargetCollection.fetch().then(function () {
                let changeCondition = new ChangeCondition({
                    model: model,
                    condition: condition,
                    collection: descriptorTargetCollection
                });
                changeCondition.render();
            });
        });
    }
});

module.exports = View;
