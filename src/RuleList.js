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

export default class RuleList {
    constructor(name) {
        this.name = name;
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
     * Add a rule to the set
     */
    addRule(rule) {

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

    }
}