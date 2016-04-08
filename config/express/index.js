/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */


"use strict";

let path = require('path'),
    os = require('os'),
    express = require('express'),
    logger = require('morgan'),
    userAgent = require('express-useragent'),
    flash = require('connect-flash'),
    helmet = require('helmet'),
    viewEngine = require('./nunjucks'),
    requestParser = require('./requestParser'),
    appLoader = require('./appLoaders'),
    throwError = require('./throwError'),
    passport = require('../passports');

module.exports = function () {

    // Initialization express application
    let app = express();

    if (process.env.NODE_ENV === 'development' || os.hostname() == 'DESKTOP-PSSOURR' || os.hostname() == 'Razor') {
        app.use(logger('dev'));

        /** Disable views cache */
        app.set('view cache', false);
        app.enable('verbose errors');
    } else {
        app.locals.cache = 'memory';
        app.disabled('verbose errors');

        /** trust first proxy */
        app.set('trust proxy', 1);

    }
    app.enable("trust proxy");

    app.set("showStackError", true);

    app.use(express.static(path.resolve('./public'), {maxAge: 3600}));

    app.use(userAgent.express());

    /**
     * Passing the request url to environment locals
     */
    app.use(function (req, res, next) {
        res.locals.url = req.protocol + "://" + req.headers.host + req.url;
        res.locals.route = req.url;
        res.locals.path = req.protocol + "://" + req.headers.host;
        //res.setHeader('Cache-Control', 'public, max-age=600');  // Enable for caching session-flash
        next();
    });

    /**
     * Helmet module security express application.
     * Use helmet to security web application, xss vulnerability,..
     */
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.enable("trust proxy");
    app.set("trust proxy", true);
    app.use(helmet.hidePoweredBy({setTo: "PHP 4.2.0"}));
    //app.disable("x-powered-by");

    /**
     * Request parser call bodyParser, cookie-parser, cookie-parser, express-session for storage
     * and extends `delete` method using methodOverride module
     */
    requestParser.configure(app);


    let view = new viewEngine(app);
    view.configure({
        path: __base + '/',
        autoescape: false,
        dev: true
    }, {
        showConfigure: true
    });

    /**
     * Connect-flash module middleware
     */
    app.use(flash());
    app.use(function (req, res, next) {
        res.locals.messages = req.session.flash;
        delete req.session.flash;
        next();
    });

    /**
     * Passport strategies
     */
    passport.configure(app);

    /**
     * Application router loader modules
     */
    appLoader.routeLoader(app);

    /**
     * Logging exception error any status
     */
    throwError.configure(app);

    return app;
};