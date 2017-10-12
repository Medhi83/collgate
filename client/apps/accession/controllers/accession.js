/**
 * @file accession.js
 * @brief Accession controller
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2016-12-07
 * @copyright Copyright (c) 2016 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

var Marionette = require('backbone.marionette');

var AccessionModel = require('../models/accession');

var DefaultLayout = require('../../main/views/defaultlayout');
var TitleView = require('../../main/views/titleview');
var Dialog = require('../../main/views/dialog');
var AccessionLayout = require('../views/accessionlayout');
var SearchEntityDialog = require('../views/search');

var Controller = Marionette.Object.extend({

    create: function() {
        $.ajax({
            type: "GET",
            url: window.application.url(['descriptor', 'meta-model', 'for-describable', 'accession.accession']),
            dataType: 'json'
        }).done(function(data) {
            var CreateAccessionDialog = Dialog.extend({
                attributes: {
                    'id': 'dlg_create_accession'
                },
                template: require('../templates/accessioncreate.html'),
                templateContext: function () {
                    return {
                        meta_models: data
                    };
                },

                ui: {
                    validate: "button.continue",
                    code: "#accession_code",
                    name: "#accession_name",
                    language: "#accession_language",
                    descriptor_meta_model: "#meta_model",
                    primary_classification: "#primary_classification",
                    primary_classification_entry: "#primary_classification_entry"
                },

                events: {
                    'click @ui.validate': 'onContinue',
                    'input @ui.code': 'onCodeInput',
                    'input @ui.name': 'onNameInput',
                    'change @ui.descriptor_meta_model': 'onChangeDescriptorMetaModel',
                    'change @ui.primary_classification': 'onChangePrimaryClassification'
                },

                initialize: function (options) {
                    CreateAccessionDialog.__super__.initialize.apply(this);

                    // map descriptor meta models by theirs ids
                    this.descriptorMetaModels = {};

                    for (var i = 0; i < data.length; ++i) {
                        var dmm = data[i];
                        this.descriptorMetaModels[dmm.id] = dmm;
                    }
                },

                onRender: function () {
                    CreateAccessionDialog.__super__.onRender.apply(this);

                    application.main.views.languages.drawSelect(this.ui.language);
                    this.ui.descriptor_meta_model.selectpicker({});
                    this.ui.primary_classification.selectpicker({});

                    // on default descriptor meta-model
                    this.onChangeDescriptorMetaModel();
                },

                getDescriptorMetaModelClassifications: function () {
                    var descriptorMetaModelId = parseInt(this.ui.descriptor_meta_model.val());

                    var value = Object.resolve(descriptorMetaModelId + ".parameters.data.primary_classification", this.descriptorMetaModels);
                    if (value) {
                        return [value];
                    }

                    return [];
                },

                onBeforeDestroy: function() {
                    this.ui.language.selectpicker('destroy');
                    this.ui.descriptor_meta_model.selectpicker('destroy');
                    this.ui.primary_classification.selectpicker('destroy');

                    if (this.ui.primary_classification_entry.data('select2')) {
                        this.ui.primary_classification_entry.select2('destroy');
                    }

                    CreateAccessionDialog.__super__.onBeforeDestroy.apply(this);
                },

                onChangeDescriptorMetaModel: function() {
                    var select = this.ui.primary_classification;

                    select.children().remove();
                    select.selectpicker('destroy');

                    // classifications list according to the related meta model of accession
                    var ClassificationCollection = require('../../classification/collections/classification');
                    var classificationCollection = new ClassificationCollection();

                    var SelectOption = require('../../main/renderers/selectoption');
                    var classifications = new SelectOption({
                        className: "classification",
                        collection: classificationCollection,
                        filters: [{
                            type: 'term',
                            field: 'id',
                            value: this.getDescriptorMetaModelClassifications(),
                            op: 'in'
                        }]
                    });

                    var self = this;

                    classifications.drawSelect(select).done(function () {
                        self.onChangePrimaryClassification();
                    });
                },

                onChangePrimaryClassification: function () {
                    var classificationId = parseInt(this.ui.primary_classification.val());
                    var select = $(this.ui.primary_classification_entry);

                    if (select.data('select2')) {
                        select.select2('destroy');
                        select.children().remove();
                    }

                    if (isNaN(classificationId)) {
                        return;
                    }

                    select.select2({
                        dropdownParent: this.ui.primary_classification_entry.parent(),
                        ajax: {
                            url: awindow.application.url(['classification' ,'classificationentry', 'search']),
                            dataType: 'json',
                            delay: 250,
                            data: function (params) {
                                params.term || (params.term = '');

                                return {
                                    filters: JSON.stringify({
                                        method: 'icontains',
                                        classification_method: 'eq',
                                        fields: ['name', 'classification'],
                                        'name': params.term.trim(),
                                        'classification': classificationId
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
                        minimumInputLength: 1,
                        placeholder: _t("Enter a classification entry name.")
                    }).fixSelect2Position();
                },

                onCodeInput: function () {
                    var code = this.ui.code.val().trim();

                    if (this.validateCode()) {
                        var filters = {
                            method: 'ieq',
                            fields: ['code'],
                            'code': code
                        };

                        $.ajax({
                            type: "GET",
                            url: window.application.url(['accession' ,'accession', 'search']),
                            dataType: 'json',
                            contentType: 'application/json; charset=utf8',
                            data: {filters: JSON.stringify(filters)},
                            el: this.ui.code,
                            success: function(data) {
                                for (var i in data.items) {
                                    var t = data.items[i];

                                    if (t.value.toUpperCase() === code.toUpperCase()) {
                                        $(this.el).validateField('failed', _t('Code of accession already used'));
                                        return;
                                    }
                                }

                                $(this.el).validateField('ok');
                            }
                        });
                    }
                },

                onNameInput: function () {
                    var name = this.ui.name.val().trim();
                    var self = this;

                    // @todo must respect the nomenclature from the meta-model
                    if (this.validateName()) {
                        var filters = {
                            method: 'ieq',
                            fields: ['name'],
                            'name': name
                        };

                        $.ajax({
                            type: "GET",
                            url: window.application.url(['accession', 'accession', 'synonym', 'search']),
                            dataType: 'json',
                            contentType: 'application/json; charset=utf8',
                            data: {filters: JSON.stringify(filters)},
                        }).done(function (data) {
                            var accessionCodeId = application.accession.collections.accessionSynonymTypes.findWhere({name: "accession_code"}).get('id');

                            for (var i in data.items) {
                                var t = data.items[i];

                                if (t.synonym_type === accessionCodeId && t.label.toUpperCase() === name.toUpperCase()) {
                                    self.ui.name.validateField('failed', _t('Synonym used as accession code'));
                                    return;
                                }
                            }

                            self.ui.name.validateField('ok');
                        });
                    }
                },

                validateCode: function() {
                    var v = this.ui.code.val().trim();

                    if (v.length > 128) {
                        this.ui.code.validateField('failed', _t('characters_max', {count: 128}));
                        return false;
                    } else if (v.length < 1) {
                        this.ui.code.validateField('failed', _t('characters_min', {count: 1}));
                        return false;
                    }

                    if (v === this.ui.name.val().trim()) {
                        this.ui.code.validateField('failed', 'Code and name must be different');
                        return false;
                    }

                    return true;
                },

                validateName: function() {
                    var v = this.ui.name.val().trim();

                    if (v.length > 128) {
                        this.ui.name.validateField('failed', _t('characters_max', {count: 128}));
                        return false;
                    } else if (v.length < 1) {
                        this.ui.name.validateField('failed', _t('characters_min', {count: 1}));
                        return false;
                    }

                    if (v === this.ui.code.val().trim()) {
                        this.ui.name.validateField('failed', 'Code and name must be different');
                        return false;
                    }

                    return true;
                },

                validate: function() {
                    var valid = this.validateName();
                    var descriptorMetaModelId = parseInt(this.ui.descriptor_meta_model.val());
                    var primaryClassificationEntryId = parseInt(this.ui.primary_classification_entry.val());

                    if (isNaN(descriptorMetaModelId)) {
                        $.alert.error(_t("The meta-model of descriptors must be defined"));
                        valid = false;
                    }

                    if (isNaN(primaryClassificationEntryId)) {
                        $.alert.error(_t("The primary classification must be defined"));
                        valid = false;
                    }

                    if (this.ui.code.val().trim() === this.ui.name.val().trim()) {
                        this.ui.code.validateField('failed', _t('Code and name must be different'));
                        this.ui.name.validateField('failed', _t('Code and name must be different'));
                    }

                     if (this.ui.code.hasClass('invalid') ||
                         this.ui.name.hasClass('invalid') ||
                         this.ui.primary_classification_entry.hasClass('invalid')) {
                        valid = false;
                    }

                    return valid;
                },

                onContinue: function() {
                    var view = this;

                    if (this.validate()) {
                        var code = this.ui.code.val().trim();
                        var name = this.ui.name.val().trim();

                        var descriptorMetaModelId = parseInt(this.ui.descriptor_meta_model.val());
                        var primaryClassificationEntryId = parseInt(this.ui.primary_classification_entry.val());

                        // create a new local model and open an edit view with this model
                        var model = new AccessionModel({
                            code: code,
                            name: name,
                            primary_classification_entry: primaryClassificationEntryId,
                            descriptor_meta_model: descriptorMetaModelId,
                            language: this.ui.language.val()
                        });

                        view.destroy();

                        var defaultLayout = new DefaultLayout();
                        application.main.showContent(defaultLayout);

                        defaultLayout.showChildView('title', new TitleView({
                            title: _t("Accession"),
                            model: model
                        }));

                        var accessionLayout = new AccessionLayout({model: model});
                        defaultLayout.showChildView('content', accessionLayout);
                    }
                }
            });

            var createAccessionView = new CreateAccessionDialog();
            createAccessionView.render();
        });
    },

    search: function () {
        var searchEntityDialog = new SearchEntityDialog();
        searchEntityDialog.render();
     }
});

module.exports = Controller;
