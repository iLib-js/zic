/*
 * Transition.js - Represent a DST transition, ie. the start or end
 * of DST
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

import { isDigit, GregorianDate } from 'ilib-es6';

const log4js = require("log4js");
const logger = log4js.getLogger("zic.Transition");

const months = {
    "Jan": 1,
    "Feb": 2,
    "Mar": 3,
    "Apr": 4,
    "May": 5,
    "Jun": 6,
    "Jul": 7,
    "Aug": 8,
    "Sep": 9,
    "Oct": 10,
    "Nov": 11,
    "Dec": 12
};

const days = {
    "Sun": 0,
    "Mon": 1,
    "Tue": 2,
    "Wed": 3,
    "Thu": 4,
    "Fri": 5,
    "Sat": 6
};

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

function convertRule(transition) {
    if (transition.startsWith("last")) {
        return `l${days[transition.substring(4)]}`;
    }

    if (transition.startsWith("first")) {
        return `f${days[transition.substring(5)]}`;
    }

    if (transition.indexOf('=') > -1) {
        return days[transition.substring(0, 3)] + transition.substring(3);
    }

    return transition;
}

class Transition {
    constructor(fields) {
        logger.trace("fields are " + JSON.stringify(fields));
        if (!fields) return;
        if (Array.isArray(fields)) {
            this.name = fields[1];
            logger.debug("Found transition " + this.name);

            this.from = fields[2];
            this.to = fields[3];
            if (this.to === "only") {
                this.to = this.from;
            }
            this.month = months[fields[5]];
            this.rule = convertRule(fields[6]);
            this.time = fields[7];
            this.zoneChar = 'w';
            let lastChar = this.time[this.time.length - 1];
            if (!isDigit(lastChar)) {
                switch (lastChar) {
                    case 's':
                    case 'S':
                        // standard time -> offset without the savings time
                        // for start Transitions, this is the same as wall time
                        // for end Transitions, this is wall time - savings time
                        this.zoneChar = 's';
                        break;
                    case 'u':
                    case 'U':
                    case 'g':
                    case 'G':
                    case 'z':
                    case 'Z':
                        // UTC
                        this.zoneChar = 'u';
                        break;
                    case 'w':
                    case 'W':
                    default:
                        // Wall time
                        this.zoneChar = 'w';
                    break;
                }
                this.time = this.time.substring(0, this.time.length - 1);
                logger.debug("found zone char " + this.zoneChar);
            }
            this.timeInMinutes = convertToMinutes(this.time);
            this.savings = fields[8];
            this.savingsInMinutes = convertToMinutes(this.savings);
            this.abbreviation = fields[9] === '-' ? "" : fields[9];
        } else {
            Object.assign(this, fields);
        }
    }

    getName() {
        return this.name;
    }

    convertToWallTime() {
        if (this.zoneChar !== 'w') {
            let parts = this.time.split(/:/g);
            let hour = parts[0];
            let minute = parts[1] || 0;
            let gd = new GregorianDate({
                year: 1970,
                month: 1,
                day: 1,
                hour: hour,
                minute: minute
            });

            if (this.zoneChar === 'u') {

            }
        }
    }

    toJson() {

    }
};

export default Transition;
