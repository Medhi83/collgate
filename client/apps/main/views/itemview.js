/**
 * @file itemview.js
 * @brief Base item view with compoundable properties
 * @author Frederic SCHERMA
 * @date 2016-12-15
 * @copyright Copyright (c) 2016 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var Marionette = require('backbone.marionette');

var View = Marionette.ItemView.extend({
    constructor: function() {
        var prototype = this.constructor.prototype;

        this.events = {};
        this.defaultOptions = {};
        this.ui = {};
        this.attributes = {};
        this.className = "";

        while (prototype) {
            if (prototype.hasOwnProperty("events")) {
                _.defaults(this.events, prototype.events);
            }
            if (prototype.hasOwnProperty("defaultOptions")) {
                _.defaults(this.defaultOptions, prototype.defaultOptions);
            }
            if (prototype.hasOwnProperty("ui")) {
                _.defaults(this.ui, prototype.ui);
            }
            if (prototype.hasOwnProperty("attributes")) {
                _.defaults(this.attributes, prototype.attributes);
            }
            if (prototype.hasOwnProperty("className")) {
                this.className += " " + prototype.className;
            }
            prototype = prototype.constructor.__super__;
        }

        Marionette.ItemView.apply(this, arguments);
    },

    initialize: function (options) {
        View.__super__.initialize.apply(this);
    }
});

module.exports = View;
