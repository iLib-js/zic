/*
 * RawZone.js - Represent a time zone
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

import { parseDate, lastSecond } from './utils';

const log4js = require("log4js");
const logger = log4js.getLogger("zic.RawZone");

export default class RawZone {
    constructor(fields) {
        if (!fields) return;

        if (Array.isArray(fields)) {
            logger.trace("fields are " + JSON.stringify(fields));
            this.name = fields[1];
            logger.debug("Found zone " + this.name);

            this.offset = fields[2];
            this.rule = fields[3] === '-' ? "" : fields[3];
            this.format = fields[4];
            if (fields.length < 6) {
                this.to = "present";
            } else {
                this.to = fields[5]; // year
                if (fields[6]) {
                    // month
                    this.to += " " + fields[6];
                }
                if (fields[7]) {
                    // day
                    this.to += " " + fields[7];
                }

                if (fields[8]) {
                    // time of day
                    this.time = fields[8];
                    this.to += " " + fields[8];
                }
            }
        } else {
            Object.assign(this, fields);
        }

        if (!this.to || this.to === "present") {
            this.toDate = Date.now();
        } else {
            const d = parseDate(this.to);
            this.toDate = d.getTimeExtended() - 1000;
        }
    }

    getName() {
        return this.name;
    }
}