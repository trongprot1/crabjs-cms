/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */


"use strict";

let bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser');
let session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    config = require('../config.json');

// Request body parsing middleware should be above methodOverride
exports.configure = function (app) {
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '5mb'
    }));

    app.use(bodyParser.json({limit: "5mb"}));
    app.use(methodOverride());

    // CookieParser should be above session
    app.use(cookieParser());

    app.use(session({
        store: new RedisStore({
            host: config.redis.host,
            port: config.redis.port,
            prefix: config.redis.prefix_session
        }),
        saveUninitialized: true,
        resave: true, // don't save session if unmodified
        secret: '100dayproject.org',
        key: '100dayproject'
    }));
};