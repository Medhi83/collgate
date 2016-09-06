/**
 * @file group.js
 * @brief Permission group collection
 * @author Frederic SCHERMA
 * @date 2016-05-30
 * @copyright Copyright (c) 2016 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var PermissionGroupModel = require('../models/group');

var Collection = Backbone.Collection.extend({
    url: function() { return application.baseUrl + 'permission/group/'; },
    model: PermissionGroupModel,

    parse: function(data) {
        this.perms = data.perms;
        return data.groups;
    },
});

module.exports = Collection;
