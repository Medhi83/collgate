/**
 * @file accessionconsumerbatchproducerit.js
 * @brief Accession consumer - Batch producer step iterative version
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2018-04-10
 * @copyright Copyright (c) 2018 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

let ActionStepFormat = require('./actionstepformat');
let AccessionConsumerBatchProducer = require('./accessionconsumerbatchproducer');
let Marionette = require('backbone.marionette');

let Format = function() {
    ActionStepFormat.call(this);

    this.name = "accessionconsumer_batchproducer_it";
    this.group = "standard";
    this.description = _t("Take a list of accession in input and generate one or many batch in output.");
    this.iterative = true;
};

_.extend(Format.prototype, ActionStepFormat.prototype, {
    defaultFormat: function() {
       return {
            'options': {},
            'producers': []
        };
    }
});

Format.ActionStepProcessView = AccessionConsumerBatchProducer.ActionStepProcessView.extend({
    // @todo what needed in this case
});

Format.ActionStepFormatDetailsView = AccessionConsumerBatchProducer.ActionStepFormatDetailsView.extend({
});

Format.ActionStepFormatDetailsView = AccessionConsumerBatchProducer.ActionStepFormatDetailsView.extend({
});

module.exports = Format;
