/**
 * @file descriptor.js
 * @brief Descriptor router
 * @author Frederic SCHERMA
 * @date 2016-07-19
 * @copyright Copyright (c) 2016 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var Marionette = require('backbone.marionette');
var DescriptorGroupModel = require('../models/descriptorgroup');
var DescriptorTypeModel = require('../models/descriptortype');
var DescriptorValueModel = require('../models/descriptorvalue');
var DescriptorGroupCollection = require('../collections/descriptorgroup');
var DescriptorTypeCollection = require('../collections/descriptortype');
var DescriptorValueCollection = require('../collections/descriptorvalue');
var DescriptorGroupListView = require('../views/descriptorgrouplist');
var DescriptorTypeListView = require('../views/descriptortypelist');

var DescriptorValueListView = require('../views/descriptorvaluelist');
var DescriptorValuePairListView = require('../views/descriptorvaluepairlist');

var DescriptorTypeItemView = require('../views/descriptortype');
var DescriptorTypeDetailView = require('../views/descriptortypedetail');
var DescriptorValueItemView = require('../views/descriptorvalue');
var DefaultLayout = require('../../main/views/defaultlayout');
var TitleView = require('../../main/views/titleview');
var ScrollingMoreView = require('../../main/views/scrollingmore');

var DescriptorGroupAddView = require('../views/descriptorgroupadd');
var DescriptorGroupTypeAddView = require('../views/descriptorgrouptypeadd');

var Router = Marionette.AppRouter.extend({
    routes : {
        "app/accession/descriptor/group/": "getDescriptorGroupList",
        // "app/accession/descriptor/group/:id/": "getDescriptorGroup",  // only POST
        "app/accession/descriptor/group/:id/type/": "getDescriptorTypeListForGroup",
        "app/accession/descriptor/group/:id/type/:id/": "getDescriptorTypeForGroup",
        "app/accession/descriptor/group/:id/type/:id/value/": "getDescriptorValueListForType",
        "app/accession/descriptor/group/:id/type/:id/value/:id": "getDescriptorValueForType"
    },

    getDescriptorGroupList : function() {
        var collection = application.accession.collections.descriptorGroup;

        var defaultLayout = new DefaultLayout({});
        application.getRegion('mainRegion').show(defaultLayout);

        defaultLayout.getRegion('title').show(new TitleView({title: gt.gettext("List of groups of descriptors")}));

        collection.fetch().then(function () {
            var descriptorGroupListView = new DescriptorGroupListView({read_only: true, collection : collection});
            defaultLayout.getRegion('content').show(descriptorGroupListView);
            defaultLayout.getRegion('content_bottom').show(new ScrollingMoreView({targetView: descriptorGroupListView}));
        });

        // TODO lookup for permission
        if (session.user.isAuth && (session.user.isSuperUser || session.user.isStaff)) {
            defaultLayout.getRegion('bottom').show(new DescriptorGroupAddView({collection: collection}));
        }
    },

    getDescriptorTypeListForGroup : function(id) {
        var collection = new DescriptorTypeCollection([], {group_id: id});

        var defaultLayout = new DefaultLayout();
        application.getRegion('mainRegion').show(defaultLayout);

        var model = new DescriptorGroupModel({id: id});
        model.fetch().then(function () {
            defaultLayout.getRegion('title').show(new TitleView({title: gt.gettext("Types of descriptors for the group"), object: model.get('name')}));

            // TODO lookup for permission
            if (session.user.isAuth && (session.user.isSuperUser || session.user.isStaff) && model.get('can_modify')) {
                defaultLayout.getRegion('bottom').show(new DescriptorGroupTypeAddView({collection: collection}));
            }
        });

        collection.fetch().then(function () {
            var descriptorTypeListView = new DescriptorTypeListView({read_only: true, collection : collection});

            defaultLayout.getRegion('content').show(descriptorTypeListView);
            defaultLayout.getRegion('content_bottom').show(new ScrollingMoreView({targetView: descriptorTypeListView}));
        });
    },

    getDescriptorTypeForGroup : function(gid, tid) {
        var defaultLayout = new DefaultLayout();
        application.getRegion('mainRegion').show(defaultLayout);

        var model = new DescriptorTypeModel({group_id: gid, id: tid});

        model.fetch().then(function () {
            defaultLayout.getRegion('title').show(new TitleView({title: gt.gettext("Details for the type of descriptor"), object: model.get('name')}));
            defaultLayout.getRegion('content').show(new DescriptorTypeDetailView({model : model}));
        });
    },

    getDescriptorValueListForType : function(gid, tid) {
        var collection = new DescriptorValueCollection([], {group_id: gid, type_id: tid});

        var defaultLayout = new DefaultLayout();
        application.getRegion('mainRegion').show(defaultLayout);

        var model = new DescriptorTypeModel({group_id: gid, id: tid});
        model.fetch().then(function () {
            defaultLayout.getRegion('title').show(new TitleView({title: gt.gettext("Values for the type of descriptor"), object: model.get('name')}));

            collection.fetch().then(function () {
                var valueListView = null;

                if (model.get('format').type === "enum_single") {
                    // TODO edit value
                    valueListView = new DescriptorValueListView({
                        read_only: true,
                        collection: collection,
                        model: model
                    });
                } else if (model.get('format').type === "enum_pair") {
                    // TODO edit values
                    valueListView = new DescriptorValuePairListView({
                        read_only: true,
                        collection: collection,
                        model: model
                    });
                } else if (model.get('format').type === "enum_ordinal") {
                    // TODO specific view in way to only edit the label
                    // and to not add/remove some value
                    valueListView = new DescriptorValuePairListView({
                        read_only: true,
                        collection: collection,
                        model: model
                    });
                }

                if (valueListView != null) {
                    defaultLayout.getRegion('content').show(valueListView);
                    defaultLayout.getRegion('content_bottom').show(new ScrollingMoreView({targetView: valueListView, more: -1}));
                }
            });
        });
    },
});

module.exports = Router;
