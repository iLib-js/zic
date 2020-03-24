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

class Rule {
    constructor(options = {}) {
        const {
            name,
            from,
            to,
            start,
            end
        } = options;

        this.name = name;
        this.from = from;
        this.to = to;
        if (start) {
            this.start = {
                month: start.month,
                rule: start.rule,
                time: start.time,
                zoneChar: start.zoneChar,
                savings: start.savings,
                abbreviation: start.abbreviation,
                timeInMinutes: start.timeInMinutes,
                savingsInMinutes: start.savingsInMinutes
            }
        }
        if (end) {
            this.end = {
                month: end.month,
                rule: end.rule,
                time: end.time,
                zoneChar: end.zoneChar,
                savings: end.savings,
                abbreviation: end.abbreviation,
                timeInMinutes: end.timeInMinutes,
                savingsInMinutes: end.savingsInMinutes
            }
        }
    }

    getName() {
        return this.name;
    }

    isApplicable(date) {

    }

    toJson() {
        return {
            dates: {
                start: this.dateStart,
                end: this.dateEnd
            },
            start: this.start,
            end: this.end
        };
    }
};

export default Rule;
