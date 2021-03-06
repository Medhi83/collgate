/**
 * @file batchdescriptoredit.js
 * @brief Batch descriptor item edit view
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2017-02-15
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

let DescribableEdit = require('../../../descriptor/views/describableedit');

let View = DescribableEdit.extend({
    onCancel: function() {
        // cancel global widget modifications
        this.cancel();

        // non existing accession, simply reload previous content (url has not changed)
        if (this.model.isNew()) {
            Backbone.history.loadUrl();
            return;
        }

        // does not reload models, just redo the views
        let view = this;

        // update the layout content
        let batchLayout = window.application.main.viewContent().getChildView('content');

        let BatchDescriptorView = require('./batchdescriptor');
        let batchDescriptorView = new BatchDescriptorView({
            model: this.model,
            layoutData: view.layoutData,
            descriptorCollection: view.descriptorCollection
        });

        batchLayout.showChildView('descriptors', batchDescriptorView);
    },

    onApply: function () {
        // does not reload models, save and redo the views
        let self = this;
        let model = this.model;

        let descriptors = this.prepareDescriptors();
        if (descriptors === null) {
            return;
        }

        this.model.save({descriptors: descriptors}, {wait: true, patch: !model.isNew(), success: function () {
            //Backbone.history.navigate('app/accession/batch/' + model.get('id') + '/', {trigger: true, replace: true});
            let batchLayout = window.application.main.viewContent().getChildView('content');

            // update the layout content
            let BatchDescriptorView = require('./batchdescriptor');
            let batchDescriptorView = new BatchDescriptorView({
                model: model,
                layoutData: self.layoutData,
                descriptorCollection: self.descriptorCollection
            });

            batchLayout.showChildView('descriptors', batchDescriptorView);
        }});
    },

    onShowTab: function() {
        let view = this;

        // contextual panel
        let contextLayout = window.application.getView().getChildView('right');
        if (!contextLayout) {
            let DefaultLayout = require('../../../main/views/defaultlayout');
            contextLayout = new DefaultLayout();
            window.application.getView().showChildView('right', contextLayout);
        }

        let TitleView = require('../../../main/views/titleview');
        contextLayout.showChildView('title', new TitleView({title: _t("Descriptors"), glyphicon: 'fa-wrench'}));

        let actions = ['apply', 'cancel'];

        let BatchDescriptorContextView = require('./batchdescriptorcontext');
        let contextView = new BatchDescriptorContextView({actions: actions});
        contextLayout.showChildView('content', contextView);

        contextView.on("describable:cancel", function() {
            view.onCancel();
        });

        contextView.on("describable:apply", function() {
            view.onApply();
        });
    },

    onHideTab: function() {
        window.application.main.defaultRightView();
    }
});

module.exports = View;

