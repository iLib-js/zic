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

module.exports.testrawzone= {
    testConstructorSimple: test => {
        test.expect(5);
        const z = new RawZone("RawZone America/St_Johns   -3:30 -      LMT     1884");
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "-3:30");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "");
        test.equal(z.to, "1884");
        test.done();
    },

    testConstructorOffsetWithSeconds: test => {
        test.expect(5);
        const z = new RawZone("RawZone America/St_Johns   -3:30:52 -      LMT     1884");
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "-3:30:52");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "");
        test.equal(z.to, "1884");
        test.done();
    },
    
    testConstructorPositiveOffset: test => {
        test.expect(5);
        const z = new RawZone("RawZone    Pacific/Fiji    12:00 -      LMT     1915");
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "12:00");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "");
        test.equal(z.to, "1915");
        test.done();
    },

    testConstructorRule: test => {
        test.expect(5);
        const z = new RawZone("RawZone    Pacific/Fiji    12:00 Fiji      LMT     1915");
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "12:00");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "Fiji");
        test.equal(z.to, "1915");
        test.done();
    },

    testConstructorOffsetWithSeconds: test => {
        test.expect(5);
        const z = new RawZone("RawZone    Pacific/Fiji    11:55:44 -      LMT     1915");
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "11:55:44");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "");
        test.equal(z.to, "1915");
        test.done();
    },

    testConstructorFullEndDate: test => {
        test.expect(5);
        const z = new RawZone("RawZone    Pacific/Fiji    11:55:44 -      LMT     1915 Oct 26 ");
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "11:55:44");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "");
        test.equal(z.to, "1915 Oct 26");
        test.done();
    },

    testConstructorNonLetterFormat: test => {
        test.expect(5);
        const z = new RawZone("RawZone    Pacific/Fiji    12:00 Fiji      +12/+13     1915");
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "12:00");
        test.equal(z.format, "+12/+13");
        test.equal(z.rule, "Fiji");
        test.equal(z.to, "1915");
        test.done();
    },

    testConstructorIgnoreEverythingAfterTheCommentChar: test => {
        test.expect(5);
        const z = new RawZone("RawZone    Pacific/Fiji    12:00 Fiji      LMT     1915 # Oct 26");
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "12:00");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "Fiji");
        test.equal(z.to, "1915");
        test.done();
    },

    testConstructorNoEnd: test => {
        test.expect(5);
        const z = new RawZone("RawZone    Pacific/Fiji    12:00 Fiji      +12/+13");
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "12:00");
        test.equal(z.format, "+12/+13");
        test.equal(z.rule, "Fiji");
        test.equal(z.to, "present");
        test.done();
    },
};
