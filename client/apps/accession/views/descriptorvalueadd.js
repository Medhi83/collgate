/**
 * @file descriptorvalueadd.js
 * @brief Add a value for a descriptor
 * @author Frederic SCHERMA
 * @date 2016-10-31
 * @copyright Copyright (c) 2016 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var Marionette = require('backbone.marionette');

var View = Marionette.ItemView.extend({
    tagName: 'div',
    className: 'type-add',
    template: require('../templates/descriptorvalueadd.html'),

    ui: {
        add_value_btn: 'span.add-descriptor-value',
        value: 'input.descriptor-value',
    },

    events: {
        'click @ui.add_value_btn': 'addValue',
        'input @ui.value': 'onValueInput',
    },

    initialize: function(options) {
        options || (options = {});
        this.collection = options.collection;
    },

    addValue: function () {
        if (!this.ui.value.hasClass('invalid')) {
            this.collection.create({
                value0: this.ui.value.val(),
            }, {wait: true});

            $(this.ui.value).cleanField();
        }
    },

    validateValue: function() {
        var v = this.ui.value.val();

        if (v.length < 1) {
            $(this.ui.value).validateField('failed', gt.gettext('1 character min'));
            return false;
        }

        return true;
    },

    onValueInput: function () {
        if (this.validateValue()) {
            $(this.ui.value).validateField('ok');
        }
    },
});

module.exports = View;
