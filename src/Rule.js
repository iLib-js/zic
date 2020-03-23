/*
 * Rule.js - Represent a DST rule for a particular time interval
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

import isDigit from 'ilib-es6';

const log4js = require("log4js");
const logger = log4js.getLogger("zic.Rule");

function convertToMinutes(time) {
    var parts = time.split(/:/g);
    switch (parts.length) {
        default:
        case 1:
            return parseInt(parts[0]) * 60;
        case 2:
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        case 3:
            // ignore the seconds
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
}

function convertRule(rule) {
    if (rule.startsWith("last")) {
        return `l${days[rule.substring(4)]}`;
    }

    if (rule.startsWith(first)) {
        return `f${days[rule.substring(5)]}`;
    }

    if (rule.indexOf('=') > -1) {
        return days[rule.substring(0, 3)] + rule.substring(3);
    }

    return rule;
}

class Rule {
    constructor(options = {}) {
        const {
            name,
            startDate,
            endDate
        } = options;

        this.name = name;
    }

    getName() {
        return this.name;
    }

    toJson() {
        return {
            dates: {
                start: this.startDate,
                end: this.endDate
            },
            start: {

            },
            end: {

            }
        };
    }
};

export default Rule;
