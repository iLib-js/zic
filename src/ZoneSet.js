/*
 * ZoneSet.js - Represent a collection of rules and zones
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

import RuleList from './RuleList';
import ZoneList from './ZoneList';

const path = require("path");

export default class ZoneSet {
    constructor() {
        this.ruleLists = {};
        this.zoneLists = {};
    }

    /**
     * Add a rule from an IANA zone info file.
     * Transitions are the start or end of DST. These
     * are used to calculate the intervals when a rule is
     * applicable.
     * @param {Transition} transition the transition to add
     */
    addTransition(transition) {
        const name = transition.getName();
        let list = this.ruleLists[name];
        if (!list) {
            list = new RuleList(name);
            this.ruleLists[name] = list;
        }
        list.addTransition(transition);
    }

    /**
     * Add an array of transitions from an IANA zone info file.
     * Transitions are the start or end of DST. These
     * are used to calculate the intervals when a rule is
     * applicable.
     * @param {Array.<Transition>} transitions a list of
     * transitions to add
     */
    addTransitions(transitions) {
        if (!transitions) return;
        transitions.forEach(transition => {
            this.addTransition(transition);
        });
    }

    /**
     * Add a raw zone from an IANA zone info file.
     * @param {RawZone} rawZone the zone to add
     */
    addRawZone(rawZone) {
        const name = rawZone.getName() || this.lastZoneName;
        let list = this.zoneLists[name];
        if (!list) {
            list = new ZoneList({
                name,
                rules: this.ruleLists
            });
            this.zoneLists[name] = list;
        }
        list.addRawZone(rawZone);
        this.lastZoneName = name;
    }

    /**
     * Add an array of raw zones from an IANA zone info file.
     * @param {Array<RawZone>} rawZones the zones to add
     */
    addRawZones(rawZones) {
        if (!rawZones || !rawZones.length) return;
        rawZones.forEach(rawZone => {
            this.addRawZone(rawZone);
        });
    }

    /**
     *
     */
    getRuleLists() {
        return this.ruleLists;
    }

    /**
     *
     */
    getZoneLists() {
        return this.zoneLists;
    }
}