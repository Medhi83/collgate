/**
 * @file accessionbatches.js
 * @brief Accession batches list view
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2017-02-15
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

var BatchView = require('../views/batch');
var ScrollView = require('../../main/views/scroll');

var View = ScrollView.extend({
    template: require("../templates/batchlist.html"),
    className: "accession-batch-list",
    childView: BatchView,
    childViewContainer: 'tbody.batch-list',

    initialize: function() {
        View.__super__.initialize.apply(this);

        this.listenTo(this.collection, 'reset', this.render, this);
    }
});

module.exports = View;

