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

import { DateFactory } from 'ilib-es6';

import Transition from '../src/Transition';
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

    testRuleListRightContents: test => {
        test.expect(2);
        let fields = split("Rule    StJohns 1987    only    -       Apr     Sun>=1  0:01    1:00    D");
        const ts = new Transition(fields);
        fields = split("Rule    StJohns 1987    2006    -       Oct     lastSun 0:01    0       S");
        const te = new Transition(fields);

        const rl = new RuleList("StJohns");
        rl.addTransitions([ts, te]);

        const rules = rl.getRules();
        test.ok(rules);

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

    testRuleListNoStart: test => {
        test.expect(2);
        let fields = split("Rule    StJohns 1987    2006    -       Oct     lastSun 0:01    0       S");
        const te = new Transition(fields);

        const rl = new RuleList("StJohns");
        rl.addTransitions([te]);

        const rules = rl.getRules();
        test.ok(rules);

        test.contains(rules[0], {
            name: "StJohns",
            from: 1987,
            fromDate: Date.UTC(1987, 0, 1, 0, 0, 0),
            to: 2006,
            toDate: Date.UTC(2006, 11, 31, 23, 59, 59),
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

    testRuleListNoEnd: test => {
        test.expect(2);
        let fields = split("Rule    StJohns 1987    only    -       Apr     Sun>=1  0:01    1:00    D");
        const ts = new Transition(fields);

        const rl = new RuleList("StJohns");
        rl.addTransitions([ts]);

        const rules = rl.getRules();
        test.ok(rules);

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
            }
        });
        test.done();
    },

    testRuleListGetRulesOneRule: test => {
        test.expect(3);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1988",
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"

            }),
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1988",
                month: 10,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            })
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const rules = rl.getRules();
        test.ok(rules);

        test.equal(rules.length, 1);

        test.deepEqual(rules[0], {
            name: "StJohns",
            from: "1987",
            fromDate: Date.UTC(1987, 0, 1),
            to: "1988",
            toDate: Date.UTC(1988, 11, 31, 23, 59, 59),
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

    testRuleListGetRulesMultipleStarts: test => {
        test.expect(4);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1988",
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"

            }),
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "2006",
                month: 10,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "StJohns",
                from: "1989",
                to: "2006",
                month: 4,
                rule: "f0",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const rules = rl.getRules();
        test.ok(rules);

        test.equal(rules.length, 2);

        test.deepEqual(rules[0], {
            name: "StJohns",
            from: "1987",
            fromDate: Date.UTC(1987, 0, 1),
            to: "1988",
            toDate: Date.UTC(1988, 11, 31, 23, 59, 59),
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
        test.deepEqual(rules[1], {
            name: "StJohns",
            from: "1989",
            fromDate: Date.UTC(1989, 0, 1),
            to: "2006",
            toDate: Date.UTC(2006, 11, 31, 23, 59, 59),
            start: {
                month: 4,
                rule: "f0",
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

    testRuleListGetRulesMultipleEnds: test => {
        test.expect(4);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "2006",
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1988",
                month: 10,
                rule: "l0",
                time: "1:00",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "StJohns",
                from: "1989",
                to: "2006",
                month: 11,
                rule: "f0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            })
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const rules = rl.getRules();
        test.ok(rules);

        test.equal(rules.length, 2);

        test.deepEqual(rules[0], {
            name: "StJohns",
            from: "1987",
            fromDate: Date.UTC(1987, 0, 1),
            to: "1988",
            toDate: Date.UTC(1988, 11, 31, 23, 59, 59),
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
                time: "1:00",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S",
                timeInMinutes: 60,
                savingsInMinutes: 0
            }
        });
        test.deepEqual(rules[1], {
            name: "StJohns",
            from: "1989",
            fromDate: Date.UTC(1989, 0, 1),
            to: "2006",
            toDate: Date.UTC(2006, 11, 31, 23, 59, 59),
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
                month: 11,
                rule: "f0",
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

    testRuleListGetRulesOverlappingStartsAndEnds: test => {
        test.expect(5);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1994",
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1990",
                month: 10,
                rule: "l0",
                time: "1:00",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "StJohns",
                from: "1995",
                to: "2006",
                month: 4,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "1991",
                to: "2006",
                month: 11,
                rule: "f0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            })
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const rules = rl.getRules();
        test.ok(rules);

        test.equal(rules.length, 3);

        test.deepEqual(rules[0], {
            name: "StJohns",
            from: "1987",
            fromDate: Date.UTC(1987, 0, 1),
            to: "1990",
            toDate: Date.UTC(1990, 11, 31, 23, 59, 59),
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
                time: "1:00",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S",
                timeInMinutes: 60,
                savingsInMinutes: 0
            }
        });
        test.deepEqual(rules[1], {
            name: "StJohns",
            from: "1991",
            fromDate: Date.UTC(1991, 0, 1),
            to: "1994",
            toDate: Date.UTC(1994, 11, 31, 23, 59, 59),
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
                month: 11,
                rule: "f0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S",
                timeInMinutes: 1,
                savingsInMinutes: 0
            }
        });
        test.deepEqual(rules[2], {
            name: "StJohns",
            from: "1995",
            fromDate: Date.UTC(1995, 0, 1),
            to: "2006",
            toDate: Date.UTC(2006, 11, 31, 23, 59, 59),
            start: {
                month: 4,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D",
                timeInMinutes: 1,
                savingsInMinutes: 60
            },
            end: {
                month: 11,
                rule: "f0",
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

    testRuleListGetRulesOrphanStart: test => {
        test.expect(4);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "2007",
                to: "2011",
                month: 3,
                rule: "0>=8",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "2007",
                to: "2010",
                month: 11,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            })
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const rules = rl.getRules();
        test.ok(rules);

        test.equal(rules.length, 2);

        test.deepEqual(rules[0], {
            name: "StJohns",
            from: "2007",
            fromDate: Date.UTC(2007, 0, 1),
            to: "2010",
            toDate: Date.UTC(2010, 11, 31, 23, 59, 59),
            start: {
                month: 3,
                rule: "0>=8",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D",
                timeInMinutes: 1,
                savingsInMinutes: 60
            },
            end: {
                month: 11,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S",
                timeInMinutes: 1,
                savingsInMinutes: 0
            }
        });
        test.deepEqual(rules[1], {
            name: "StJohns",
            from: "2011",
            fromDate: Date.UTC(2011, 0, 1),
            to: "2011",
            toDate: Date.UTC(2011, 11, 31, 23, 59, 59),
            start: {
                month: 3,
                rule: "0>=8",
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

    testRuleListGetRulesOrphanEnd: test => {
        test.expect(4);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "2007",
                to: "2010",
                month: 3,
                rule: "0>=8",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "2007",
                to: "2011",
                month: 11,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            })
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const rules = rl.getRules();
        test.ok(rules);

        test.equal(rules.length, 2);

        test.deepEqual(rules[0], {
            name: "StJohns",
            from: "2007",
            fromDate: Date.UTC(2007, 0, 1),
            to: "2010",
            toDate: Date.UTC(2010, 11, 31, 23, 59, 59),
            start: {
                month: 3,
                rule: "0>=8",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D",
                timeInMinutes: 1,
                savingsInMinutes: 60
            },
            end: {
                month: 11,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S",
                timeInMinutes: 1,
                savingsInMinutes: 0
            }
        });
        test.deepEqual(rules[1], {
            name: "StJohns",
            from: "2011",
            fromDate: Date.UTC(2011, 0, 1),
            to: "2011",
            toDate: Date.UTC(2011, 11, 31, 23, 59, 59),
            end: {
                month: 11,
                rule: "0>=1",
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

    testRuleListGetRulesComplexRules: test => {
        test.expect(7);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1988",
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"

            }),
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "2006",
                month: 10,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "StJohns",
                from: "1988",
                to: "1989",
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "2:00",
                abbreviation: "DD"
            }),
            new Transition({
                name: "StJohns",
                from: "1989",
                to: "2006",
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "2007",
                to: "2011",
                month: 3,
                rule: "0>=8",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "2007",
                to: "2010",
                month: 11,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            })
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const rules = rl.getRules();
        test.ok(rules);

        test.equal(rules.length, 5);

        test.deepEqual(rules[0], {
            name: "StJohns",
            from: "1987",
            fromDate: Date.UTC(1987, 0, 1),
            to: "1988",
            toDate: Date.UTC(1988, 11, 31, 23, 59, 59),
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
        test.deepEqual(rules[1], {
            name: "StJohns",
            from: "1988",
            fromDate: Date.UTC(1988, 0, 1),
            to: "1989",
            toDate: Date.UTC(1989, 11, 31, 23, 59, 59),
            start: {
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "2:00",
                abbreviation: "DD",
                timeInMinutes: 1,
                savingsInMinutes: 120
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
        test.deepEqual(rules[2], {
            name: "StJohns",
            from: "1989",
            fromDate: Date.UTC(1989, 0, 1),
            to: "2006",
            toDate: Date.UTC(2006, 11, 31, 23, 59, 59),
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
        test.deepEqual(rules[3], {
            name: "StJohns",
            from: "2007",
            fromDate: Date.UTC(2007, 0, 1),
            to: "2010",
            toDate: Date.UTC(2010, 11, 31, 23, 59, 59),
            start: {
                month: 3,
                rule: "0>=8",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D",
                timeInMinutes: 1,
                savingsInMinutes: 60
            },
            end: {
                month: 11,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S",
                timeInMinutes: 1,
                savingsInMinutes: 0
            }
        });
        test.deepEqual(rules[4], {
            name: "StJohns",
            from: "2011",
            fromDate: Date.UTC(2011, 0, 1),
            to: "2011",
            toDate: Date.UTC(2011, 11, 31, 23, 59, 59),
            start: {
                month: 3,
                rule: "0>=8",
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

    testRuleListGetRulesWithGaps: test => {
        test.expect(4);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1990",
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1990",
                month: 10,
                rule: "l0",
                time: "1:00",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "StJohns",
                from: "1995",
                to: "2006",
                month: 4,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "1995",
                to: "2006",
                month: 11,
                rule: "f0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            })
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const rules = rl.getRules();
        test.ok(rules);

        test.equal(rules.length, 2);

        test.deepEqual(rules[0], {
            name: "StJohns",
            from: "1987",
            fromDate: Date.UTC(1987, 0, 1),
            to: "1990",
            toDate: Date.UTC(1990, 11, 31, 23, 59, 59),
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
                time: "1:00",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S",
                timeInMinutes: 60,
                savingsInMinutes: 0
            }
        });
        test.deepEqual(rules[1], {
            name: "StJohns",
            from: "1995",
            fromDate: Date.UTC(1995, 0, 1),
            to: "2006",
            toDate: Date.UTC(2006, 11, 31, 23, 59, 59),
            start: {
                month: 4,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D",
                timeInMinutes: 1,
                savingsInMinutes: 60
            },
            end: {
                month: 11,
                rule: "f0",
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

    testRuleListGetRulesSouthernHemisphere: test => {
        test.expect(6);

        const transitions = [
            new Transition({
                name: "NZ",
                from: "1974",
                to: "1974",
                month: 11,
                rule: "0>=1",
                time: "2:00",
                zoneChar: "s",
                savings: "1:00",
                abbreviation: "D"

            }),
            new Transition({
                name: "NZ",
                from: "1975",
                to: "1975",
                month: 2,
                rule: "l0",
                time: "2:00",
                zoneChar: "s",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "NZ",
                from: "1975",
                to: "1988",
                month: 10,
                rule: "l0",
                time: "2:00",
                zoneChar: "s",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "NZ",
                from: "1976",
                to: "1989",
                month: 3,
                rule: "0>=1",
                time: "2:00",
                zoneChar: "s",
                savings: "0",
                abbreviation: "S"
            })
        ];

        const rl = new RuleList("NZ");
        rl.addTransitions(transitions);

        const rules = rl.getRules();
        test.ok(rules);

        test.equal(rules.length, 4);

        test.deepEqual(rules[0], {
            name: "NZ",
            from: "1974",
            fromDate: Date.UTC(1974, 0, 1),
            to: "1974",
            toDate: Date.UTC(1974, 11, 31, 23, 59, 59),
            start: {
                month: 11,
                rule: "0>=1",
                time: "2:00",
                zoneChar: "s",
                savings: "1:00",
                abbreviation: "D",
                timeInMinutes: 120,
                savingsInMinutes: 60
            }
        });
        test.deepEqual(rules[1], {
            name: "NZ",
            from: "1975",
            fromDate: Date.UTC(1975, 0, 1),
            to: "1975",
            toDate: Date.UTC(1975, 11, 31, 23, 59, 59),
            start: {
                month: 10,
                rule: "l0",
                time: "2:00",
                zoneChar: "s",
                savings: "1:00",
                abbreviation: "D",
                timeInMinutes: 120,
                savingsInMinutes: 60
            },
            end: {
                month: 2,
                rule: "l0",
                time: "2:00",
                zoneChar: "s",
                savings: "0",
                abbreviation: "S",
                timeInMinutes: 120,
                savingsInMinutes: 0
            }
        });
        test.deepEqual(rules[2], {
            name: "NZ",
            from: "1976",
            fromDate: Date.UTC(1976, 0, 1),
            to: "1988",
            toDate: Date.UTC(1988, 11, 31, 23, 59, 59),
            start: {
                month: 10,
                rule: "l0",
                time: "2:00",
                zoneChar: "s",
                savings: "1:00",
                abbreviation: "D",
                timeInMinutes: 120,
                savingsInMinutes: 60
            },
            end: {
                month: 3,
                rule: "0>=1",
                time: "2:00",
                zoneChar: "s",
                savings: "0",
                abbreviation: "S",
                timeInMinutes: 120,
                savingsInMinutes: 0
            }
        });
        test.deepEqual(rules[3], {
            name: "NZ",
            from: "1989",
            fromDate: Date.UTC(1989, 0, 1),
            to: "1989",
            toDate: Date.UTC(1989, 11, 31, 23, 59, 59),
            end: {
                month: 3,
                rule: "0>=1",
                time: "2:00",
                zoneChar: "s",
                savings: "0",
                abbreviation: "S",
                timeInMinutes: 120,
                savingsInMinutes: 0
            }
        });

        test.done();
    },

    testRuleListGetApplicableRulesWithin: test => {
        test.expect(1);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1990",
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1990",
                month: 10,
                rule: "l0",
                time: "1:00",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "StJohns",
                from: "1995",
                to: "2006",
                month: 4,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "1995",
                to: "2006",
                month: 11,
                rule: "f0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            })
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const start = DateFactory({year: 1988, month: 2, day: 2});
        const end = DateFactory({year: 1989, month: 0, day: 1});
        const applicable = rl.getApplicableRules(start.getTimeExtended(), end.getTimeExtended());

        test.deepEqual(applicable, [0]);

        test.done();
    },

    testRuleListGetApplicableRulesStartingBefore: test => {
        test.expect(1);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1990",
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1990",
                month: 10,
                rule: "l0",
                time: "1:00",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "StJohns",
                from: "1995",
                to: "2006",
                month: 4,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "1995",
                to: "2006",
                month: 11,
                rule: "f0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            })
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const start = DateFactory({year: 1986, month: 2, day: 2});
        const end = DateFactory({year: 1989, month: 0, day: 1});
        const applicable = rl.getApplicableRules(start.getTimeExtended(), end.getTimeExtended());

        test.deepEqual(applicable, [0]);

        test.done();
    },

    testRuleListGetApplicableRulesEndAfter: test => {
        test.expect(1);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1990",
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1990",
                month: 10,
                rule: "l0",
                time: "1:00",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "StJohns",
                from: "1995",
                to: "2006",
                month: 4,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "1995",
                to: "2006",
                month: 11,
                rule: "f0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            })
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const start = DateFactory({year: 1988, month: 2, day: 2});
        const end = DateFactory({year: 1991, month: 0, day: 1});
        const applicable = rl.getApplicableRules(start.getTimeExtended(), end.getTimeExtended());

        test.deepEqual(applicable, [0]);

        test.done();
    },

    testRuleListGetApplicableRulesMultiple: test => {
        test.expect(1);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1990",
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "1987",
                to: "1990",
                month: 10,
                rule: "l0",
                time: "1:00",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "StJohns",
                from: "1995",
                to: "2006",
                month: 4,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "1995",
                to: "2006",
                month: 11,
                rule: "f0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            })
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const start = DateFactory({year: 1988, month: 2, day: 2});
        const end = DateFactory({year: 2006, month: 0, day: 1});
        const applicable = rl.getApplicableRules(start.getTimeExtended(), end.getTimeExtended());

        test.deepEqual(applicable, [0, 1]);

        test.done();
    }
};
