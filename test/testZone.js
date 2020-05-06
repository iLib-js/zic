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
        test.equal(z.format, "L{s}T");
        test.equal(z.from, "1884");
        test.equal(z.fromDate, Date.UTC(1884, 0, 1, 0, 0, 0));
        test.equal(z.to, "1940");
        test.equal(z.toDate, Date.UTC(1939, 11, 31, 23, 59, 59));
        test.done();
    },
};
