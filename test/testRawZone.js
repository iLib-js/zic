/*
 * testRawZone.js - test the raw zone object
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

function split(line) {
    const cleanLine = line.replace(/#.*$/g, "");
    return cleanLine.split(/\s+/g);
}

module.exports.testrawzone= {
    testConstructorSimple: test => {
        test.expect(6);
        const fields = split("Zone America/St_Johns   -3:30 -      LMT     1884");
        const z = new RawZone(fields);
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "-3:30");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "");
        test.equal(z.to, "1884");
        test.equal(z.toDate, Date.UTC(1883, 11, 31, 23, 59, 59));
        test.done();
    },

    testConstructorOffsetWithSeconds: test => {
        test.expect(5);
        const fields = split("Zone America/St_Johns   -3:30:52 -      LMT     1884");
        const z = new RawZone(fields);
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "-3:30:52");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "");
        test.equal(z.to, "1884");
        test.done();
    },

    testConstructorPositiveOffset: test => {
        test.expect(5);
        const fields = split("Zone    Pacific/Fiji    12:00 -      LMT     1915");
        const z = new RawZone(fields);
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "12:00");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "");
        test.equal(z.to, "1915");
        test.done();
    },

    testConstructorRule: test => {
        test.expect(5);
        const fields = split("Zone    Pacific/Fiji    12:00 Fiji      LMT     1915");
        const z = new RawZone(fields);
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "12:00");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "Fiji");
        test.equal(z.to, "1915");
        test.done();
    },

    testConstructorOffsetWithSeconds: test => {
        test.expect(5);
        const fields = split("Zone    Pacific/Fiji    11:55:44 -      LMT     1915");
        const z = new RawZone(fields);
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "11:55:44");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "");
        test.equal(z.to, "1915");
        test.done();
    },

    testConstructorNoEndDate: test => {
        test.expect(7);
        const fields = split("Zone    Pacific/Fiji    11:55 -      LMT");
        const z = new RawZone(fields);
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "11:55");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "");
        test.equal(z.to, "present");
        test.ok(!z.time);
        test.ok(z.toDate > (new Date()).valueOf() - 1000);

        test.done();
    },

    testConstructorYearMonthEndDate: test => {
        test.expect(7);
        const fields = split("Zone    Pacific/Fiji    11:55 -      LMT     1915 Oct");
        const z = new RawZone(fields);
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "11:55");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "");
        test.equal(z.to, "1915 Oct");
        test.ok(!z.time);
        test.equal(z.toDate, Date.UTC(1915, 9, 31, 23, 59, 59));

        test.done();
    },

    testConstructorFullEndDate: test => {
        test.expect(7);
        const fields = split("Zone    Pacific/Fiji    11:55 -      LMT     1915 Oct 26 ");
        const z = new RawZone(fields);
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "11:55");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "");
        test.equal(z.to, "1915 Oct 26");
        test.ok(!z.time);
        test.equal(z.toDate, Date.UTC(1915, 9, 26, 23, 59, 59));
        test.done();
    },

    testConstructorFullEndDateTime: test => {
        test.expect(7);
        const fields = split("Zone    Pacific/Fiji    11:55 -      LMT     1915 Oct 26   2:00");
        const z = new RawZone(fields);
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "11:55");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "");
        test.equal(z.to, "1915 Oct 26 2:00");
        test.equal(z.time, "2:00");
        test.equal(z.toDate, Date.UTC(1915, 9, 26, 2, 0, 0));
        test.done();
    },

    testConstructorNonLetterFormat: test => {
        test.expect(6);
        const fields = split("Zone    Pacific/Fiji    12:00 Fiji      +12/+13     1915");
        const z = new RawZone(fields);
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "12:00");
        test.equal(z.format, "+12/+13");
        test.equal(z.rule, "Fiji");
        test.equal(z.to, "1915");
        test.equal(z.toDate, Date.UTC(1914, 11, 31, 23, 59, 59));
        test.done();
    },

    testConstructorIgnoreEverythingAfterTheCommentChar: test => {
        test.expect(6);
        const fields = split("Zone    Pacific/Fiji    12:00 Fiji      LMT     1915 # Oct 26");
        const z = new RawZone(fields);
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "12:00");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "Fiji");
        test.equal(z.to, "1915");
        test.equal(z.toDate, Date.UTC(1914, 11, 31, 23, 59, 59));
        test.done();
    },

    testConstructorNoEnd: test => {
        test.expect(5);
        const fields = split("Zone    Pacific/Fiji    12:00 Fiji      +12/+13");
        const z = new RawZone(fields);
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "12:00");
        test.equal(z.format, "+12/+13");
        test.equal(z.rule, "Fiji");
        test.equal(z.to, "present");
        test.done();
    },
};
