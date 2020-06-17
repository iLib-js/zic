/*
 * zic.js - tool to convert the IANA tzdata files into json
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
import IANAFile from './IANAFile';
import ZoneSet from './ZoneSet';
import mkdirp from 'mkdirp';

const fs = require('fs');
const path = require('path');
const log4js = require('log4js');

log4js.configure(path.dirname(module.filename) + '/../log4js.json');

const logger = log4js.getLogger("zic");
let exitValue = 0;

function getVersion() {
    var pkg = require("../package.json");
    return `zic v${pkg.version} Copyright (c) 2020 JEDLSoft`;
}

function usage() {
    console.log(getVersion());
    console.log(
`Usage: zic [-acuqsv] [-r sourcedir] [-t targetdir]
Convert IANA tzdata files to json file.\n
-a or --all
  Include all rules for all time intervals.
  This is the default behaviour.
-c or --current
  Only produce rules and zones for the current year.
-r or --source sourcedir
  Indicate where the IANA tzdata source files are.
-h or --help
  this help
-q or --quiet
  Quiet mode. Only print banners and any errors/warnings.
-s or --silent
  Silent mode. Don't ever print anything on the stdout. Instead, just exit with
  the appropriate exit code.
-t or --target targetdir
  Write all output to the given target dir instead of in the source dir.
  Default: 'zoneinfo'.
-v or --version
  Print the current loctool version and exit`);
    process.exit(0);
}

function printVersion() {
    console.log(getVersion());
    process.exit(0);
}

// the global settings object that configures how the tool will operate
let settings = {
    sourceDir: ".",            // source directory where all IANA files reside
    targetDir: "zoneinfo",
    currentOnly: false
};

export default (argv) => {
    var options = [];
    for (let i = 0; i < argv.length; i++) {
        let val = argv[i];
        if (val === "-h" || val === "--help") {
            usage();
        } else if (val === "-q" || val === "--quiet") {
            logger.level = 'error';
        } else if (val === "-s" || val === "--silent") {
            logger.level = 'OFF';
        } else if (val === "-s" || val === "--source") {
            if (i+1 < argv.length && argv[i+1] && argv[i+1][0] !== "-") {
                settings.sourceDir = argv[++i];
            } else {
                console.error("Error: -s (--source) option requires a directory name argument to follow it.");
                usage();
            }
        } else if (val === "-t" || val === "--target") {
            if (i+1 < argv.length && argv[i+1] && argv[i+1][0] !== "-") {
                settings.targetDir = argv[++i];
            } else {
                console.error("Error: -t (--target) option requires a directory name argument to follow it.");
                usage();
            }
        } else if (val === "-v" || val === "--version") {
            printVersion();
        } else {
            options.push(val);
        }
    }

    logger.info(getVersion());
    logger.info("Convert IANA tzdata files to json.\n");

    const zoneSet = new ZoneSet();

    // find all the files first
    ["africa", "antarctica", "asia", "australasia", "europe", "northamerica", "southamerica"].forEach(fileName => {
        logger.info(`Reading ${fileName}...`);
        let file = new IANAFile(path.join(settings.sourceDir, fileName));

        zoneSet.addTransitions(file.getTransitions());
        zoneSet.addRawZones(file.getRawZones());
    });

    const ruleLists = zoneSet.getRuleLists();
    const zoneLists = zoneSet.getZoneLists();

    for (let listName in ruleLists) {
        const list = ruleLists[listName];
        const filePath = path.join(settings.targetDir, list.getPath());
        const parent = path.dirname(filePath);
        mkdirp.sync(parent);
        logger.info(`${filePath} ...`);
        fs.writeFileSync(filePath, JSON.stringify(list.toJson(), undefined, 4), "utf-8");
    }

    for (let listName in zoneLists) {
        const list = zoneLists[listName];
        const filePath = path.join(settings.targetDir, list.getPath());
        const parent = path.dirname(filePath);
        mkdirp.sync(parent);
        logger.info(`${filePath} ...`);
        fs.writeFileSync(filePath, JSON.stringify(list.toJson(), undefined, 4), "utf-8");
    }

    logger.info("Done");
    log4js.shutdown(function() {
        process.exit(exitValue);
    });
};
