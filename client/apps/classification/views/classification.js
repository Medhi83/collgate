/**
 * @file classification.js
 * @brief Classification item view
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2017-09-04
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

var Marionette = require('backbone.marionette');
var Dialog = require('../../main/views/dialog');

var View = Marionette.View.extend({
    tagName: 'tr',
    className: 'element object classification actions',
    template: require('../templates/classification.html'),

    behaviors: {
        ActionBtnEvents: {
            behaviorClass: require('../../main/behaviors/actionbuttonevents'),
            actions: {
                edit: {display: true, title: gt.gettext("Rename classification"), event: 'renameClassification'},
                tag: {display: true, title: gt.gettext("Edit label"), event: 'editLabel'},
                manage: {display: true, event: 'viewClassificationRanks'},
                remove: {display: true, event: 'deleteClassification'}
            }
        }
    },

    ui: {
        status_icon: 'td.lock-status',
        delete_btn: 'td.action.remove',
        edit_label_btn: 'td.action.edit-label',
        edit2_label_btn: 'td.action.rename',
        manage_btn: 'td.action.manage'
    },

    events: {
       // 'click @ui.delete_btn': 'deleteClassification',
       'click @ui.edit_label_btn': 'editLabel',
       'click @ui.edit2_label_btn': 'renameClassification',
       'click @ui.manage_btn': 'viewClassificationRanks'
    },

    initialize: function () {
        this.listenTo(this.model, 'change', this.render, this);
    },

    actionsProperties: function() {
        var properties = {
            tag: {disabled: false},
            remove: {disabled: false},
            edit: {disabled: false},
            edit2: {disabled: false}
        };

        // @todo do we want can_modify/can_delete like for descriptor ?
        if (!this.model.get('can_modify') || !session.user.isSuperUser || !session.user.isStaff) {
            properties.tag.disabled = true;
            properties.edit.disabled = true;
            properties.edit2.disabled = true;
        }

        if (this.model.get('num_classification_ranks') > 0 || !this.model.get('can_delete') || !session.user.isSuperUser || !session.user.isStaff) {
            properties.remove.disabled = true;
        }

        return properties;
    },

    viewClassificationRanks: function () {
        Backbone.history.navigate("app/classification/classification/" + this.model.id + "/classificationrank/", {trigger: true});
        return false;
    },

    deleteClassification: function () {
        if (this.model.get('num_classification_ranks') === 0) {
            this.model.destroy({wait: true});
        } else {
            $.alert.error(gt.gettext("Some ranks exists for this classification"));
        }
        return false;
    },

    editLabel: function() {
        var model = this.model;

        if (!model.get('can_modify') || !session.user.isSuperUser || !session.user.isStaff) {
            return false;
        }

        $.ajax({
            type: "GET",
            url: this.model.url() + 'label/',
            dataType: 'json'
        }).done(function (data) {
            var labels = data;

            var ChangeLabel = Dialog.extend({
                template: require('../templates/classificationchangelabel.html'),
                templateContext: function () {
                    return {
                        labels: labels
                    };
                },

                attributes: {
                    id: "dlg_change_labels"
                },

                ui: {
                    label: "form.entity-labels input"
                },

                events: {
                    'input @ui.label': 'onLabelInput'
                },

                initialize: function (options) {
                    ChangeLabel.__super__.initialize.apply(this);
                },

                onLabelInput: function (e) {
                    this.validateLabel(e);
                },

                validateLabel: function (e) {
                    var v = $(e.target).val();

                    if (v.length < 3) {
                        $(e.target).validateField('failed', gt.gettext('3 characters min'));
                        return false;
                    } else if (v.length > 128) {
                        $(e.target).validateField('failed', gt.gettext('128 characters max'));
                        return false;
                    }

                    $(e.target).validateField('ok');

                    return true;
                },

                validateLabels: function () {
                    $.each($(this.ui.label), function (i, label) {
                        var v = $(this).val();

                        if (v.length < 3) {
                            $(this).validateField('failed', gt.gettext('3 characters min'));
                            return false;
                        } else if (v.length > 128) {
                            $(this).validateField('failed', gt.gettext('128 characters max'));
                            return false;
                        }
                    });

                    return true;
                },

                onApply: function () {
                    var view = this;
                    var model = this.getOption('model');

                    var labels = {};

                    $.each($(this.ui.label), function (i, label) {
                        var v = $(this).val();
                        labels[$(label).attr("language")] = v;
                    });

                    if (this.validateLabels()) {
                        $.ajax({
                            type: "PUT",
                            url: model.url() + "label/",
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify(labels)
                        }).done(function () {
                            // manually update the current context label
                            model.set('label', labels[session.language]);
                            $.alert.success(gt.gettext("Successfully labeled !"));
                        }).always(function () {
                            view.destroy();
                        });
                    }
                }
            });

            var changeLabel = new ChangeLabel({model: model});
            changeLabel.render();
        });
    },

    renameClassification: function() {
        var ChangeName = Dialog.extend({
            template: require('../templates/classificationrename.html'),

            attributes: {
                id: "dlg_change_name"
            },

            ui: {
                name: "input.classification-name"
            },

            events: {
                'input @ui.name': 'onNameInput'
            },

            initialize: function (options) {
                ChangeName.__super__.initialize.apply(this ,arguments);
            },

            onNameInput: function () {
                this.validateName();
            },

            validateName: function () {
                var v = this.ui.name.val();
                var re = /^[a-zA-Z0-9_\-]+$/i;

                if (v.length > 0 && !re.test(v)) {
                    this.ui.name.validateField('failed', gt.gettext("Invalid characters (alphanumeric, _ and - only)"));
                    return false;
                } else if (v.length < 3) {
                    this.ui.name.validateField('failed', gt.gettext('3 characters min'));
                    return false;
                } else if (v.length > 128) {
                    this.ui.name.validateField('failed', gt.gettext('128 characters max'));
                    return false;
                }

                this.ui.name.validateField('ok');

                return true;
            },

            onApply: function () {
                var name = this.ui.name.val();
                var model = this.getOption('model');

                if (this.validateName()) {
                    model.save({name: name}, {
                        patch: true, wait: true, success: function () {
                            $.alert.success('Done');
                        }
                    });
                    this.destroy();
                }
            }
        });

        var changeName = new ChangeName({
            model: this.model
        });

        changeName.render();
        changeName.ui.name.val(this.model.get('name'));

        return false;
    }
});

module.exports = View;
