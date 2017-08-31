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
            url: application.baseUrl + 'descriptor/meta-model/for-describable/' + 'accession.accession/',
            dataType: 'json'
        }).done(function(data) {
            var CreateAccessionView = Dialog.extend({
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
                    meta_model: "#meta_model",
                    primary_classification_entry: "#primary_classification_entry"
                },

                events: {
                    'click @ui.validate': 'onContinue',
                    'input @ui.code': 'onCodeInput',
                    'input @ui.name': 'onNameInput'
                },

                onRender: function () {
                    CreateAccessionView.__super__.onRender.apply(this);

                    application.main.views.languages.drawSelect(this.ui.language);
                    this.ui.meta_model.selectpicker({});

                    $(this.ui.primary_classification_entry).select2({
                        dropdownParent: this.ui.primary_classification_entry.parent(),
                        ajax: {
                            url: application.baseUrl + "classification/entry/search/",
                            dataType: 'json',
                            delay: 250,
                            data: function (params) {
                                params.term || (params.term = '');

                                return {
                                    filters: JSON.stringify({
                                        method: 'icontains',
                                        fields: ['name'],
                                        'name': params.term.trim()
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
                        minimumInputLength: 3,
                        placeholder: gt.gettext("Enter a classification name. 3 characters at least for auto-completion")
                    }).fixSelect2Position();
                },

                onBeforeDestroy: function() {
                    this.ui.language.selectpicker('destroy');
                    this.ui.meta_model.selectpicker('destroy');
                    this.ui.primary_classification_entry.select2('destroy');

                    CreateAccessionView.__super__.onBeforeDestroy.apply(this);
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
                            url: application.baseUrl + 'accession/accession/search/',
                            dataType: 'json',
                            contentType: 'application/json; charset=utf8',
                            data: {filters: JSON.stringify(filters)},
                            el: this.ui.code,
                            success: function(data) {
                                for (var i in data.items) {
                                    var t = data.items[i];

                                    if (t.value.toUpperCase() === code.toUpperCase()) {
                                        $(this.el).validateField('failed', gt.gettext('Code of accession already used'));
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

                    if (this.validateName()) {
                        var filters = {
                            method: 'ieq',
                            fields: ['name'],
                            'name': name
                        };

                        $.ajax({
                            type: "GET",
                            url: application.baseUrl + 'accession/accession/synonym/search/',
                            dataType: 'json',
                            contentType: 'application/json; charset=utf8',
                            data: {filters: JSON.stringify(filters)},
                            el: this.ui.name,
                            success: function(data) {
                                for (var i in data.items) {
                                    var t = data.items[i];

                                    if (t.type === "ACC_SYN:01" && t.label.toUpperCase() === name.toUpperCase()) {
                                        $(this.el).validateField('failed', gt.gettext('Synonym used as accession code'));
                                        return;
                                    }
                                }

                                $(this.el).validateField('ok');
                            }
                        });
                    }
                },

                validateCode: function() {
                    var v = this.ui.code.val().trim();

                    if (v.length > 128) {
                        this.ui.code.validateField('failed', gt.gettext("128 characters max"));
                        return false;
                    } else if (v.length < 1) {
                        this.ui.code.validateField('failed', gt.gettext('1 characters min'));
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
                        this.ui.name.validateField('failed', gt.gettext("128 characters max"));
                        return false;
                    } else if (v.length < 1) {
                        this.ui.name.validateField('failed', gt.gettext('1 characters min'));
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

                    var primaryClassificationEntryId = 0;

                    if (this.ui.primary_classification_entry.val()) {
                        primaryClassificationEntryId = parseInt(this.ui.primary_classification_entry.val());
                    }

                    if (!primaryClassificationEntryId) {
                        $.alert.error(gt.gettext("The primary classification must be defined"));
                        valid = false;
                    }

                    if (this.ui.code.val().trim() === this.ui.name.val().trim()) {
                        this.ui.code.validateField('failed', 'Code and name must be different');
                        this.ui.name.validateField('failed', 'Code and name must be different');
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
                        var primaryClassificationEntryId = parseInt(this.ui.primary_classification_entry.val());
                        var metaModelId = parseInt(this.ui.meta_model.val());

                        // create a new local model and open an edit view with this model
                        var model = new AccessionModel({
                            code: code,
                            name: name,
                            primary_classification_entry: primaryClassificationEntryId,
                            descriptor_meta_model: metaModelId,
                            language: this.ui.language.val()
                        });

                        view.destroy();

                        var defaultLayout = new DefaultLayout();
                        application.main.showContent(defaultLayout);

                        defaultLayout.showChildView('title', new TitleView({
                            title: gt.gettext("Accession"),
                            model: model}));

                        var accessionLayout = new AccessionLayout({model: model});
                        defaultLayout.showChildView('content', accessionLayout);
                    }
                }
            });

            var createAccessionView = new CreateAccessionView();
            createAccessionView.render();
        });
    },

    search: function () {
        var searchEntityDialog = new SearchEntityDialog();
        searchEntityDialog.render();
     }
});

module.exports = Controller;
