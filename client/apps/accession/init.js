/**
 * @file init.js
 * @brief Accession module init entry point
 * @author Frederic SCHERMA
 * @date 2016-05-26
 * @copyright Copyright (c) 2016 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var AccessionModule = function() {
    this.name = "accession";
};

AccessionModule.prototype = {
    initialize: function(app, options) {
        Logger.time("Init accession module");

        this.models = {};
        this.collections = {};
        this.views = {};
        this.routers = {};
        this.controllers = {};

        // i18n if not english
        if (session.language !== "en") {
            try {
                i18next.addResources(session.language, 'default', require('./locale/' + session.language + '/LC_MESSAGES/default.json'));
            } catch (e) {
                console.warning("No translation found for the current language. Fallback to english language");
            }
        }

        //
        // main collections
        //

        var SelectOption = require('../main/renderers/selectoption');

        var AccessionSynonymTypeCollection = require('./collections/accessionsynonymtype');
        this.collections.accessionSynonymTypes = new AccessionSynonymTypeCollection();

        this.views.accessionSynonymTypes = new SelectOption({
            className: 'accession-synonym-type',
            collection: this.collections.accessionSynonymTypes
        });

        var BatchActionTypeCollection = require('./collections/batchactiontype');
        this.collections.batchActionTypes = new BatchActionTypeCollection();

        this.views.batchActionTypes = new SelectOption({
            className: 'batch-action-type',
            collection: this.collections.batchActionTypes
        });

        //
        // controllers
        //

        var AccessionController = require('./controllers/accession');
        this.controllers.accession = new AccessionController();

        //
        // routers
        //

        var AccessionRouter = require('./routers/accession');
        this.routers.accession = new AccessionRouter();

        var BatchRouter = require('./routers/batch');
        this.routers.batch = new BatchRouter();

        Logger.timeEnd("Init accession module");
    },

    start: function(options) {
        Logger.time("Start accession module");

        // nothing to do

        Logger.timeEnd("Start accession module");
    },

    stop: function(options) {

    }
};

module.exports = AccessionModule;
