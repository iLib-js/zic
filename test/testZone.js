/*
 * testZone.js - test the zone object
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

import RawZone from '../src/RawZone';
import Transition from '../src/Transition';
import RuleList from '../src/RuleList';
import Zone from '../src/Zone';

module.exports.testzone = {
    testConstructorSimple: test => {
        test.expect(7);
        const z = new Zone("America/St_Johns", {
            offset: "-3:30",
            format: "L%sT",
            to: "1940",
            toDate: Date.parse("1940") - 1000
        }, {
            to: "1884",
            toDate: Date.parse("1884") - 1000
        });
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "-3:30");
        test.equal(z.format, "L%sT");
        test.equal(z.from, "1884");
        test.equal(z.fromDate, Date.UTC(1884, 0, 1, 0, 0, 0));
        test.equal(z.to, "1940");
        test.equal(z.toDate, Date.UTC(1939, 11, 31, 23, 59, 59));
        test.done();
    },

    testZoneToJsonSimpleNoRule: test => {
        test.expect(2);
        const z = new Zone("America/St_Johns", {
            offset: "-3:30",
            format: "L%sT",
            to: "1940",
            toDate: Date.parse("1940") - 1000
        }, {
            to: "1884",
            toDate: Date.parse("1884") - 1000
        });
        test.ok(typeof(z) !== "undefined");

        const expected = [{
            from: "1884",
            to: "1940",
            offset: "-3:30",
            abbreviation: "L%sT",
            rule: '-'
        }];
        test.deepEqual(z.toJson(), expected);
        test.done();
    },

    testZoneToJsonSimpleNoRuleWithPresent: test => {
        test.expect(2);
        const z = new Zone("America/St_Johns", {
            offset: "-3:30",
            format: "L%sT",
            to: "present",
            toDate: Date.parse("1940") - 1000
        }, {
            to: "1884",
            toDate: Date.parse("1884") - 1000
        });
        test.ok(typeof(z) !== "undefined");

        const expected = [{
            from: "1884",
            to: "present",
            offset: "-3:30",
            abbreviation: "L%sT",
            rule: '-'
        }];
        test.deepEqual(z.toJson(), expected);
        test.done();
    },

    testZoneToJsonSimpleWithRule: test => {
        test.expect(3);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "1884",
                to: "1940",
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
                to: "1940",
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

        const z = new Zone("America/St_Johns", {
            offset: "-3:30",
            format: "L%sT",
            to: "1940",
            toDate: Date.parse("1940") - 1000,
            rule: "StJohns"
        }, {
            to: "1884",
            toDate: Date.parse("1884") - 1000
        }, rules);
        test.ok(typeof(z) !== "undefined");

        const expected = [
            {
                from: "1884",
                to: "1940",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "StJohns[0]"
            }
        ];
        test.deepEqual(z.toJson(), expected);
        test.done();
    },

    testZoneToJsonSimpleWithRuleWithPresent: test => {
        test.expect(3);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "1884",
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
                from: "1884",
                to: "present",
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

        const z = new Zone("America/St_Johns", {
            offset: "-3:30",
            format: "L%sT",
            to: "present",
            toDate: Date.parse("1940") - 1000,
            rule: "StJohns"
        }, {
            to: "1884",
            toDate: Date.parse("1884") - 1000
        }, rules);
        test.ok(typeof(z) !== "undefined");

        const expected = [
            {
                from: "1884",
                to: "present",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "StJohns[0]"
            }
        ];
        test.deepEqual(z.toJson(), expected);
        test.done();
    },

    testZoneToJsonWithMultipleRules: test => {
        test.expect(3);

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
                from: "1919",
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
                from: "1919",
                to: "present",
                month: 10,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const rules = rl.getRules();
        test.ok(rules);

        const z = new Zone("America/St_Johns", {
            offset: "-3:30",
            format: "L%sT",
            to: "1940",
            toDate: Date.parse("1940") - 1000,
            rule: "StJohns"
        }, {
            to: "1884",
            toDate: Date.parse("1884") - 1000
        }, rules);
        test.ok(typeof(z) !== "undefined");

        const expected = [
            {
                from: "1884",
                to: "1918",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "StJohns[0]"
            },
            {
                from: "1919",
                to: "1940",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "StJohns[1]"
            }
        ];
        test.deepEqual(z.toJson(), expected);
        test.done();
    },

    testZoneToJsonMultipleRuleWithGap: test => {
        test.expect(3);

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
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const rules = rl.getRules();
        test.ok(rules);

        const z = new Zone("America/St_Johns", {
            offset: "-3:30",
            format: "L%sT",
            to: "1940",
            toDate: Date.parse("1940") - 1000,
            rule: "StJohns"
        }, {
            to: "1884",
            toDate: Date.parse("1884") - 1000
        }, rules);
        test.ok(typeof(z) !== "undefined");

        const expected = [
            {
                from: "1884",
                to: "1918",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "StJohns[0]"
            },
            { // gap!
                from: "1919",
                to: "1920",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "-"   // no rule in this gap interval
            },
            {
                from: "1920",
                to: "1940",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "StJohns[1]"
            }
        ];
        test.deepEqual(z.toJson(), expected);
        test.done();
    },

    testZoneToJsonNoRuleAtBeginning: test => {
        test.expect(3);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "1910",
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
                from: "1910",
                to: "1918",
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

        const z = new Zone("America/St_Johns", {
            offset: "-3:30",
            format: "L%sT",
            to: "1918",
            toDate: Date.parse("1940") - 1000,
            rule: "StJohns"
        }, {
            to: "1884",
            toDate: Date.parse("1884") - 1000
        }, rules);
        test.ok(typeof(z) !== "undefined");

        const expected = [
            { // no rule at the beginning
                from: "1884",
                to: "1909",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "-"
            },
            {
                from: "1910",
                to: "1918",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "StJohns[1]"
            }
        ];
        test.deepEqual(z.toJson(), expected);
        test.done();
    },

    testZoneToJsonNoRuleAtEnd: test => {
        test.expect(3);

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
            })
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const rules = rl.getRules();
        test.ok(rules);

        const z = new Zone("America/St_Johns", {
            offset: "-3:30",
            format: "L%sT",
            to: "1940",
            toDate: Date.parse("1940") - 1000,
            rule: "StJohns"
        }, {
            to: "1884",
            toDate: Date.parse("1884") - 1000
        }, rules);
        test.ok(typeof(z) !== "undefined");

        const expected = [
            {
                from: "1884",
                to: "1918",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "StJohns[0]"
            },
            { // no rule at the end
                from: "1919",
                to: "1940",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "-"   // no rule in this gap interval
            }
        ];
        test.deepEqual(z.toJson(), expected);
        test.done();
    },

    testZoneToJsonNoRuleAtBeginningEndWithGap: test => {
        test.expect(3);

        const transitions = [
            new Transition({
                name: "StJohns",
                from: "1910",
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
                from: "1910",
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
                to: "1940",
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
                to: "1940",
                month: 10,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }),
        ];

        const rl = new RuleList("StJohns");
        rl.addTransitions(transitions);

        const rules = rl.getRules();
        test.ok(rules);

        const z = new Zone("America/St_Johns", {
            offset: "-3:30",
            format: "L%sT",
            to: "present",
            toDate: Date.parse("1940") - 1000,
            rule: "StJohns"
        }, {
            to: "1884",
            toDate: Date.parse("1884") - 1000
        }, rules);
        test.ok(typeof(z) !== "undefined");

        const expected = [
            {
                from: "1884",
                to: "1909",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "-"   // no rule in this interval
            },
            {
                from: "1910",
                to: "1918",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "StJohns[0]"
            },
            { // gap!
                from: "1919",
                to: "1920",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "-"   // no rule in this gap interval
            },
            {
                from: "1920",
                to: "1940",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "StJohns[1]"
            },
            {
                from: "1941",
                to: "present",
                offset: "-3:30",
                abbreviation: "L%sT",
                rule: "-"   // no rule in this interval
            },
        ];
        test.deepEqual(z.toJson(), expected);
        test.done();
    },

};
