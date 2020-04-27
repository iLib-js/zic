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
    constructor(rawZone = {}, previousRawZone = {}, rules = {}) {
        Object.assign(this, rawZone);

        // time zones were first used in 1883
        this.from = previousRawZone.to || "1883";
        this.fromDate = previousRawZone.toDate || Date.UTC(1883, 0, 1);
        this.toDate = rawZone.toDate - 1000;

        if (!this.name && previousRawZone.name) {
            this.name = previousRawZone.name;
        }

        if (this.rule && rules[this.rule]) {
            this.ruleList = rules[this.rule].getApplicableRules(this.fromDate, this.toDate);
        }
     }

    getName() {
        return this.name;
    }

    getPath() {

    }

    getRules() {
        return this.ruleList;
    }

    toJson() {
    }
}