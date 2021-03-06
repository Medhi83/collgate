/**
 * @file numeric.js
 * @brief Display and manage a numeric format of type of descriptor
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2017-01-20
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

let DescriptorFormatType = require('./descriptorformattype');
let Marionette = require('backbone.marionette');

let Numeric = function() {
    DescriptorFormatType.call(this);

    this.name = "numeric";
    this.group = "single";

    this.precision = 0;
};

_.extend(Numeric.prototype, DescriptorFormatType.prototype, {
    create: function(format, parent, options) {
        options || (options = {
            readOnly: false,
            history: false
        });

        this.precision = format.precision;

        if (options.readOnly) {
            let input = this._createStdInput(parent, "fa-cog", options.history);

            this.parent = parent;
            this.readOnly = true;
            this.el = input;
        } else {
            let input = $('<input class="form-control" width="100%">');
            let clean = $('<span class="form-clean-btn action fa fa-eraser"></span>');
            this.groupEl = this._createInputGroup(parent, "fa-cog", input, options.history);

            clean.insertAfter(input);

            if (options.history) {
                // adjust position
                clean.css('right', '90px');
            }

            clean.on('click', function() {
               input.val("");
            });

            input.numeric({
                allowPlus           : false,
                allowMinus          : true,
                allowThouSep        : false,
                allowDecSep         : true,
                allowLeadingSpaces  : false,
                maxDigits           : NaN,
                maxDecimalPlaces    : format.precision,
                maxPreDecimalPlaces : NaN,
                max                 : NaN,
                min                 : NaN
            });

            this.parent = parent;
            this.el = input;
        }
    },

    destroy: function() {
        if (this.el && this.parent) {
            if (this.readOnly) {
                this.el.parent().remove();
            } else {
                this.el.parent().remove();
            }
        }
    },

    enable: function() {
        if (this.el) {
            this.el.prop("disabled", false);
        }
    },

    disable: function() {
        if (this.el) {
            this.el.prop("disabled", true);
        }
    },

    set: function (format, definesValues, defaultValues, options) {
        if (!this.el || !this.parent) {
            return;
        }

        definesValues = this.isValueDefined(definesValues, defaultValues);

        if (this.readOnly) {
            if (definesValues) {
                this.el.val(defaultValues);
            } else {
                this.el.val("");
            }
        } else {
            if (definesValues) {
                this.el.val(defaultValues);
            } else {
                this.el.val("");
            }
        }
    },

    values: function() {
        if (this.el && this.parent) {
            let value = parseFloat(this.el.val());
            return _.isNaN(value) ? null : value.toFixed(this.precision);
        }

        return null;
    },

    checkCondition: function (condition, values) {
        switch (condition) {
            case 0:
                return this.values() == null;
            case 1:
                return this.values() != null;
            case 2:
                return this.values() === values;
            case 3:
                return this.values() !== values;
            default:
                return false;
        }
    },

    bindConditionListener: function(listeners, condition, values) {
        if (this.el && this.parent && !this.readOnly) {
            if (!this.bound) {
                this.el.on('input', $.proxy(this.onValueChanged, this));
                this.bound = true;
            }

            this.conditionType = condition;
            this.conditionValues = values;
            this.listeners = listeners || [];
        }
    },

    onValueChanged: function(e) {
        let display = this.checkCondition(this.conditionType, this.conditionValues);

        // show or hide the parent element
        if (display) {
            for (let i = 0; i < this.listeners.length; ++i) {
                this.listeners[i].parent.parent().show(true);
            }
        } else {
            for (let i = 0; i < this.listeners.length; ++i) {
                this.listeners[i].parent.parent().hide(true);
            }
        }
    }
});

Numeric.DescriptorTypeDetailsView = Marionette.View.extend({
    className: 'descriptor-type-details-format',
    template: require('../templates/widgets/numeric.html'),

    ui: {
        'format_unit': '#format_unit',
        'format_unit_custom': '#format_unit_custom',
        'format_precision': '#format_precision'
    },

    events: {
        'change @ui.format_unit': 'changeFormatUnit',
        'input @ui.format_unit_custom': 'inputFormatUnitCustom'
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.render, this);
    },

    onRender: function() {
        application.descriptor.views.formatUnits.drawSelect(this.ui.format_unit);

        this.ui.format_precision.selectpicker({style: 'btn-default', container: 'body'});

        let format = this.model.get('format');

        if (format.unit != undefined) {
            this.ui.format_unit.selectpicker('val', format.unit);
        }

        if (format.precision != undefined) {
            this.ui.format_precision.selectpicker('val', format.precision);
        }
    },

    getFormat: function() {
        let customUnit = this.ui.format_unit.val() === "custom" ? this.ui.format_unit_custom.val() : "";

        return {
            'unit': this.ui.format_unit.val(),
            'custom_unit': customUnit,
            'precision': this.ui.format_precision.val()
        }
    },

    changeFormatUnit: function () {
        let unit = $(this.ui.format_unit).val();

        switch (unit) {
            case "custom":
                this.ui.format_unit_custom.prop("disabled", false).val("");
                $(this.ui.format_unit_custom).cleanField();
                break;
            default:
                this.ui.format_unit_custom.prop("disabled", true).val("");
                $(this.ui.format_unit_custom).cleanField();
                break;
        }
    },

    inputFormatUnitCustom: function () {
        let v = this.ui.format_unit_custom.val();
        let re = /^[a-zA-Z0-9_\-%°⁼⁺⁻⁰¹²³⁴⁵⁶⁷⁸⁹/µ]+$/i;

        if (v.length > 0 && !re.test(v)) {
            $(this.ui.format_unit_custom).validateField('failed', _t("Invalid characters (alphanumeric, _-°%°⁼⁺⁻⁰¹²³⁴⁵⁶⁷⁸⁹/µ allowed)"));
        } else if (v.length > 32) {
            $(this.ui.format_unit_custom).validateField('failed', _t('characters_max', {count: 32}));
        } else if (v.length < 1) {
            //$(this.ui.format_unit_custom).validateField('failed', _t('characters_min', {count: 1})););
            $(this.ui.format_unit_custom).cleanField();
        } else {
            $(this.ui.format_unit_custom).validateField('ok');
        }
    }
});

module.exports = Numeric;
