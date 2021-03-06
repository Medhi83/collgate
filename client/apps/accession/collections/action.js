/**
 * @file action.js
 * @brief
 * @author Frederic SCHERMA (INRA UMR1095)
 * @date 2017-12-08
 * @copyright Copyright (c) 2017 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details
 */

let ActionModel = require('../models/action');
let CountableCollection = require('../../main/collections/countable');

let Collection = CountableCollection.extend({
    url: function () {
        return window.application.url(['accession', 'action'])
    },
    model: ActionModel,

    initialize: function (options) {
        options || (options = {});

        Collection.__super__.initialize.apply(this, arguments);

        // this.entityId = options.entityId;
        // this.entityType = options.entityType;
    }
});

module.exports = Collection;
