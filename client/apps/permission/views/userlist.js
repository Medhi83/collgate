/**
 * @file userlist.js
 * @brief Permission user list view
 * @author Frederic SCHERMA
 * @date 2016-05-30
 * @copyright Copyright (c) 2016 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var PermissionUserView = require('../views/user');
var ScrollView = require('../../main/views/scroll');

var View = ScrollView.extend({
    template: require("../templates/userlist.html"),
    className: "permission-user-list advanced-table-container",
    childView: PermissionUserView,
    childViewContainer: 'tbody.permission-user-list',

    initialize: function() {
        View.__super__.initialize.apply(this);

        this.listenTo(this.collection, 'reset', this.render, this);
    }
});

module.exports = View;
