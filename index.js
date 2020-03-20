#!/usr/bin/env node
/*
 * index.js - tool to convert the IANA tzdata files into json
 *
 * Copyright © 2020, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * This code is intended to be run under node.js
 */

var path = require("path");

var rootPath = __dirname;

//use babel to convert to es5 before running
process.env.BABEL_ENV = "tests";
require("@babel/register")({
    root: rootPath,
    rootMode: "upward",
    include: [".", "./src"]
});
require('@babel/polyfill');

var zic = require("./src/zic.js").default;

zic(process.argv);