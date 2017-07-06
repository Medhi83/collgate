/**
 * @file taxondescriptor.js
 * @brief Taxon descriptors view
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2016-12-29
 * @copyright Copyright (c) 2016 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

var DescribableDetails = require('../../descriptor/views/describabledetails');
var TaxonDescriptorEditView = require('./taxondescriptoredit');

var View = DescribableDetails.extend({
    onShowTab: function() {
        var view = this;

        var contextLayout = application.getView().getChildView('right');
        if (!contextLayout) {
            var DefaultLayout = require('../../main/views/defaultlayout');
            contextLayout = new DefaultLayout();
            application.getView().showChildView('right', contextLayout);
        }

        var TitleView = require('../../main/views/titleview');
        contextLayout.showChildView('title', new TitleView({title: gt.gettext("Descriptors"), glyphicon: 'glyphicon-wrench'}));

        var actions = [];

        if (this.model.get('descriptor_meta_model') == null) {
            actions.push('add');
        } else {
            actions.push('modify');
            actions.push('replace');
            actions.push('delete');
        }

        var TaxonDescriptorContextView = require('./taxondescriptorcontext');
        var contextView = new TaxonDescriptorContextView({actions: actions});
        contextLayout.showChildView('content', contextView);

        contextView.on("describable:modify", function () {
            view.onModify();
        });

        contextView.on("descriptormetamodel:replace", function () {
            // this will update the model and so on the view
            var TaxonDescriptorCreateView = require('./taxondescriptorcreate');
            var taxonDescriptorCreateView = new TaxonDescriptorCreateView({model: view.model});

            taxonDescriptorCreateView.onDefine();
        });

        contextView.on("descriptormetamodel:delete", function () {
            var ConfirmDialog = require('../../main/views/confirmdialog');
            var confirmDialog = new ConfirmDialog({
                title: gt.gettext('Delete descriptors'),
                label: gt.gettext('Are you sure you want to delete any descriptors for this taxon ?')
            });
            confirmDialog.render();

            confirmDialog.on('dialog:confirm', function() {
                // this will update the model and so on the view
                view.model.save({descriptor_meta_model: null}, {patch: true, trigger: true});
            });
        });
    },

    onHideTab: function() {
        application.main.defaultRightView();
    },

    onModify: function() {
        // does not reload models, just redo the views
        var model = this.model;
        var name = model.get('name');

        // update the descriptor part of the taxon layout
        var taxonLayout = application.main.viewContent().getChildView('content');

        var view = new TaxonDescriptorEditView({
            model: this.model, descriptorMetaModelLayout: this.descriptorMetaModelLayout});
        taxonLayout.showChildView('descriptors', view);
    }
});

module.exports = View;
