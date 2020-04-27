/*
 * ZoneList.js - Represent a time zone across time intervals
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

import Zone from './Zone';

function compareRawZones(left, right) {
    let result = left.toDate - right.toDate;
    return result;
}

export default class ZoneList {
    constructor(options = {}) {
        const {
            name,
            rules
        } = options;

        this.rawZones = [];
        this.name = name;
        this.rules = rules;
        this.zones = [];
    }

    processZones() {
        if (this.rulesProcessed) {
            return;
        }

        // this.rawZones.sort(compareRawZones);

        this.zones.push(new Zone(this.rawZones[0]));

        for (let i = 1; i < this.rawZones.length; i++) {
            this.zones.push(new Zone(this.rawZones[i], this.rawZones[i-1], this.rules));
        }

        this.rulesProcessed = true;
    }

    /**
     * Return the name of this Zone set.
     * @returns {string} the name of this Zone set
     */
    getName() {
        return this.name;
    }

    /**
     * Add a Zone to the set
     */
    addRawZone(zone) {
        this.rawZones.push(zone);
    }

    /**
     * Find the Zone that applies to the given date.
     * @param {Date} date the date to search
     * @returns {Zone} The zone that applies on that date
     */
    findZone(date) {
        this.processZones();
    }

    getZones() {
        this.processZones();
        return this.zones;
    }

    toJson() {
        this.processZones();
        return {
            zones: this.zones.map(zone => {
                return zone.toJson();
            })
        }
    }

    getPath() {
        return `${this.name}.json`;
    }
}