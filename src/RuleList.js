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
import { lastSecond, ianaDateStr } from './utils';

const path = require("path");

function compareTransitions(left, right) {
    let result = left.fromDate - right.fromDate;
    if (result === 0) {
        result = left.toDate - right.toDate;
    }
    return result;
}

// as long as both the starts are before the other's end,
// then there is an overlap between the times
function isOverlapping(left, right) {
    return (left && right && left.fromDate <= right.toDate && right.fromDate <= left.toDate);
}


export default class RuleList {
    constructor(name) {
        if (!name) {
            throw "RuleList created without a name!";
        }

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
     * @param {Transition} transition the transition to add
     */
    addTransition(transition) {
        // transition.fromDate = (transition.from === "min") ? 0 : parseInt(transition.from);
        // transition.toDate = (transition.to === "max") ? Number.MAX_SAFE_INTEGER : parseInt(transition.to);
        this.rulesProcessed = false;
        this.transitions.push(transition);
    }

    /**
     * Add an array of transitions from an IANA zone info file.
     * These are added one by one to the list.
     * @param {Array.<Transition>} transitions the array of transitions to add
     */
    addTransitions(transitions) {
        if (!transitions || !Array.isArray(transitions)) return;

        transitions.forEach(transition => this.addTransition(transition));
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

        // cases:
        // northern hemisphere - DST starts in the early part of the year, ends in the late part
        // southern hemisphere - DST starts in the late part of the year, ends in the early part of the next year
        //
        // starts - in the southern hemisphere may be in the previous year
        // ends - in the southern hemisphere may be in the next year
        //
        // orphans - at the end of DST, there is a portion of fixed time which may end with DST time
        // standard time, or some other time. This can create orphans which are transitions that have
        // no companions in the same year.
        //
        // gaps - there may be times when there are gaps in the rules because the rules are not being used
        // by any zone at that moment. In these cases, we should represent the rule as fixed time according
        // to the last transition.
        //
        // overlaps - sometimes there are multiple conflicting rules that apply in the same year. Here we have
        // to try and figure out which rule to use.
        //

        let i = 0, j = 0;
        while (i < starts.length && j < ends.length) {
            let startDate = Math.max(starts[i].fromDate, ends[j].fromDate);
            let endDate = Math.min(starts[i].toDate, ends[j].toDate);

            // first, figure out the orphan starts
            if (starts[i].fromDate < ends[j].fromDate) {
                // orphan start
                if (starts[i].toDate < ends[j].fromDate) {
                    // start without an end in that year!
                    this.rules.push(new Rule({
                        name: starts[i].name,
                        from: starts[i].from,
                        to: starts[i].to,
                        start: starts[i]
                    }));
                    i++;
                    continue;
                } else {
                    // start starts before end starts and overlaps
                    // first the orphan part
                    this.rules.push(new Rule({
                        name: starts[i].name,
                        from: starts[i].from,
                        to: ends[j].from,
                        start: starts[i]
                    }));
                }
            } else if (ends[j].fromDate < starts[i].fromDate) {
                if (ends[j].toDate < starts[i].fromDate) {
                    // end without a start in that year!
                    this.rules.push(new Rule({
                        name: ends[j].name,
                        from: ends[j].from,
                        to: ends[j].to,
                        end: ends[j]
                    }));
                    j++;
                    continue;
                } else {
                    // end starts before start starts and overlaps
                    // first the orphan part
                    this.rules.push(new Rule({
                        name: starts[i].name,
                        from: starts[i].from,
                        to: ends[j].from,
                        start: starts[i]
                    }));
                }
            }

            // ... then process all the overlapping rules
            while (i < starts.length && j < ends.length && isOverlapping(starts[i], ends[j])) {
                startDate = Math.max(starts[i].fromDate, ends[j].fromDate);
                endDate = Math.min(starts[i].toDate, ends[j].toDate);

                this.rules.push(new Rule({
                    name: starts[i].name,
                    from: (starts[i].fromDate < ends[j].fromDate) ? ends[j].from : starts[i].from,
                    to: (starts[i].toDate < ends[j].toDate) ? starts[i].to : ends[j].to,
                    start: starts[i],
                    end: ends[j]
                }));

                if (starts[i].toDate < ends[j].toDate) {
                    i++;
                } else if (starts[i].toDate > ends[j].toDate) {
                    j++;
                } else {
                    i++;
                    j++;
                }
            }

            // finally, process the orphan ends
            if (i < starts.length && j >= ends.length) {
             // add 1000 to get it to the second after the last second of the the previous date
                startDate = lastSecond(ends[j-1].to) + 1000;
                this.rules.push(new Rule({
                    name: starts[i].name,
                    from: ianaDateStr(startDate),
                    fromDate: startDate,
                    to: starts[i].to,
                    start: starts[i],
                }));
                i++;
            } else if (i >= starts.length && j < ends.length) {
                // add 1000 to get it to the second after the last second of the the previous date
                startDate = lastSecond(starts[i-1].to) + 1000;
                this.rules.push(new Rule({
                    name: ends[j].name,
                    from: ianaDateStr(startDate),
                    fromDate: startDate,
                    to: ends[j].to,
                    end: ends[j],
                }));
                j++;
            } else if (isOverlapping(starts[i], ends[j])) {
                if (starts[i].toDate > ends[j].toDate) {
                    this.rules.push(new Rule({
                        name: starts[i].name,
                        from: ends[j].to,
                        to: starts[i].to,
                        start: starts[i],
                    }));
                    i++;
                } else if (starts[i].toDate < ends[j].toDate) {
                    this.rules.push(new Rule({
                        name: ends[j].name,
                        from: starts[i].to,
                        to: ends[j].to,
                        end: ends[j],
                    }));
                    j++;
                }
            }
            // after this, there should be either a gap or the end of the rules. IF
            // there is a gap, we restart processing above looking for new orphan
            // starts
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
    getApplicableRules(fromDate, toDate) {
        this.processRules();

        let rules = [];

        this.rules.forEach((rule, index) => {
            if (isOverlapping(rule, { fromDate, toDate })) {
                rules.push(index);
            }
        });

        return rules;
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
        this.processRules();
        return {
            name: this.name,
            rules: this.rules.map((rule) => {
                return rule.toJson();
            })
        }
    }

    getPath() {
        return path.join("rules", `${this.name}.json`);
    }
}