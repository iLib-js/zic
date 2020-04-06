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

    testConstructorSimple: test => {
        test.expect(6);

        const rs = new Transition({
            name: "StJohns",
            from: 1987,
            to: 1987,
            month: 4,
            rule: "0>=1",
            time: "0:01",
            zoneChar: "w",
            savings: "1:00",
            abbreviation: "D"

        });
        const re = new Transition({
            name: "StJohns",
            from: 1987,
            to: 1987,
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

    testConstructorSimpleRightAmounts: test => {
        test.expect(8);

        const rs = new Transition({
            name: "StJohns",
            from: 1987,
            to: 1987,
            month: 4,
            rule: "0>=1",
            time: "0:01",
            zoneChar: "w",
            savings: "1:00",
            abbreviation: "D"

        });
        const re = new Transition({
            name: "StJohns",
            from: 1987,
            to: 1987,
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

    testConstructorOneRule: test => {
        test.expect(5);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: 1987,
                to: 1987,
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"

            }),
            new Transition({
                name: "StJohns",
                from: 1987,
                to: 1987,
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
            from: 1987,
            to: 1987,
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

    testConstructorRuleMultipleStarts: test => {
        test.expect(6);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: 1987,
                to: 1987,
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"

            }),
            new Transition({
                name: "StJohns",
                from: 1987,
                to: 2006,
                month: 10,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "StJohns",
                from: 1988,
                to: 2006,
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
            from: 1987,
            to: 1987,
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
            from: 1988,
            to: 2006,
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

    testConstructorRuleMultipleEnds: test => {
        test.expect(6);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: 1987,
                to: 2006,
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: 1987,
                to: 1987,
                month: 10,
                rule: "l0",
                time: "1:00",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "StJohns",
                from: 1988,
                to: 2006,
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
            from: 1987,
            to: 1987,
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
            from: 1988,
            to: 2006,
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

    testConstructorRuleOverlappingStartsAndEnds: test => {
        test.expect(7);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: 1987,
                to: 1994,
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: 1987,
                to: 1990,
                month: 10,
                rule: "l0",
                time: "1:00",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "StJohns",
                from: 1995,
                to: 2006,
                month: 4,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: 1991,
                to: 2006,
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
            from: 1987,
            to: 1990,
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
            from: 1991,
            to: 1994,
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
            from: 1995,
            to: 2006,
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

    testConstructorOrphanStart: test => {
        test.expect(6);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: 2007,
                to: 2011,
                month: 3,
                rule: "0>=8",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: 2007,
                to: 2010,
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
            from: 2007,
            to: 2010,
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
            from: 2011,
            to: 2011,
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

    testConstructorOrphanEnd: test => {
        test.expect(6);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: 2007,
                to: 2010,
                month: 3,
                rule: "0>=8",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: 2007,
                to: 2011,
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
            from: 2007,
            to: 2010,
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
            from: 2011,
            to: 2011,
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

    testConstructorComplexRules: test => {
        test.expect(9);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: 1987,
                to: 1987,
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"

            }),
            new Transition({
                name: "StJohns",
                from: 1987,
                to: 2006,
                month: 10,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
            new Transition({
                name: "StJohns",
                from: 1988,
                to: 1988,
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "2:00",
                abbreviation: "DD"
            }),
            new Transition({
                name: "StJohns",
                from: 1989,
                to: 2006,
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: 2007,
                to: 2011,
                month: 3,
                rule: "0>=8",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            }),
            new Transition({
                name: "StJohns",
                from: 2007,
                to: 2010,
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
            from: 1987,
            to: 1987,
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
            from: 1988,
            to: 1988,
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
            from: 1989,
            to: 2006,
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
            from: 2007,
            to: 2010,
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
            from: 2011,
            to: 2011,
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

};
