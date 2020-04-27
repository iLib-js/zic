/*
 * testRule.js - test the raw zone object
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
import Rule from '../src/Rule';

function split(line) {
    const cleanLine = line.replace(/#.*$/g, "");
    return cleanLine.split(/\s+/g);
}

module.exports.testrule = {
    testConstructorSimple: test => {
        test.expect(1);
        let fields = split("Rule    StJohns 1987    only    -       Apr     Sun>=1  0:01    1:00    D");
        const ts = new Transition(fields);
        fields = split("Rule    StJohns 1987    2006    -       Oct     lastSun 0:01    0       S");
        const te = new Transition(fields);

        const r = new Rule({
            from: 1987,
            to: 1987,
            start: ts,
            end: te
        });

        test.ok(typeof(r) !== "undefined");
        test.done();
    },

    testConstructorRightContents: test => {
        test.expect(1);
        let fields = split("Rule    StJohns 1987    only    -       Apr     Sun>=1  0:01    1:00    D");
        const ts = new Transition(fields);
        fields = split("Rule    StJohns 1987    2006    -       Oct     lastSun 0:01    0       S");
        const te = new Transition(fields);

        const r = new Rule({
            name: ts.getName(),
            from: "1987",
            to: "1987",
            start: ts,
            end: te
        });

        test.contains(r, {
            name: "StJohns",
            from: 1987,
            fromDate: Date.UTC(1987, 0, 1, 0, 0, 0),
            to: 1987,
            toDate: Date.UTC(1987, 11, 31, 23, 59, 59),
            start: {
                month: 4,
                rule: "0>=1",
                time: "0:01",
                zoneChar: "w",
                savings: "1:00",
                abbreviation: "D"
            },
            end: {
                month: 10,
                rule: "l0",
                time: "0:01",
                zoneChar: "w",
                savings: "0",
                abbreviation: "S"
            }
        }, "tester");
        test.done();
    }
};
