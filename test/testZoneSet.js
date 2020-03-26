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
};
