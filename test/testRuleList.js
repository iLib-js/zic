/*
 * testRuleList.js - test the rule list object
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

import Transition from '../src/Transition';
import Rule from '../src/Rule';
import RuleList from '../src/RuleList';

function split(line) {
    const cleanLine = line.replace(/#.*$/g, "");
    return cleanLine.split(/\s+/g);
}

module.exports.testrulelist = {
    testConstructorSimple: test => {
        test.expect(1);

        const rl = new RuleList("StJohns");
        test.ok(rl);

        test.done();
    },

    testConstructorNoName: test => {
        test.expect(2);
        let rl;

        test.throws(function noname() {
            rl = new RuleList();
            test.fail();
        });

        test.ok(!rl);

        test.done();
    },

    testGetName: test => {
        test.expect(2);
        const rl = new RuleList("StJohns");
        test.ok(rl);

        test.equal(rl.getName(), "StJohns");
        test.done();
    },

    testGetRulesReturnsArray: test => {
        test.expect(3);
        let fields = split("Rule    StJohns 1987    only    -       Apr     Sun>=1  0:01    1:00    D");
        const ts = new Transition(fields);
        fields = split("Rule    StJohns 1987    2006    -       Oct     lastSun 0:01    0       S");
        const te = new Transition(fields);

        const rl = new RuleList("StJohns");
        test.ok(rl);

        rl.addTransition(ts);
        rl.addTransition(te);

        const rules = rl.getRules();
        test.ok(rules);
        test.ok(Array.isArray(rules));

        test.done();
    },

    testGetRulesRightContents: test => {
        test.expect(4);
        let fields = split("Rule    StJohns 1987    only    -       Apr     Sun>=1  0:01    1:00    D");
        const ts = new Transition(fields);
        fields = split("Rule    StJohns 1987    only    -       Oct     lastSun 0:01    0       S");
        const te = new Transition(fields);

        const rl = new RuleList("StJohns");
        test.ok(rl);

        rl.addTransition(ts);
        rl.addTransition(te);

        const rules = rl.getRules();
        test.ok(rules);

        test.equal(rules.length, 1);
        test.contains(rules[0], {
            name: "StJohns",
            from: 1987,
            fromDate: Date.UTC(1987, 0, 1, 0, 0, 0),
            to: 1987,
            toDate: Date.UTC(1987, 11, 31, 23, 59, 59),
            start: {
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D",
                timeInMinutes: 1,
                savingsInMinutes: 60
            },
            end: {
                month: 10,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S",
                timeInMinutes: 1,
                savingsInMinutes: 0
            }
        });
        test.done();
    },

    testAddTransitions: test => {
        test.expect(3);
        let fields = split("Rule    StJohns 1987    only    -       Apr     Sun>=1  0:01    1:00    D");
        const ts = new Transition(fields);
        fields = split("Rule    StJohns 1987    only    -       Oct     lastSun 0:01    0       S");
        const te = new Transition(fields);

        const rl = new RuleList("StJohns");
        rl.addTransitions([ts, te]);

        const rules = rl.getRules();
        test.ok(rules);

        test.equal(rules.length, 1);
        test.contains(rules[0], {
            name: "StJohns",
            from: 1987,
            fromDate: Date.UTC(1987, 0, 1, 0, 0, 0),
            to: 1987,
            toDate: Date.UTC(1987, 11, 31, 23, 59, 59),
            start: {
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D",
                timeInMinutes: 1,
                savingsInMinutes: 60
            },
            end: {
                month: 10,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S",
                timeInMinutes: 1,
                savingsInMinutes: 0
            }
        });

        test.done();
    },

    /*
    testConstructorRightContents: test => {
        test.expect(1);
        let fields = split("Rule    StJohns 1987    only    -       Apr     Sun>=1  0:01    1:00    D");
        const ts = new Transition(fields);
        fields = split("Rule    StJohns 1987    2006    -       Oct     lastSun 0:01    0       S");
        const te = new Transition(fields);

        const r = new Rule({
            name: ts.getName(),
            from: "1987",
            to: "1987",
            start: ts,
            end: te
        });

        test.contains(r, {
            name: "StJohns",
            from: 1987,
            fromDate: Date.UTC(1987, 0, 1, 0, 0, 0),
            to: 1987,
            toDate: Date.UTC(1987, 11, 31, 23, 59, 59),
            start: {
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D",
                timeInMinutes: 1,
                savingsInMinutes: 60
            },
            end: {
                month: 10,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S",
                timeInMinutes: 1,
                savingsInMinutes: 0
            }
        });
        test.done();
    },

    testConstructorNoStart: test => {
        test.expect(1);
        let fields = split("Rule    StJohns 1987    2006    -       Oct     lastSun 0:01    0       S");
        const te = new Transition(fields);

        const r = new Rule({
            name: ts.getName(),
            from: "1987",
            to: "1987",
            end: te
        });

        test.contains(r, {
            name: "StJohns",
            from: 1987,
            fromDate: Date.UTC(1987, 0, 1, 0, 0, 0),
            to: 1987,
            toDate: Date.UTC(1987, 11, 31, 23, 59, 59),
            end: {
                month: 10,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S",
                timeInMinutes: 1,
                savingsInMinutes: 0
            }
        });
        test.done();
    },

    testConstructorNoEnd: test => {
        test.expect(1);
        let fields = split("Rule    StJohns 1987    only    -       Apr     Sun>=1  0:01    1:00    D");
        const ts = new Transition(fields);
        const r = new Rule({
            name: ts.getName(),
            from: "1987",
            to: "1987",
            start: ts
        });

        test.contains(r, {
            name: "StJohns",
            from: 1987,
            fromDate: Date.UTC(1987, 0, 1, 0, 0, 0),
            to: 1987,
            toDate: Date.UTC(1987, 11, 31, 23, 59, 59),
            start: {
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D",
                timeInMinutes: 1,
                savingsInMinutes: 60
            }
        });
        test.done();
    },

    testConstructorNoStartOrEnd: test => {
        test.expect(1);

        const r = new Rule({
            name: ts.getName(),
            from: "1987",
            to: "1987"
        });

        test.contains(r, {
            name: "StJohns",
            from: 1987,
            fromDate: Date.UTC(1987, 0, 1, 0, 0, 0),
            to: 1987,
            toDate: Date.UTC(1987, 11, 31, 23, 59, 59)
        });
        test.done();
    },
    */
};
