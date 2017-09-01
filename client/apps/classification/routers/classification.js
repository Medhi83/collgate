/**
 * @file taxon.js
 * @brief Taxon router
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2016-04-13
 * @copyright Copyright (c) 2016 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

var Marionette = require('backbone.marionette');
var ClassificationModel = require('../models/classification');

// var ClassificationListView = require('../views/classificationlist');
var EntityListFilterView = require('../../descriptor/views/entitylistfilter');

// var ClassificationLayout = require('../views/classificationlayout');

var DefaultLayout = require('../../main/views/defaultlayout');
var TitleView = require('../../main/views/titleview');
var ScrollingMoreView = require('../../main/views/scrollingmore');

var ClassificationCollection = require('../collections/classification');


var ClassificationRouter = Marionette.AppRouter.extend({
    routes : {
        "app/classification/classification/": "getClassificationList",
        "app/classification/classification/:id/*tab": "getClassification"
    },

    getClassificationList : function() {
        var collection = new ClassificationCollection();

        var defaultLayout = new DefaultLayout({});
        application.main.showContent(defaultLayout);

        defaultLayout.showChildView('title', new TitleView({title: gt.gettext("List of classifications")}));

        // collection.fetch().done(function () {
        //     var classificationListView = new ClassificationListView({collection : collection, columns: data.columns});
        //
        //     defaultLayout.showChildView('content', classificationListView);
        //     defaultLayout.showChildView('content-bottom', new ScrollingMoreView({
        //         targetView: classificationListView,
        //         collection: collection
        //     }));
        //
        //     defaultLayout.showChildView('bottom', new EntityListFilterView({collection: collection}));
        //
        //     classificationListView.query();
        // });
    },

    getClassification : function(id, tab) {
        tab || (tab = "");

        var classification = new ClassificationModel({id: id});

        var defaultLayout = new DefaultLayout();
        application.main.showContent(defaultLayout);

        // var classificationLayout = new ClassificationLayout({model: classification, initialTab: tab.replace('/', '')});

        // classification.fetch().then(function () {
        //     defaultLayout.showChildView('title', new TitleView({title: gt.gettext("Classification details"), model: classification}));
        //     defaultLayout.showChildView('content', classificationLayout);
        // });
    }
});

module.exports = ClassificationRouter;