/**
 * @file batchconsumerbatchproducer.js
 * @brief Batch consumer - Batch producer step
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2017-12-19
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

let ActionStepFormat = require('./actionstepformat');
let Marionette = require('backbone.marionette');

let Format = function() {
    ActionStepFormat.call(this);

    this.name = "batchconsumer_batchproducer";
    this.group = "standard";
};

_.extend(Format.prototype, ActionStepFormat.prototype, {

});

Format.ActionStepFormatDetailsView = Marionette.View.extend({
    className: 'action-step-format-details',
    template: require('../templates/actionstep/batchconsumerbatchproducer.html'),

    initialize: function() {
        this.listenTo(this.model, 'change', this.render, this);
    },

    onRender: function() {
        let format = this.model.get('format');
    },

    getFormat: function() {
        return {
        }
    }
});

module.exports = Format;