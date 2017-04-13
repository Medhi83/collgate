/**
 * @file defaultlayout.js
 * @brief Default layout with one Bootstrap panel
 * @author Frederic SCHERMA
 * @date 2016-04-22
 * @copyright Copyright (c) 2016 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var Marionette = require('backbone.marionette');

var DefaultLayout = Marionette.LayoutView.extend({
    template: require("../templates/defaultlayout.html"),
    attributes: {
        style: "height: 100%;"
    },

    regions: {
        'title': ".panel-title",
        'content': ".panel-body",
        'content-bottom': ".panel-body-bottom",
        'bottom': ".panel-bottom"
    },

    onBeforeDestroy: function () {
        // reset to default global display mode
        //application.setDisplay("2-8-2");
    }
});

module.exports = DefaultLayout;
