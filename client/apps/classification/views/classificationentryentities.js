/**
 * @file classificationentryentities.js
 * @brief Classification entry entities list view
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2016-12-28
 * @copyright Copyright (c) 2016 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

var ClassificationEntryEntityView = require('./classificationentryentity');
var ScrollView = require('../../main/views/scroll');

var View = ScrollView.extend({
    template: require("../templates/classificationentryentitieslist.html"),
    className: "classification-entry-entity-list advanced-table-container",
    childView: ClassificationEntryEntityView,
    childViewContainer: 'tbody.entities-list',

    initialize: function() {
        View.__super__.initialize.apply(this);

        this.listenTo(this.collection, 'reset', this.render, this);
    }
});

module.exports = View;