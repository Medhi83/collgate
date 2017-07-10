/**
 * @file descriptormetamodel.js
 * @brief Display and manage a meta-model of descriptor reference value format
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2017-07-10
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

var DescriptorFormatType = require('./descriptorformattype');

var DescriptorMetaModel = function() {
    DescriptorFormatType.call(this);

    this.name = "descriptor_meta_model";
    this.group = "reference";
    this.searchUrl = null
};

_.extend(DescriptorMetaModel.prototype, DescriptorFormatType.prototype, {
    create: function(format, parent, readOnly) {
        readOnly || (readOnly = false);

        if (readOnly) {
            var input = this._createStdInput(parent, "glyphicon-folder-open");

            this.parent = parent;
            this.readOnly = true;
            this.el = input;
        } else {
            var select = $('<select style="width: 100%;"></select>');
            this.group = this._createInputGroup(parent, "glyphicon-folter-open", select);

            // init the autocomplete
            var url = application.baseUrl + "descriptor/meta-model/";
            var initials = [];

            var container = parent.closest('div.modal-dialog').parent();
            if (container.length === 0) {
                container = this.group;  // parent.closest('div.panel');
            }

            var params = {
                data: initials,
                dropdownParent: container,
                ajax: {
                    url: url + 'search/',
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        params.term || (params.term = '');

                        return {
                            filters: JSON.stringify({
                                method: 'icontains',
                                fields: ['name_or_label', 'model'],
                                name: params.term,
                                model: format.model
                            }),
                            cursor: params.next
                        };
                    },
                    processResults: function (data, params) {
                        params.next = null;

                        if (data.items.length >= 30) {
                            params.next = data.next || null;
                        }

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
                                more: params.next != null
                            }
                        };
                    },
                    cache: true
                },
                allowClear: true,
                minimumInputLength: 3,
                placeholder: gt.gettext("Enter a value. 3 characters at least for auto-completion")
            };

            // make an autocomplete widget on simple_value
            select.select2(params).fixSelect2Position();

            this.parent = parent;
            this.el = select;
        }
    },

    destroy: function() {
        if (this.el && this.parent) {
            if (this.readOnly) {
                this.el.parent().remove();
            } else {
                this.el.select2('destroy');
                this.group.remove();
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

    set: function (format, definesValues, defaultValues, descriptorTypeGroup, descriptorTypeId) {
        if (!this.el || !this.parent) {
            return;
        }

        definesValues = this.isValueDefined(definesValues, defaultValues);

        var url = application.baseUrl + "descriptor/meta-model/";

        if (this.readOnly) {
            var type = this;

            if (definesValues) {
                this.el.attr('value', defaultValues);

                $.ajax({
                    type: "GET",
                    url: url + defaultValues + '/',
                    dataType: 'json'
                }).done(function (data) {
                    type.el.val(data.name);
                });
            }
        } else {
            if (definesValues) {
                var type = this;

                // need to re-init the select2 widget
                this.el.select2('destroy');

                // init the autocomplete
                var initials = [];

                var container = this.parent.closest('div.modal-dialog').parent();
                if (container.length === 0) {
                    container = this.parent.closest('div.panel');
                }

                var params = {
                    data: initials,
                    dropdownParent: this.group, // container,
                    ajax: {
                        url: url + 'search/',
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            params.term || (params.term = '');

                            return {
                                filters: JSON.stringify({
                                    method: 'icontains',
                                    fields: ['name_or_label', 'model'],
                                    name: params.term,
                                    model: format.model
                                }),
                                cursor: params.next
                            };
                        },
                        processResults: function (data, params) {
                            params.next = null;

                            if (data.items.length >= 30) {
                                params.next = data.next || null;
                            }

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
                                    more: params.next != null
                                }
                            };
                        },
                        cache: true
                    },
                    allowClear: true,
                    minimumInputLength: 3,
                    placeholder: gt.gettext("Enter a value. 3 characters at least for auto-completion")
                };

                // autoselect the initial value
                $.ajax({
                    type: "GET",
                    url: url + defaultValues + '/',
                    dataType: 'json'
                }).done(function (data) {
                    initials.push({id: data.id, text: data.name});

                    params.data = initials;

                    type.el.select2(params).fixSelect2Position();
                    type.el.val(defaultValues).trigger('change');
                });
            }
        }
    },

    values: function() {
        if (this.el && this.parent) {
            if (this.readOnly) {
                return this.el.attr('value');
            } else {
                if (this.el.val() !== "") {
                    var value = parseInt(this.el.val());
                    return isNaN(value) ? null : value;
                } else {
                    return null;
                }
            }
        }

        return null;
    },

    checkCondition: function (condition, values) {
        switch (condition) {
            case 0:
                return this.values() === null;
            case 1:
                return this.values() !== null;
            case 2:
                return this.values() === values;
            case 3:
                return this.values() !== values;
            default:
                return false;
        }
    }
});

// not edition view

module.exports = DescriptorMetaModel;