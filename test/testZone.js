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

module.exports.testzone= {
    testConstructorSimple: test => {
        test.expect(5);
        const z = new Zone({
            offset: "-3:30",
            format: "LMT",
            rule: "",
            to: "1884"
        });
        test.ok(typeof(z) !== "undefined");

        test.equal(z.offset, "-3:30");
        test.equal(z.format, "LMT");
        test.equal(z.rule, "");
        test.equal(z.to, "1884");
        test.done();
    },
};
