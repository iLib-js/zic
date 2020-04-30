/*
 * testZoneSet.js - test the zone set object
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

import ZoneSet from '../src/ZoneSet';
import Transition from '../src/Transition';
import RawZone from '../src/RawZone';

module.exports.testzoneset = {
    testConstructorEmpty: test => {
        test.expect(5);
        const zs = new ZoneSet();
        test.ok(typeof(zs) !== "undefined");

        const rules = zs.getRuleLists();
        test.ok(rules);
        test.equal(Object.keys(rules).length, 0);

        const zones = zs.getZoneLists();
        test.ok(zones);
        test.equal(Object.keys(zones).length, 0);

        test.done();
    },

    testZoneSetGetRulesSimple: test => {
        test.expect(6);

        const rs = new Transition({
            name: "StJohns",
            from: "1987",
            to: "1987",
            month: 4,
            rule: "0>=1",
            time: "0:01",
            zoneChar: "w",
            savings: "1:00",
            abbreviation: "D"

        });
        const re = new Transition({
            name: "StJohns",
            from: "1987",
            to: "1987",
            month: 10,
            rule: "l0",
            time: "0:01",
            zoneChar: "w",
            savings: "0",
            abbreviation: "S"
        });
        test.ok(typeof(rs) !== "undefined");
        test.ok(typeof(re) !== "undefined");

        const z = new RawZone({
            offset: "12:00",
            format: "LMT",
            rule: "Fiji",
            to: "1915"
        });

        test.ok(typeof(z) !== "undefined");

        const zs = new ZoneSet();
        test.ok(typeof(zs) !== "undefined");

        zs.addTransition(rs);
        zs.addTransition(re);
        zs.addRawZone(z);

        const rules = zs.getRuleLists();

        test.equal(Object.keys(rules).length, 1);

        const zones = zs.getZoneLists();

        test.equal(Object.keys(zones).length, 1);

        test.done();
    },

    testZoneSetGetRulesSimpleRightAmounts: test => {
        test.expect(8);

        const rs = new Transition({
            name: "StJohns",
            from: "1987",
            to: "1987",
            month: 4,
            rule: "0>=1",
            time: "0:01",
            zoneChar: "w",
            savings: "1:00",
            abbreviation: "D"

        });
        const re = new Transition({
            name: "StJohns",
            from: "1987",
            to: "1987",
            month: 10,
            rule: "l0",
            time: "0:01",
            zoneChar: "w",
            savings: "0",
            abbreviation: "S"
        });
        test.ok(typeof(rs) !== "undefined");
        test.ok(typeof(re) !== "undefined");

        const z = new RawZone({
            name: "America/St_Johns",
            offset: "12:00",
            format: "LMT",
            rule: "StJohns",
            to: "1915"
        });

        test.ok(typeof(z) !== "undefined");

        const zs = new ZoneSet();
        test.ok(typeof(zs) !== "undefined");

        zs.addTransition(rs);
        zs.addTransition(re);
        zs.addRawZone(z);

        const rules = zs.getRuleLists();

        test.equal(Object.keys(rules).length, 1);

        test.ok(rules["StJohns"]);

        const zones = zs.getZoneLists();

        test.equal(Object.keys(zones).length, 1);

        test.ok(zones["America/St_Johns"]);

        test.done();
    },

    testZoneSetGetRulesOneRule: test => {
        test.expect(5);

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

        const zs = new ZoneSet();
        test.ok(typeof(zs) !== "undefined");

        zs.addTransitions(transitions);

        const ruleLists = zs.getRuleLists();

        test.equal(Object.keys(ruleLists).length, 1);

        const stjohns = ruleLists["StJohns"];
        test.ok(stjohns);

        const rules = stjohns.getRules();

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

    testZoneSetGetRulesMultipleStarts: test => {
        test.expect(6);

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
                to: "2006",
                month: 4,
                rule: "f0",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
        ];

        const zs = new ZoneSet();
        test.ok(typeof(zs) !== "undefined");

        zs.addTransitions(transitions);

        const ruleLists = zs.getRuleLists();

        test.equal(Object.keys(ruleLists).length, 1);

        const stjohns = ruleLists["StJohns"];
        test.ok(stjohns);

        const rules = stjohns.getRules();

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
            from: "1988",
            fromDate: Date.UTC(1988, 0, 1),
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

    testZoneSetGetRulesMultipleEnds: test => {
        test.expect(6);

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
                from: "1988",
                to: "2006",
                month: 11,
                rule: "f0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            })
        ];

        const zs = new ZoneSet();
        test.ok(typeof(zs) !== "undefined");

        zs.addTransitions(transitions);

        const ruleLists = zs.getRuleLists();

        test.equal(Object.keys(ruleLists).length, 1);

        const stjohns = ruleLists["StJohns"];
        test.ok(stjohns);

        const rules = stjohns.getRules();

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
            from: "1988",
            fromDate: Date.UTC(1988, 0, 1),
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

    testZoneSetGetRulesOverlappingStartsAndEnds: test => {
        test.expect(7);

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

        const zs = new ZoneSet();
        test.ok(typeof(zs) !== "undefined");

        zs.addTransitions(transitions);

        const ruleLists = zs.getRuleLists();

        test.equal(Object.keys(ruleLists).length, 1);

        const stjohns = ruleLists["StJohns"];
        test.ok(stjohns);

        const rules = stjohns.getRules();

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

    testZoneSetGetRulesOrphanStart: test => {
        test.expect(6);

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

        const zs = new ZoneSet();
        test.ok(typeof(zs) !== "undefined");

        zs.addTransitions(transitions);

        const ruleLists = zs.getRuleLists();

        test.equal(Object.keys(ruleLists).length, 1);

        const stjohns = ruleLists["StJohns"];
        test.ok(stjohns);

        const rules = stjohns.getRules();

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

    testZoneSetGetRulesOrphanEnd: test => {
        test.expect(6);

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

        const zs = new ZoneSet();
        test.ok(typeof(zs) !== "undefined");

        zs.addTransitions(transitions);

        const ruleLists = zs.getRuleLists();

        test.equal(Object.keys(ruleLists).length, 1);

        const stjohns = ruleLists["StJohns"];
        test.ok(stjohns);

        const rules = stjohns.getRules();

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

    testZoneSetGetRulesComplexRules: test => {
        test.expect(9);

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

        const zs = new ZoneSet();
        test.ok(typeof(zs) !== "undefined");

        zs.addTransitions(transitions);

        const ruleLists = zs.getRuleLists();

        test.equal(Object.keys(ruleLists).length, 1);

        const stjohns = ruleLists["StJohns"];
        test.ok(stjohns);

        const rules = stjohns.getRules();

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

    testZoneSetGetRulesWithGaps: test => {
        test.expect(6);

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

        const zs = new ZoneSet();
        test.ok(typeof(zs) !== "undefined");

        zs.addTransitions(transitions);

        const ruleLists = zs.getRuleLists();

        test.equal(Object.keys(ruleLists).length, 1);

        const stjohns = ruleLists["StJohns"];
        test.ok(stjohns);

        const rules = stjohns.getRules();

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

    testZoneSetGetRulesMultipleRuleLists: test => {
        test.expect(7);

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
                name: "Canada",
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
                name: "Canada",
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

        const zs = new ZoneSet();
        test.ok(typeof(zs) !== "undefined");

        zs.addTransitions(transitions);

        const ruleLists = zs.getRuleLists();

        test.equal(Object.keys(ruleLists).length, 2);

        const stjohns = ruleLists["StJohns"];
        test.ok(stjohns);

        let rules = stjohns.getRules();

        test.equal(rules.length, 1);

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

        const canada = ruleLists["Canada"];
        test.ok(canada);

        rules = canada.getRules();

        test.deepEqual(rules[0], {
            name: "Canada",
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


    testGetZones: test => {
        test.expect(4);

        const rs = new Transition({
            name: "StJohns",
            from: "1987",
            to: "1988",
            month: 4,
            rule: "0>=1",
            time: "0:01",
            zoneChar: "w",
            savings: "1:00",
            abbreviation: "D"

        });
        const re = new Transition({
            name: "StJohns",
            from: "1987",
            to: "1988",
            month: 10,
            rule: "l0",
            time: "0:01",
            zoneChar: "w",
            savings: "0",
            abbreviation: "S"
        });
        test.ok(typeof(rs) !== "undefined");
        test.ok(typeof(re) !== "undefined");

        const rawZones = [
            new RawZone({
                name: "America/St_Johns",
                offset: "-3:30",
                format: "LMT",
                rule: "StJohns",
                to: "1990"
            }),
            new RawZone({
                offset: "-3:30",
                format: "LMT",
                rule: "Canada",
                to: "1986"
            }),
            new RawZone({
                offset: "-3:30",
                format: "N{s}T",
                rule: "Canada"
            })
        ];

        const zs = new ZoneSet();
        test.ok(typeof(zs) !== "undefined");

        zs.addTransition(rs);
        zs.addTransition(re);
        zs.addRawZones(rawZones);

        const zones = zs.getZoneLists();

        test.equal(Object.keys(zones).length, 1);

        test.done();
    },

    testGetZonesRightContent: test => {
        test.expect(42);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "1884",
                to: "1918",
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "1884",
                to: "1918",
                month: 10,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "StJohns",
                from: "1920",
                to: "present",
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: "1920",
                to: "present",
                month: 10,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "Canada",
                from: "1918",
                to: "present",
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "Canada",
                from: "1918",
                to: "present",
                month: 10,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            })
        ];

        const rawZones = [
            new RawZone({
                name: "America/St_Johns",
                offset: "-3:30:52",
                format: "LMT",
                to: "1884"
            }),
            new RawZone({
                offset: "-3:30:52",
                format: "N{s}T",
                rule: "StJohns",
                to: "1918"
            }),
            new RawZone({
                offset: "-3:30:52",
                format: "N{s}T",
                rule: "Canada",
                to: "1919"
            }),
            new RawZone({
                offset: "-3:30",
                format: "N{s}T",
                rule: "StJohns"
            })
        ];

        const zs = new ZoneSet();
        test.ok(typeof(zs) !== "undefined");

        zs.addTransitions(transitions);
        zs.addRawZones(rawZones);

        const zoneLists = zs.getZoneLists();

        const zoneList = zoneLists["America/St_Johns"];
        const zones = zoneList.getZones();

        test.equal(zones[0].name, "America/St_Johns");
        test.equal(zones[0].offset, "-3:30:52");
        test.equal(zones[0].format, "LMT");
        test.ok(!zones[0].getRules());
        test.equal(zones[0].from, "1883"); // time zones were first used in 1883
        test.equal(zones[0].fromDate, Date.UTC(1883,0,1,0,0,0));
        test.equal(zones[0].to, "1884");
        test.equal(zones[0].toDate, Date.UTC(1883,11,31,23,59,59));

        test.equal(zones[1].name, "America/St_Johns");
        test.equal(zones[1].offset, "-3:30:52");
        test.equal(zones[1].format, "N{s}T");
        test.equal(zones[1].from, "1884");
        test.equal(zones[1].fromDate, Date.UTC(1884,0,1,0,0,0));
        test.equal(zones[1].to, "1918");
        test.equal(zones[1].toDate, Date.UTC(1917,11,31,23,59,59));
        test.equal(zones[1].rule, "StJohns");
        let rules = zones[1].getRules();
        test.ok(rules);
        test.equal(rules.length, 1);
        test.equal(rules[0].getName(), "StJohns");

        test.equal(zones[2].name, "America/St_Johns");
        test.equal(zones[2].offset, "-3:30:52");
        test.equal(zones[2].format, "N{s}T");
        test.equal(zones[2].from, "1918");
        test.equal(zones[2].fromDate, Date.UTC(1918,0,1,0,0,0));
        test.equal(zones[2].to, "1919");
        test.equal(zones[2].toDate, Date.UTC(1918,11,31,23,59,59));
        test.equal(zones[2].rule, "Canada");
        rules = zones[2].getRules();
        test.ok(rules);
        test.equal(rules.length, 1);
        test.equal(rules[0].getName(), "Canada");

        test.equal(zones[3].name, "America/St_Johns");
        test.equal(zones[3].offset, "-3:30");
        test.equal(zones[3].format, "N{s}T");
        test.equal(zones[3].from, "1919");
        test.equal(zones[3].fromDate, Date.UTC(1919,0,1,0,0,0));
        test.equal(zones[3].to, "present");
        test.ok(Date.now() - zones[3].toDate < 1000);
        test.equal(zones[3].rule, "StJohns");
        rules = zones[3].getRules();
        test.ok(rules);
        test.equal(rules.length, 1);
        test.equal(rules[0].getName(), "StJohns");

        test.done();
    },
};
