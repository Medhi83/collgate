/**
 * @file init.js
 * @brief Main module init entry point
 * @author Frederic SCHERMA
 * @date 2016-04-12
 * @copyright Copyright (c) 2016 INRA UMR1095 GDEC
 * @license @todo
 * @details
 */

var Marionette = require('backbone.marionette');

//mainStyle = require('./css/main.css');  // included in main.html on django side

//
// Main module definition
//

var MainModule = Marionette.Module.extend({

    initialize: function(moduleName, app, options) {
        // i18n
        if (user.language === "fr") {
            i18next.addResources('fr', 'default', require('./locale/fr/LC_MESSAGES/default.json'));
            //gt.addTextdomain('default', require('./locale/fr/LC_MESSAGES/default.mo'));
        } else {  // default to english
            i18next.addResources('en', 'default', require('./locale/en/LC_MESSAGES/default.json'));
            //gt.addTextdomain('default', require('./locale/en/LC_MESSAGES/default.mo'));
        }

        this.models = {};
        this.collections = {};
        this.views = {};
        this.routers = {};

        var SelectOptionItemView = require('./views/selectoptionitemview');

        var LanguageCollection = require('./collections/language');
        this.collections.languages = new LanguageCollection();

        this.views.languages = new SelectOptionItemView({
            className: 'language',
            collection: this.collections.languages,
        });

        this.views.Home = Marionette.CompositeView.extend({
            el: '#main_content',
            template: require('./templates/home.html'),
        });
    },

    onStart: function(options) {
        var MainRouter = require('./routers/main');
        this.routers.main = new MainRouter();

        var ProfileRouter = require('./routers/profile');
        this.routers.profile = new ProfileRouter();
    },

    onStop: function(options) {

    },
});

var main =  ohgr.module("main", MainModule);

module.exports = main;
