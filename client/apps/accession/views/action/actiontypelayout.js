/**
 * @file actiontypelayout.js
 * @brief Optimized layout for action details
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2017-12-07
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

let LayoutView = require('../../../main/views/layout');
let ActionTypeModel = require('../../models/actiontype');
let ScrollingMoreView = require('../../../main/views/scrollingmore');
let ContentBottomLayout = require('../../../main/views/contentbottomlayout');

let Layout = LayoutView.extend({
    template: require("../../templates/action/layout.html"),

    attributes: {
        style: "height: 100%;"
    },

    ui: {
        general_tab: 'a[aria-controls=general]',
        steps_tab: 'a[aria-controls=steps]',
        format_type: 'select.action-type-format-type',
        description: 'textarea[name=description]',
        config_save: 'button[name=save]',
        step_index: 'select.action-type-step-index',
        name: 'input[name=name]'
    },

    regions: {
        'contextual': "div.contextual-region",
        'namingOptions': "div.naming-options",
        'general': "div.tab-pane[name=general]",
        'steps': "div.tab-pane[name=steps]"
    },

    events: {
        'change @ui.format_type': 'changeFormatType',
        'click @ui.config_save': 'onUpdateConfig'
    },

    initialize: function (model, options) {
        Layout.__super__.initialize.apply(this, arguments);

        if (this.model.isNew()) {
            this.listenTo(this.model, 'change:id', this.onBatchActionTypeCreate, this);
        }

        // naming options
        let self = this;
        let namingOptions = Object.resolve('data.naming_options', this.model.get('format')) || [];

        this.namingOptions = null;
        this.namingFormat = null;
        this.currentStepIndex = null;

        self.namingOptionsPromise = $.ajax({
            type: "GET",
            url: window.application.url(['accession', 'naming', 'batch']),
            dataType: 'json',
        }).done(function(data) {
            let len = (data.format.match(/{CONST}/g) || []).length;

            if (namingOptions.length !== len) {
                namingOptions = new Array(len);
            }

            self.namingOptions = namingOptions;
            self.namingFormat = data.format;
        });
    },

    onBatchActionTypeCreate: function () {
        // re-render once created
        this.render();

        // and update history
        Backbone.history.navigate('app/accession/actiontype/' + this.model.get('id') + '/', {
            /*trigger: true,*/
            replace: false
        });
    },

    enableTabs: function () {
        this.ui.steps_tab.parent().removeClass('disabled');
    },

    changeFormatType: function () {
        let formatType = this.ui.format_type.val();

        // update the contextual region according to the format
        let Element = window.application.accession.actions.getElement(formatType);
        if (Element && Element.ActionStepFormatDetailsView) {
            this.showChildView('contextual', new Element.ActionStepFormatDetailsView({
                model: this.model,
                namingOptions: this.namingOptions,
                namingFormat: this.namingFormat
            }));
        } else {
            this.getRegion('contextual').empty();
        }
    },

    loadCurrentStepData: function() {
        let idx = parseInt(this.ui.step_index.val());

        if (idx >= 0) {
            let stepData = this.model.get('format')['steps_data'][idx];
            this.ui.format_type.val(stepData.type).prop('disabled', false).selectpicker('refresh');

            let Element = window.application.accession.actions.getElement(stepData.type);
            let actionFormatType = new Element.ActionStepFormatDetailsView({
                model: this.model,
                namingOptions: this.namingOptions,
                namingFormat: this.namingFormat,
                stepIndex: idx
            });

            this.showChildView('contextual', actionFormatType);

            this.currentStepIndex = idx;
        }
    },

    storeCurrentStepData: function() {
        let idx = parseInt(this.ui.step_index.val());

        if (this.currentStepIndex !== null) {
            let savedStepData = this.getChildView('contextual').getFormat();
            savedStepData.type = this.ui.format_type.val();

            this.model.get('format')['steps_data'][this.currentStepIndex] = savedStepData;
        }

        this.currentStepIndex = idx;
    },

    changeStep: function () {
        let format = this.model.get('format');
        let idx = parseInt(this.ui.step_index.val());
        let stepData = undefined;

        if (idx < 0) {
            // create a new one
            if (format['next_step'] >= 10) {
                $.alert.warning(_t("Max number of step reached (10)"));
                return;
            } else {
                stepData = {'type': 'accession_list'};

                let nextIdx = format.steps_data.length;

                // initial step data
                this.model.get('format')['steps_data'] = stepData;

                this.ui.step_index
                    .append('<option value="' + nextIdx + '">' + _t("Step") + " " + nextIdx + '</option>')
                    .val(nextIdx)
                    .selectpicker('refresh');

                this.ui.format_type.prop('disabled', false).selectpicker('refresh');
            }
        } else {
            stepData = format.steps_data[idx];
        }

        // set into the model
        this.storeCurrentStepData();

        // change current selection
        this.ui.format_type.prop('disabled', false).val(stepData.type).selectpicker('refresh');

        let Element = window.application.accession.actions.getElement(stepData.type);
        let actionFormatType = new Element.ActionStepFormatDetailsView({
            model: this.model,
            namingOptions: this.namingOptions,
            namingFormat: this.namingFormat,
            stepIndex: idx
        });

        this.showChildView('contextual', actionFormatType);
    },

    onRender: function () {
        let format = this.model.get('format');
        let batchLayout = this;

        for (let i = 0; i < format.steps_data.length; ++i) {
            this.ui.step_index.append('<option value="' + i + '">' + _t("Step") + " " + i + '</option>');
        }

        this.namingOptionsPromise.then(function() {
            batchLayout.ui.step_index.selectpicker({}).on('change', $.proxy(batchLayout.changeStep, batchLayout));
        });

        window.application.accession.views.actionTypeFormats.drawSelect(this.ui.format_type, true, false);
        this.ui.format_type.prop('disabled', true).selectpicker('refresh');

        if (!this.model.isNew()) {
            if (format.steps_data.length) {
                // select first step if exists
                this.namingOptionsPromise.then(function () {
                    batchLayout.ui.step_index.val(0).selectpicker('refresh');
                    batchLayout.currentStepIndex = 0;
                    batchLayout.loadCurrentStepData();
                });
            }

            this.enableTabs();
        } else {
        }
    },

    onBeforeDetach: function () {
        this.ui.step_index.selectpicker('destroy');
        this.$el.find("select.action-type-format-type").selectpicker("destroy");
    },

    onUpdateConfig: function() {
        let name = this.ui.name.val().trim();
        let description = this.ui.description.val().trim();

        // store possible last changes on current step
        this.storeCurrentStepData();

        let model = this.model;
        let format = model.get('format');

        if (model.isNew()) {
            model.save({name: name, description: description, format: format}, {wait: true}).then(function () {
                $.alert.success(_t("Successfully changed !"));
                Backbone.history.navigate('app/accession/actiontype/' + model.get('id') + '/', {trigger: true, replace: true});
            });
        } else {
            model.save({name: name, description: description, format: format}, {wait: true, patch: true}).then(function () {
                $.alert.success(_t("Successfully changed !"));
                Backbone.history.navigate('app/accession/actiontype/' + model.get('id') + '/', {trigger: true, replace: true});
            });
        }
    }
});

module.exports = Layout;