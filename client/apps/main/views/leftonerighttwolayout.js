/**
 * @file leftonerighttwolayout.js
 * @brief Two columns, one row at left, two rows at right layout
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2016-10-14
 * @copyright Copyright (c) 2016 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

let Marionette = require('backbone.marionette');

let TwoColumnsLayout = Marionette.View.extend({
    template: require("../templates/leftonerighttwolayout.html"),
    attributes: {
        style: "height: 100%;"
    },

    regions: {
        'left-content': ".left-content",
        'left-bottom': ".left-bottom",
        'right-up-content': ".right-up-content",
        'right-up-bottom': ".right-up-bottom",
        'right-down-content': ".right-down-content",
        'right-down-bottom': ".right-down-bottom"
    },

    childViewEvents: {
        'select:tab': function (region, child) {
            this.triggerMethod('select:tab', region, child);
        },
    }
});

module.exports = TwoColumnsLayout;
