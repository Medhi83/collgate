/**
 * @file init.js
 * @brief Audit module init entry point
 * @author Frédéric SCHERMA (INRA UMR1095)
 * @date 2016-06-24
 * @copyright Copyright (c) 2016 INRA/CIRAD
 * @license MIT (see LICENSE file)
 * @details 
 */

let AuditModule = function() {
    this.name = "audit";
};

AuditModule.prototype = {
    initialize: function (app, options) {
        this.models = {};
        this.collections = {};
        this.views = {};
        this.routers = {};
        this.controllers = {};

        try {
            i18next.default.addResources(session.language, 'default', require('./locale/' + session.language + '/default.json'));
        } catch (e) {
            console.warn("No translation found for the current language. Fallback to english language");
        }

        //
        // controllers
        //

        let AuditController = require('./controllers/audit');
        this.controllers.audit = new AuditController();

        //
        // routers
        //

        let AuditRouter = require('./routers/audit');
        this.routers.audit = new AuditRouter();
    },

    start: function (app, options) {
        // nothing to do
    },

    stop: function (options) {

    }
};

module.exports = AuditModule;
