/*
 * RuleList.js - Represent a list of DST rules with the same name
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

import Rule from './Rule';
import { convertToMinutes } from './utils';

const path = require("path");

function compareTransitions(left, right) {
    let result = left.startYear - right.startYear;
    if (result === 0) {
        result = left.endYear - right.endYear;
    }
    return result;
}


export default class RuleList {
    constructor(name) {
        this.name = name;
        this.transitions = [];

        this.rules = [];
        this.rulesProcessed = false;
    }

    /**
     * Return the name of this rule set.
     * @returns {string} the name of this rule set
     */
    getName() {
        return this.name;
    }

    /**
     * Add a transition from an IANA zone info file.
     * Transitions are the start or end of DST. These
     * are used to calculate the intervals when a rule is
     * applicable.
     */
    addTransition(transition) {
        transition.startYear = (transition.from === "min") ? 0 : parseInt(transition.from);
        transition.endYear = (transition.to === "max") ? Number.MAX_SAFE_INTEGER : parseInt(transition.to);
        this.rulesProcessed = false;
        this.transitions.push(transition);
    }

    processRules() {
        if (this.rulesProcessed) {
            return;
        }

        this.transitions.sort(compareTransitions);

        let starts = [];
        let ends = [];
        this.transitions.forEach(transition => {
            if (transition.savingsInMinutes) {
                starts.push(transition);
            } else {
                ends.push(transition);
            }
        });

        this.rules = [];

        let i = 0, j = 0;
        while (i < starts.length && j < ends.length) {
            const startDate = Math.max(starts[i].startYear, ends[j].startYear);
            const endDate = Math.min(starts[i].endYear, ends[j].endYear);

            this.rules.push(new Rule({
                name: starts[i].name,
                from: startDate,
                to: endDate,
                start: starts[i],
                end: ends[j]
            }));

            if (starts[i].endYear < ends[j].endYear) {
                i++;
            } else if (starts[i].endYear > ends[j].endYear) {
                j++;
            } else {
                i++;
                j++;
            }
        }

        // orphan start[s]
        while (i < starts.length) {
            const startDate = Math.max(starts[i].startYear, ends[j-1].endYear+1);
            const endDate = starts[i].endYear;

            this.rules.push(new Rule({
                name: starts[i].name,
                from: startDate,
                to: endDate,
                start: starts[i],
            }));
            i++;
        }

        // orphan end[s]
        while (j < ends.length) {
            const startDate = Math.max(starts[i-1].endYear+1, ends[j].startYear);
            const endDate = ends[j].endYear;

            this.rules.push(new Rule({
                name: ends[j].name,
                from: startDate,
                to: endDate,
                end: ends[j],
            }));
            j++;
        }

        this.rulesProcessed = true;
    }

    getRules() {
        this.processRules();
        return this.rules;
    }

    /**
     * Return a new rule list which has only the rules that applied
     * from the given "from" date to the the given "to" date.
     * @return {Array<Rule>} the rules applicable in that interval
     */
    getApplicableRules(from, to) {
        this.processRules();

        return this.rules.filter(rule => {
            return (rule.fromDate <= from && from <= rule.toDate) ||
                (rule.fromDate <= to && to <= rule.toDate) ||
                (from <= rule.fromDate && rule.fromDate <= to) ||
                (from <= rule.toDate && rule.toDate <= to);
        });
    }

    /**
     * Find the rule that applies to the given date.
     * @param {Date} date the date to search
     * @returns {number} The index of the rule that applies on that date
     */
    findRule(date) {

    }

    /**
     * Return the rule at the given index
     * @param {number} index the index of the rule to return
     * @param {Rule} the rule at the given index
     */
    getRule(index) {

    }

    toJson() {
        return {
            rules: this.rules.map((rule) => {
                return rule.toJson();
            })
        }
    }

    getPath() {
        return path.join("rules", `${this.name}.json`);
    }
}