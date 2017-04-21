/**
 * @file quarterlayout.js
 * @brief Two columns of two rows layout
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2017-02-03
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

var Marionette = require('backbone.marionette');

var View = Marionette.LayoutView.extend({
    template: require("../templates/quarterlayout.html"),
    attributes: {
        style: "height: 100%;"
    },

    regions: {
        'top-left': "div.row-up div.left",
        'bottom-left': "div.row-down div.left",
        'top-right': "div.row-up div.right",
        'bottom-right': "div.row-down div.right"
    }
});

module.exports = View;

