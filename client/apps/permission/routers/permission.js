/**
 * @file permission.js
 * @brief Permission router
 * @author Frederic SCHERMA
 * @date 2016-05-26
 * @copyright Copyright (c) 2016 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var Marionette = require('backbone.marionette');
var PermissionCollection = require('../collections/permission');
var PermissionListView = require('../views/permissionlist');
var PermissionAddView = require('../views/addpermission');
var PermissionUserCollection = require('../collections/user');
var PermissionUserListView = require('../views/userlist');
var PermissionGroupCollection = require('../collections/group');
var PermissionGroupListView = require('../views/grouplist');
var PermissionGroupUserCollection = require('../collections/groupuser');
var PermissionGroupUserListView = require('../views/groupuserlist');
var PermissionGroupAddUserView = require('../views/addusergroup');
var PermissionAddGroupView = require('../views/addgroup');
var DefaultLayout = require('../../main/views/defaultlayout');
var TitleView = require('../../main/views/titleview');
var ScrollingMoreView = require('../../main/views/scrollingmore');

var PermissionRouter = Marionette.AppRouter.extend({
    routes : {
        "app/permission/user/": "getUsers",
        "app/permission/user/:username/permission/": "getPermissionsForUser",
        "app/permission/group/": "getGroups",
        "app/permission/group/:groupname/permission/": "getPermissionsForGroup",
        "app/permission/group/:groupname/user/": "getUsersForGroup",
    },

    getUsers: function () {
        var userCollection = new PermissionUserCollection();

        var defaultLayout = new DefaultLayout({});
        application.getRegion('mainRegion').show(defaultLayout);

        defaultLayout.getRegion('title').show(new TitleView({title: gt.gettext("List of users")}));

        userCollection.fetch().then(function () {
            var permissionUserList = new PermissionUserListView({collection : userCollection});

            defaultLayout.getRegion('content').show(permissionUserList);
            defaultLayout.getRegion('content_bottom').show(new ScrollingMoreView({targetView: permissionUserList}));
        });
    },

    getPermissionsForUser: function(username) {
        var permissionsCollection = new PermissionCollection([], {name: username})

        var defaultLayout = new DefaultLayout({});
        application.getRegion('mainRegion').show(defaultLayout);

        defaultLayout.getRegion('title').show(new TitleView({title: gt.gettext("List of permissions for user"), object: username}));

        permissionsCollection.fetch().then(function () {
            var permissionListView = new PermissionListView({collection : permissionsCollection});

            defaultLayout.getRegion('content').show(permissionListView);
            defaultLayout.getRegion('content_bottom').show(new ScrollingMoreView({targetView: permissionListView}));

            if ($.inArray("auth.add_permission", permissionsCollection.perms) >= 0) {
                defaultLayout.getRegion('bottom').show(new PermissionAddView({collection : permissionsCollection}));
            }
        });
    },

    getGroups: function () {
        var groupCollection = new PermissionGroupCollection();

        var defaultLayout = new DefaultLayout({});
        application.getRegion('mainRegion').show(defaultLayout);

        defaultLayout.getRegion('title').show(new TitleView({title: gt.gettext("List of groups")}));

        groupCollection.fetch().then(function () {
            var permissionGroupList = new PermissionGroupListView({collection : groupCollection});

            defaultLayout.getRegion('content').show(permissionGroupList);
            defaultLayout.getRegion('content_bottom').show(new ScrollingMoreView({targetView: permissionGroupList}));

            if ($.inArray("auth.add_group", groupCollection.perms) >= 0) {
                defaultLayout.getRegion('bottom').show(new PermissionAddGroupView({collection : groupCollection}));
            }
        });
    },

    getPermissionsForGroup: function(name) {
        var permissionsCollection = new PermissionCollection([], {name: name, is_group: true})

        var defaultLayout = new DefaultLayout({});
        application.getRegion('mainRegion').show(defaultLayout);

        defaultLayout.getRegion('title').show(new TitleView({title: gt.gettext("List of permissions for group"), object: name}));

        permissionsCollection.fetch().then(function () {
            var permissionList = new PermissionListView({collection : permissionsCollection})

            defaultLayout.getRegion('content').show(permissionList);
            defaultLayout.getRegion('content_bottom').show(new ScrollingMoreView({targetView: permissionList}));

            if ($.inArray("auth.add_permission", permissionsCollection.perms) >= 0) {
                defaultLayout.getRegion('bottom').show(new PermissionAddView({collection : permissionsCollection}));
            }
        });
    },

    getUsersForGroup: function(name) {
        var userCollection = new PermissionGroupUserCollection([], {name: name});

        var defaultLayout = new DefaultLayout({});
        application.getRegion('mainRegion').show(defaultLayout);

        defaultLayout.getRegion('title').show(new TitleView({title: gt.gettext("List of users for group"), object: name}));

        userCollection.fetch().then(function () {
            var permissionGroupUserList = new PermissionGroupUserListView({collection : userCollection});

            defaultLayout.getRegion('content').show(permissionGroupUserList);
            defaultLayout.getRegion('content_bottom').show(new ScrollingMoreView({targetView: permissionGroupUserList}));

            if ($.inArray("auth.change_group", userCollection.perms) >= 0) {
                defaultLayout.getRegion('bottom').show(new PermissionGroupAddUserView({collection : userCollection}));
            }
        });
    },
});

module.exports = PermissionRouter;
