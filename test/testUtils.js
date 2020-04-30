/*
 * testUtils.js - test the utils functions
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

import { parseDate, lastSecond } from '../src/utils';

module.exports.testutils = {
    testParseDateYearOnly: test => {
        test.expect(2);
        var d = parseDate("1994");
        var expected = Date.UTC(1994, 0, 1, 0, 0, 0)
        test.equal(d.getTime(), expected);
        test.equal(d.getTimeZone(), "Etc/UTC");
        test.done();
    },

    testParseDateYearMonth: test => {
        test.expect(1);
        var d = parseDate("1994 Oct");
        var expected = Date.UTC(1994, 9, 1, 0, 0, 0)
        test.equal(d.getTime(), expected);
        test.done();
    },

    testParseDateYearMonthDay: test => {
        test.expect(1);
        var d = parseDate("1994 Oct 12");
        var expected = Date.UTC(1994, 9, 12, 0, 0, 0)
        test.equal(d.getTime(), expected);
        test.done();
    },

    testParseDateYearMonthDayHours: test => {
        test.expect(1);
        var d = parseDate("1994 Oct 12 2:00");
        var expected = Date.UTC(1994, 9, 12, 2, 0, 0)
        test.equal(d.getTime(), expected);
        test.done();
    },

    testParseDateYearMonthDayHoursMinutes: test => {
        test.expect(1);
        var d = parseDate("1994 Oct 12 2:15");
        var expected = Date.UTC(1994, 9, 12, 2, 15, 0)
        test.equal(d.getTime(), expected);
        test.done();
    },

    testParseDateExtraSpaces: test => {
        test.expect(1);
        var d = parseDate("1994    Oct    12   2:15");
        var expected = Date.UTC(1994, 9, 12, 2, 15, 0)
        test.equal(d.getTime(), expected);
        test.done();
    },

    testParseDateTrimWhiteSpace: test => {
        test.expect(1);
        var d = parseDate("  1994    Oct    12   2:15 ");
        var expected = Date.UTC(1994, 9, 12, 2, 15, 0)
        test.equal(d.getTime(), expected);
        test.done();
    },

    testParseDateExtraWhiteSpace: test => {
        test.expect(1);
        var d = parseDate("1994 \t\r  Oct \t   12 \n  2:15");
        var expected = Date.UTC(1994, 9, 12, 2, 15, 0)
        test.equal(d.getTime(), expected);
        test.done();
    },

    testParseDateUndefined: test => {
        test.expect(1);
        var d = parseDate(undefined);
        test.ok(!d);
        test.done();
    },

    testParseDateNull: test => {
        test.expect(1);
        var d = parseDate(null);
        test.ok(!d);
        test.done();
    },

    testParseDateBoolean: test => {
        test.expect(1);
        var d = parseDate(true);
        test.ok(!d);
        test.done();
    },

    testParseDateFunction: test => {
        test.expect(1);
        var d = parseDate(function(foo) { console.log(foo); });
        test.ok(!d);
        test.done();
    },

    testParseDateArray: test => {
        test.expect(1);
        var d = parseDate(["1994", "Oct"]);
        test.ok(!d);
        test.done();
    },

    testParseDateMax: test => {
        test.expect(1);
        // max date is 100M days since Jan 1, 1970
        var d = parseDate("max");
        test.equal(d.getTimeExtended(), 8640000000000000);
        test.done();
    },

    testParseDatePresent: test => {
        test.expect(1);
        // treat present the same as max date
        var d = parseDate("present");
        test.ok(Date.now() - d.getTimeExtended() < 1000);
        test.done();
    },

    testLastSecondYearOnly: test => {
        test.expect(1);
        test.equal(lastSecond("1994"), Date.UTC(1994, 11, 31, 23, 59, 59));
        test.done();
    },

    testLastSecondYearMonth: test => {
        test.expect(1);
        test.equal(lastSecond("1994 Oct"), Date.UTC(1994, 9, 31, 23, 59, 59));
        test.done();
    },

    testLastSecondYearMonthDay: test => {
        test.expect(1);
        test.equal(lastSecond("1994 Oct 26"), Date.UTC(1994, 9, 26, 23, 59, 59));
        test.done();
    },

    testLastSecondYearMonthDayTime: test => {
        test.expect(1);
        test.equal(lastSecond("1994 Oct 26 2:00"), Date.UTC(1994, 9, 26, 1, 59, 59));
        test.done();
    },

    testLastSecondYearMonthDayTime2: test => {
        test.expect(1);
        test.equal(lastSecond("1994 Oct 26 2:30"), Date.UTC(1994, 9, 26, 2, 29, 59));
        test.done();
    },

    testLastSecondYearMonthDayFullTime: test => {
        test.expect(1);
        test.equal(lastSecond("1994 Oct 26 2:30:30"), Date.UTC(1994, 9, 26, 2, 30, 29));
        test.done();
    },
    
    testLastSecondYearMonthLeapYear: test => {
        test.expect(1);
        // leap year
        test.equal(lastSecond("1992 Feb"), Date.UTC(1992, 1, 29, 23, 59, 59));
        test.done();
    },

    testLastSecondYearMonthNonLeapYear: test => {
        test.expect(1);
        // not a leap year
        test.equal(lastSecond("1991 Feb"), Date.UTC(1991, 1, 28, 23, 59, 59));
        test.done();
    },
    
    testLastSecondMax: test => {
        test.expect(1);
        // max date is 100M days since Jan 1, 1970
        test.equal(lastSecond("max"), 8640000000000000);
        test.done();
    },

    testLastSecondPresent: test => {
        test.expect(1);
        // treat present the same as max date
        test.ok(Date.now() - lastSecond("present") < 1000);
        test.done();
    }

};
