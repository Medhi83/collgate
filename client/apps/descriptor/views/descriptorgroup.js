/**
 * @file descriptorgroup.js
 * @brief Group of type of descriptor item view
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2016-07-20
 * @copyright Copyright (c) 2016 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

var Marionette = require('backbone.marionette');
var Dialog = require('../../main/views/dialog');

var View = Marionette.ItemView.extend({
    tagName: 'tr',
    className: 'element object descriptor-group actions',
    template: require('../templates/descriptorgroup.html'),

    behaviors: {
        ActionBtnEvents: {
            behaviorClass: require('../../main/behaviors/actionbuttonevents'),
            actions: {
                edit: {display: false},
                tag: {display: true, title: gt.gettext("Edit label"), event: 'onRenameGroup'},
                manage: {display: true, event: 'viewDescriptorType'},
                remove: {display: true, event: 'deleteDescriptorGroup'}
            }
        }
    },

    ui: {
        status_icon: 'td.lock-status',
        delete_btn: 'td.action.remove',
        rename_btn: 'td.action.rename',
        manage_btn: 'td.action.manage'
    },

    events: {
       // 'click @ui.delete_btn': 'deleteDescriptorGroup',
       // 'click @ui.edit_btn': 'onRenameGroup',
       'click @ui.manage_btn': 'viewDescriptorType'
    },

    initialize: function () {
        this.listenTo(this.model, 'change', this.render, this);
    },

    actionsProperties: function() {
        var properties = {
            tag: {disabled: false},
            remove: {disabled: false}
        };

        if (!this.model.get('can_modify') || !session.user.isSuperUser || !session.user.isStaff) {
            properties.tag.disabled = true;
        }

        if (this.model.get('num_descriptor_types') > 0 || !this.model.get('can_delete') || !session.user.isSuperUser || !session.user.isStaff) {
            properties.remove.disabled = true;
        }

        return properties;
    },

    viewDescriptorType: function () {
        Backbone.history.navigate("app/descriptor/group/" + this.model.id + "/type/", {trigger: true});
        return false;
    },

    deleteDescriptorGroup: function () {
        if (this.model.get('num_descriptor_types') === 0) {
            this.model.destroy({wait: true});
        } else {
            $.alert.error(gt.gettext("Some types of descriptor exists for this group"));
        }
        return false;
    },

    onRenameGroup: function (e) {
        if (!this.model.get('can_modify') || !session.user.isSuperUser || !session.user.isStaff) {
            $.alert.error(gt.gettext("Can't rename"));
            return false;
        }

        var ChangeName = Dialog.extend({
            template: require('../templates/descriptorgrouprename.html'),

            attributes: {
                id: "dlg_change_name"
            },

            ui: {
                name: "#descriptor_group_name"
            },

            events: {
                'input @ui.name': 'onNameInput'
            },

            initialize: function (options) {
                ChangeName.__super__.initialize.apply(this);
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
