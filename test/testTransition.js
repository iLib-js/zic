/*
 * testTransition.js - test the transition object
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

function split(line) {
    const cleanLine = line.replace(/#.*$/g, "");
    return cleanLine.split(/\s+/g);
}

module.exports.testtransition = {
    testConstructorSimple: test => {
        test.expect(9);
        const fields = split("Rule    Chile   1991    1996    -       Mar     Sun>=9  3:00u   0       -");
        const t = new Transition(fields);
        test.ok(typeof(t) !== "undefined");

        test.equal(t.from, "1991");
        test.equal(t.to, "1996");
        test.equal(t.month, "3");
        test.equal(t.rule, "0>=9");
        test.equal(t.time, "3:00");
        test.equal(t.zoneChar, "u");
        test.equal(t.savings, "0");
        test.equal(t.abbreviation, "");
        test.done();
    },

    testConstructorOneYearOnly: test => {
        test.expect(9);
        const fields = split("Rule    Chile   1991    only    -       Mar     Sun>=9  3:00u   0       -");
        const t = new Transition(fields);
        test.ok(typeof(t) !== "undefined");

        test.equal(t.from, "1991");
        test.equal(t.to, "1991");
        test.equal(t.month, "3");
        test.equal(t.rule, "0>=9");
        test.equal(t.time, "3:00");
        test.equal(t.zoneChar, "u");
        test.equal(t.savings, "0");
        test.equal(t.abbreviation, "");
        test.done();
    },

    testConstructorOtherDaysOfTheWeek: test => {
        test.expect(9);
        const fields = split("Rule    Chile   1991    1996    -       Mar     Fri>=9  3:00u   0       -");
        const t = new Transition(fields);
        test.ok(typeof(t) !== "undefined");

        test.equal(t.from, "1991");
        test.equal(t.to, "1996");
        test.equal(t.month, "3");
        test.equal(t.rule, "5>=9");
        test.equal(t.time, "3:00");
        test.equal(t.zoneChar, "u");
        test.equal(t.savings, "0");
        test.equal(t.abbreviation, "");
        test.done();
    },

    testConstructorAlternateZoneChar: test => {
        test.expect(9);
        const fields = split("Rule    Chile   1991    1996    -       Mar     8     3:00w   0       -");
        const t = new Transition(fields);
        test.ok(typeof(t) !== "undefined");

        test.equal(t.from, "1991");
        test.equal(t.to, "1996");
        test.equal(t.month, "3");
        test.equal(t.rule, "8");
        test.equal(t.time, "3:00");
        test.equal(t.zoneChar, "w");
        test.equal(t.savings, "0");
        test.equal(t.abbreviation, "");
        test.done();
    },

    testConstructorAlternateZoneChar2: test => {
        test.expect(9);
        const fields = split("Rule    Chile   1991    1996    -       Mar     Sun>=9  3:00s   0       S");
        const t = new Transition(fields);
        test.ok(typeof(t) !== "undefined");

        test.equal(t.from, "1991");
        test.equal(t.to, "1996");
        test.equal(t.month, "3");
        test.equal(t.rule, "0>=9");
        test.equal(t.time, "3:00");
        test.equal(t.zoneChar, "s");
        test.equal(t.savings, "0");
        test.equal(t.abbreviation, "S");
        test.done();
    },

    testConstructorNoZoneChar: test => {
        test.expect(9);
        const fields = split("Rule    Chile   1991    1996    -       Mar     Sun>=9  3:00   0       -");
        const t = new Transition(fields);
        test.ok(typeof(t) !== "undefined");

        test.equal(t.from, "1991");
        test.equal(t.to, "1996");
        test.equal(t.month, "3");
        test.equal(t.rule, "0>=9");
        test.equal(t.time, "3:00");
        test.equal(t.zoneChar, "w");
        test.equal(t.savings, "0");
        test.equal(t.abbreviation, "");
        test.done();
    },

    testConstructorDifferentSavings: test => {
        test.expect(9);
        const fields = split("Rule    Chile   1991    1996    -       Mar     Sun>=9  3:00u   2:00       -");
        const t = new Transition(fields);
        test.ok(typeof(t) !== "undefined");

        test.equal(t.from, "1991");
        test.equal(t.to, "1996");
        test.equal(t.month, "3");
        test.equal(t.rule, "0>=9");
        test.equal(t.time, "3:00");
        test.equal(t.zoneChar, "u");
        test.equal(t.savings, "2:00");
        test.equal(t.abbreviation, "");
        test.done();
    },

    testConstructorLast: test => {
        test.expect(9);
        const fields = split("Rule    Chile   1991    1996    -       Mar     lastSun  3:00u   0       -");
        const t = new Transition(fields);
        test.ok(typeof(t) !== "undefined");

        test.equal(t.from, "1991");
        test.equal(t.to, "1996");
        test.equal(t.month, "3");
        test.equal(t.rule, "l0");
        test.equal(t.time, "3:00");
        test.equal(t.zoneChar, "u");
        test.equal(t.savings, "0");
        test.equal(t.abbreviation, "");
        test.done();
    },

    testConstructorFirst: test => {
        test.expect(9);
        const fields = split("Rule    Chile   1991    1996    -       Mar     firstMon  3:00u   0       -");
        const t = new Transition(fields);
        test.ok(typeof(t) !== "undefined");

        test.equal(t.from, "1991");
        test.equal(t.to, "1996");
        test.equal(t.month, "3");
        test.equal(t.rule, "f1");
        test.equal(t.time, "3:00");
        test.equal(t.zoneChar, "u");
        test.equal(t.savings, "0");
        test.equal(t.abbreviation, "");
        test.done();
    },

    testConstructorStartLate: test => {
        test.expect(9);
        const fields = split("Rule    Chile   1991    1996    -       Mar     Sun>=9  23:00   0       -");
        const t = new Transition(fields);
        test.ok(typeof(t) !== "undefined");

        test.equal(t.from, "1991");
        test.equal(t.to, "1996");
        test.equal(t.month, "3");
        test.equal(t.rule, "0>=9");
        test.equal(t.time, "23:00");
        test.equal(t.zoneChar, "w");
        test.equal(t.savings, "0");
        test.equal(t.abbreviation, "");
        test.done();
    }
};
