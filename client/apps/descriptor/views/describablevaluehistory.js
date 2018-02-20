/**
 * @file describablevaluehistory.js
 * @brief Dialog that display a list of value from an history of describable entity
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2017-11-13
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

let Dialog = require('../../main/views/dialog');

let View = Dialog.extend({
    template: require('../templates/describablevaluehistory.html'),

    templateContext: function () {
        return {
            title: this.title,
            descriptor_model_type: this.descriptorModelType,
            values: this.entries,
            unit: ""
        };
    },

    attributes: {
        id: "dlg_describable_show_value_history"
    },

    ui: {
        descriptor_value: 'li.descriptor-value'
    },

    events: {
        'click @ui.descriptor_value': 'selectDescriptorValue'
    },

    initialize: function (options) {
        options || (options = {});

        View.__super__.initialize.apply(this, arguments);

        this.descriptorModelType = options.descriptorModelType;
        this.entries = options.entries;

        this.unit = "";

        if (this.descriptorModelType.get('format').unit === "custom" && this.descriptorModelType.get('format').custom_unit !== "") {
            this.unit = this.descriptorModelType.get('format').custom_unit;
        } else if (this.descriptorModelType.get('format').unit) {
            this.unit = window.application.descriptor.collections.formatUnits.findLabel(this.descriptorModelType.get('format').unit);
        }

        this.model = options.model;
        this.readOnly = options.readOnly;
    },

    onRender: function () {
        View.__super__.onRender.apply(this);

        $("ul.descriptor-value-history li").css({
            "list-style-type": "none"
        });

        let self = this;

        // setup widget for each value
        let elts = $("li.descriptor-value span.history-value");

        let descriptorType = this.descriptorModelType;
        let format = descriptorType.get('format');

        $.each(elts, function(i, elt) {
            let widget = window.application.descriptor.widgets.newElement(format.type);

            if (widget) {
                widget.create(format, $(elt), {
                    readOnly: true,
                    history: false,
                    descriptorTypeId: descriptorType.get('id')
                });

                widget.set(format, true, self.entries[i].value, {
                    descriptorTypeId: descriptorType.get('id'),
                    descriptorModelType: self.descriptorModelType
                });
            }

            if (!self.readOnly) {
                $(elt).addClass('element').css('cursor', 'pointer').on('click', function(e) {
                    self.descriptorModelType.widget.set(
                        self.descriptorModelType.get('format'),
                        true,
                        widget.values());

                    self.destroy();
                });
            }
        });
    },

    selectDescriptorValue: function () {
        // @todo
    }
});

module.exports = View;
