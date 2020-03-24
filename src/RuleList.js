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
        transition.savingsMinutes = convertToMinutes(transition.savings);
        this.transitions.push(transition);
    }

    processRules() {
        this.transitions.sort(compareTransitions);

        let starts = [];
        let ends = [];
        this.transitions.forEach(transition => {
            if (transition.savingsMinutes) {
                starts.push(transition);
            } else {
                ends.push(transition);
            }
        });

        let i = 0, j = 0;
        while (i < starts.length && j < ends.length) {
            const startDate = Math.max(starts[i].startYear, ends[j].startYear);
            const endDate = Main.min(start[i].endYear, ends[j].endYear);

            this.rules.push(new Rule({
                from: startDate,
                to: endDate,
                start: starts[i],
                end: ends[j]
            }));

            if (start[i].endYear < ends[j].endYear) {
                i++;
            } else if (start[i].endYear > ends[j].endYear) {
                j++;
            } else {
                i++;
                j++;
            }
        }
    }

    getRules() {
        return this.rules;
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