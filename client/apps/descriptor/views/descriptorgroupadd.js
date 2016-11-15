/**
 * @file descriptorgroupadd.js
 * @brief Add a group of descriptors
 * @author Frederic SCHERMA
 * @date 2016-08-05
 * @copyright Copyright (c) 2016 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var Marionette = require('backbone.marionette');

var View = Marionette.ItemView.extend({
    tagName: 'div',
    className: 'group-add',
    template: require('../templates/descriptorgroupadd.html'),

    ui: {
        add_group_btn: 'span.add-group',
        add_group_name: 'input.group-name',
    },

    events: {
        'click @ui.add_group_btn': 'addGroup',
        'input @ui.add_group_name': 'onGroupNameInput',
    },

    initialize: function(options) {
        options || (options = {});
        this.collection = options.collection;
    },

    addGroup: function () {
        if (!this.ui.add_group_name.hasClass('invalid')) {
            this.collection.create({name: this.ui.add_group_name.val()}, {wait: true});
            $(this.ui.add_group_name).cleanField();
        }
    },

    validateGroupName: function() {
        var v = this.ui.add_group_name.val();
        var re = /^[a-zA-Z0-9_\-]+$/i;

        if (v.length > 0 && !re.test(v)) {
            $(this.ui.add_group_name).validateField('failed', gt.gettext("Invalid characters (alphanumeric, _ and - only)"));
            return false;
        } else if (v.length < 3) {
            $(this.ui.add_group_name).validateField('failed', gt.gettext('3 characters min'));
            return false;
        }

        return true;
    },

    onGroupNameInput: function () {
        if (this.validateGroupName()) {
            $.ajax({
                type: "GET",
                url: application.baseUrl + 'descriptor/group/search/',
                dataType: 'json',
                data: {filters: JSON.stringify({
                    method: 'ieq',
                    fields: 'name',
                    name: this.ui.add_group_name.val()})
                },
                el: this.ui.add_group_name,
                success: function(data) {
                    if (data.items.length > 0) {
                        for (var i in data.items) {
                            var t = data.items[i];

                            if (t.name.toUpperCase() == this.el.val().toUpperCase()) {
                                $(this.el).validateField('failed', gt.gettext('Group name already in usage'));
                                break;
                            }
                        }
                    } else {
                        $(this.el).validateField('ok');
                    }
                }
            });
        }
    },
});

module.exports = View;