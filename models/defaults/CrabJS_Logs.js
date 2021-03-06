/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let Logs = new Schema({
    level: {type: String},
    user_id: {type: Schema.Types.Mixed},
    category: {type: String},
    message: {type: String}
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'crabJS_logs'
});

module.exports = mongoose.model('Logs', Logs);