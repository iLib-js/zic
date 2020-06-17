/*
 * Zone.js - Represent a time zone
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

const log4js = require("log4js");
const logger = log4js.getLogger("zic.Zone");

export default class Zone {
    constructor(name, rawZone = {}, previousRawZone = {}, rules = {}) {
        Object.assign(this, rawZone);

        this.name = name;

        // time zones were first used in 1883
        this.from = previousRawZone.to || "1883";
        this.fromDate = previousRawZone.toDate ? previousRawZone.toDate + 1000 : Date.UTC(1883, 0, 1);
        this.toDate = rawZone.toDate;
        this.offset = rawZone.offset;

        if (!this.to) {
            this.to = "present";
        }

        if (!this.name && previousRawZone.name) {
            this.name = previousRawZone.name;
        }

        this.ruleList = (this.rule && rules[this.rule]) ? rules[this.rule].getApplicableRules(this.fromDate, this.toDate) : [];

        this.format = this.format;
     }

    getName() {
        return this.name;
    }

    getPath() {

    }

    getRuleArray() {
        return this.ruleList;
    }

    toJson() {
        return [{
            from: this.from,
            to: this.to,
            offset: this.offset,
            abbreviation: this.format,
            rule: '-'
        }];
    }
}
