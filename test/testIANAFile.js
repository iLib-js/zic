/*
 * testIANAFile.js - test the IANA zone info object
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

import IANAFile from '../src/IANAFile';
import ZoneSet from '../src/ZoneSet';

module.exports.testianafile = {
    testConstructorSimple: test => {
        test.expect(3);

        const contents =
`Rule    Fiji    1998    1999    -       Nov     Sun>=1  2:00    1:00    -
Rule    Fiji    1999    2000    -       Feb     lastSun 3:00    0       -
Rule    Fiji    2009    only    -       Nov     29      2:00    1:00    -
Rule    Fiji    2010    only    -       Mar     lastSun 3:00    0       -
Zone    Pacific/Fiji    11:55:44 -      LMT     1915 Oct 26
                        12:00   Fiji    +12/+13`;
        const z = new IANAFile();
        z.setContents(contents);
        test.ok(typeof(z) !== "undefined");

        const transitions = z.getTransitions();
        test.equal(transitions.length, 4);

        const zones = z.getRawZones();

        test.equal(zones.length, 2);
        test.done();
    },

    testConstructorRightContents: test => {
        test.expect(47);

        const contents =
`Rule    Fiji    1998    1999    -       Nov     Sun>=1  2:00    1:00    -
Rule    Fiji    1999    2000    -       Feb     lastSun 3:00    0       -
Rule    Fiji    2009    only    -       Nov     29      2:00    1:00    -
Rule    Fiji    2010    only    -       Mar     lastSun 3:00    0       -
Zone    Pacific/Fiji    11:55:44 -      LMT     1915 Oct 26
                        12:00   Fiji    +12/+13`;
        const z = new IANAFile();
        z.setContents(contents);
        test.ok(typeof(z) !== "undefined");

        const transitions = z.getTransitions();
        test.equal(transitions.length, 4);

        test.equal(transitions[0].getName(), "Fiji");
        test.equal(transitions[0].from, "1998");
        test.equal(transitions[0].to, "1999");
        test.equal(transitions[0].month, "11");
        test.equal(transitions[0].rule, "0>=1");
        test.equal(transitions[0].time, "2:00");
        test.equal(transitions[0].zoneChar, "w");
        test.equal(transitions[0].savings, "1:00");
        test.equal(transitions[0].abbreviation, "");

        test.equal(transitions[1].getName(), "Fiji");
        test.equal(transitions[1].from, "1999");
        test.equal(transitions[1].to, "2000");
        test.equal(transitions[1].month, "2");
        test.equal(transitions[1].rule, "l0");
        test.equal(transitions[1].time, "3:00");
        test.equal(transitions[1].zoneChar, "w");
        test.equal(transitions[1].savings, "0");
        test.equal(transitions[1].abbreviation, "");

        test.equal(transitions[2].getName(), "Fiji");
        test.equal(transitions[2].from, "2009");
        test.equal(transitions[2].to, "2009");
        test.equal(transitions[2].month, "11");
        test.equal(transitions[2].rule, "29");
        test.equal(transitions[2].time, "2:00");
        test.equal(transitions[2].zoneChar, "w");
        test.equal(transitions[2].savings, "1:00");
        test.equal(transitions[2].abbreviation, "");

        test.equal(transitions[3].getName(), "Fiji");
        test.equal(transitions[3].from, "2010");
        test.equal(transitions[3].to, "2010");
        test.equal(transitions[3].month, "3");
        test.equal(transitions[3].rule, "l0");
        test.equal(transitions[3].time, "3:00");
        test.equal(transitions[3].zoneChar, "w");
        test.equal(transitions[3].savings, "0");
        test.equal(transitions[3].abbreviation, "");

        const zones = z.getRawZones();

        test.equal(zones.length, 2);

        test.equal(zones[0].getName(), "Pacific/Fiji");
        test.equal(zones[0].to, "1915 Oct 26");
        test.equal(zones[0].offset, "11:55:44");
        test.equal(zones[0].format, "LMT");

        test.equal(zones[1].getName(), "Pacific/Fiji");
        test.equal(zones[1].to, "present");
        test.equal(zones[1].offset, "12:00");
        test.equal(zones[1].format, "+12/+13");

        test.done();
    },

    testConstructorIgnoreBlankLines: test => {
        test.expect(3);

        const contents =
`Rule    Fiji    1998    1999    -       Nov     Sun>=1  2:00    1:00    -
Rule    Fiji    1999    2000    -       Feb     lastSun 3:00    0       -
Rule    Fiji    2009    only    -       Nov     29      2:00    1:00    -
Rule    Fiji    2010    only    -       Mar     lastSun 3:00    0       -


Zone    Pacific/Fiji    11:55:44 -      LMT     1915 Oct 26
                        12:00   Fiji    +12/+13`;
        const z = new IANAFile();
        z.setContents(contents);
        test.ok(typeof(z) !== "undefined");

        const transitions = z.getTransitions();
        test.equal(transitions.length, 4);

        const zones = z.getRawZones();

        test.equal(zones.length, 2);
        test.done();
    },

    testConstructorIgnoreComments: test => {
        test.expect(3);

        const contents =
`# Rule  NAME    FROM    TO      TYPE    IN      ON      AT      SAVE    LETTER/S
Rule    Fiji    1998    1999    -       Nov     Sun>=1  2:00    1:00    -
Rule    Fiji    1999    2000    -       Feb     lastSun 3:00    0       -
Rule    Fiji    2009    only    -       Nov     29      2:00    1:00    -
Rule    Fiji    2010    only    -       Mar     lastSun 3:00    0       -
# Zone  NAME            STDOFF  RULES   FORMAT  [UNTIL]
Zone    Pacific/Fiji    11:55:44 -      LMT     1915 Oct 26
                        12:00   Fiji    +12/+13`;
        const z = new IANAFile();
        z.setContents(contents);
        test.ok(typeof(z) !== "undefined");

        const transitions = z.getTransitions();
        test.equal(transitions.length, 4);

        const zones = z.getRawZones();

        test.equal(zones.length, 2);
        test.done();
    },

    testConstructorIgnoreCommentsSameLine: test => {
        test.expect(3);

        const contents =
`# Rule  NAME    FROM    TO      TYPE    IN      ON      AT      SAVE    LETTER/S
Rule    Fiji    1998    1999    -       Nov     Sun>=1  2:00    1:00    -
Rule    Fiji    1999    2000    -       Feb     lastSun 3:00    0       - # This should be ignored
Rule    Fiji    2009    only    -       Nov     29      2:00    1:00    -
Rule    Fiji    2010    only    -       Mar     lastSun 3:00    0       -
# Zone  NAME            STDOFF  RULES   FORMAT  [UNTIL]
Zone    Pacific/Fiji    11:55:44 -      LMT     1915 # Oct 26
                        12:00   Fiji    +12/+13`;
        const z = new IANAFile();
        z.setContents(contents);
        test.ok(typeof(z) !== "undefined");

        const transitions = z.getTransitions();
        test.equal(transitions.length, 4);

        const zones = z.getRawZones();

        test.equal(zones.length, 2);
        test.done();
    },

    testConstructorZoneContinuationDoesNotEndAtComment: test => {
        test.expect(5);

        const contents =
`Rule    Fiji    1998    1999    -       Nov     Sun>=1  2:00    1:00    -
Rule    Fiji    1999    2000    -       Feb     lastSun 3:00    0       -
Rule    Fiji    2009    only    -       Nov     29      2:00    1:00    -
Rule    Fiji    2010    only    -       Mar     lastSun 3:00    0       -


Zone    Pacific/Fiji    11:55:44 -      LMT     1915 Oct 26
# this is a test comment
                        12:00   Fiji    +12/+13
`;
        const z = new IANAFile();
        z.setContents(contents);
        test.ok(typeof(z) !== "undefined");

        const transitions = z.getTransitions();
        test.equal(transitions.length, 4);

        const zones = z.getRawZones();

        test.equal(zones.length, 2);

        test.equal(zones[0].getName(), "Pacific/Fiji");
        test.equal(zones[1].getName(), "Pacific/Fiji");
        test.done();
    },

    testConstructorZoneContinuationEndsAtBlankLine: test => {
        test.expect(3);

        const contents =
`Rule    Fiji    1998    1999    -       Nov     Sun>=1  2:00    1:00    -
Rule    Fiji    1999    2000    -       Feb     lastSun 3:00    0       -
Rule    Fiji    2009    only    -       Nov     29      2:00    1:00    -
Rule    Fiji    2010    only    -       Mar     lastSun 3:00    0       -


Zone    Pacific/Fiji    11:55:44 -      LMT     1915 Oct 26
                        12:00   Fiji    +12/+13

Zone    Pacific/Chatham    10:55:44 -      LMT     1915 Oct 26
                        11:00   Chatham +11/+12
`;
        const z = new IANAFile();
        z.setContents(contents);
        test.ok(typeof(z) !== "undefined");

        const transitions = z.getTransitions();
        test.equal(transitions.length, 4);

        const zones = z.getRawZones();

        test.equal(zones.length, 4);
        test.done();
    },

    testConstructorZoneContinuationEndsAtNewRule: test => {
        test.expect(3);

        const contents =
`Rule    Fiji    1998    1999    -       Nov     Sun>=1  2:00    1:00    -
Rule    Fiji    1999    2000    -       Feb     lastSun 3:00    0       -
Rule    Fiji    2009    only    -       Nov     29      2:00    1:00    -


Zone    Pacific/Fiji    11:55:44 -      LMT     1915 Oct 26
                        12:00   Fiji    +12/+13
Rule    Chatham    2010    only    -       Mar     lastSun 3:00    0       -
Zone    Pacific/Chatham    10:55:44 -      LMT     1915 Oct 26
                        11:00   Chatham +11/+12
`;
        const z = new IANAFile();
        z.setContents(contents);
        test.ok(typeof(z) !== "undefined");

        const transitions = z.getTransitions();
        test.equal(transitions.length, 4);

        const zones = z.getRawZones();

        test.equal(zones.length, 4);
        test.done();
    },

    testConstructorZoneContinuationEndsAtNewZone: test => {
        test.expect(3);

        const contents =
`Rule    Fiji    1998    1999    -       Nov     Sun>=1  2:00    1:00    -
Rule    Fiji    1999    2000    -       Feb     lastSun 3:00    0       -
Rule    Fiji    2009    only    -       Nov     29      2:00    1:00    -
Rule    Chatham    2010    only    -       Mar     lastSun 3:00    0       -

Zone    Pacific/Fiji    11:55:44 -      LMT     1915 Oct 26
                        12:00   Fiji    +12/+13
Zone    Pacific/Chatham    10:55:44 -      LMT     1915 Oct 26
                        11:00   Chatham +11/+12
`;
        const z = new IANAFile();
        z.setContents(contents);
        test.ok(typeof(z) !== "undefined");

        const transitions = z.getTransitions();
        test.equal(transitions.length, 4);

        const zones = z.getRawZones();

        test.equal(zones.length, 4);
        test.done();
    },

    testConstructorLoadFile: test => {
        test.expect(3);

        const z = new IANAFile("./test/testfiles/samplerules");
        test.ok(typeof(z) !== "undefined");

        const transitions = z.getTransitions();
        test.equal(transitions.length, 25);

        const zones = z.getRawZones();

        test.equal(zones.length, 6);
        test.done();
    },

    testConstructorLoadNonexistentFile: test => {
        test.expect(1);

        test.throws(function() {
            new IANAFile("./test/testfiles/nonexistent");
        });

        test.done();
    },

    testConstructorLoadFileRightContents: test => {
        test.expect(36);

        const z = new IANAFile("./test/testfiles/samplerules");
        test.ok(typeof(z) !== "undefined");

        const transitions = z.getTransitions();
        test.equal(transitions.length, 25);

        const rawZones = z.getRawZones();

        test.equal(rawZones.length, 6);
        
        const zs = new ZoneSet();
        test.ok(typeof(zs) !== "undefined");

        zs.addTransitions(transitions);
        zs.addRawZones(rawZones);

        const zoneLists = zs.getZoneLists();

        let zoneList = zoneLists["Pacific/Auckland"];
        let zones = zoneList.getZones();
        
        test.equal(zones.length, 3);

        test.equal(zones[0].name, "Pacific/Auckland");
        test.equal(zones[0].offset, "11:39:04");
        test.equal(zones[0].format, "LMT");
        test.ok(!zones[0].getRules());
        test.equal(zones[0].from, "1883"); // time zones were first used in 1883
        test.equal(zones[0].fromDate, Date.UTC(1883,0,1,0,0,0));
        test.equal(zones[0].to, "1868 Nov 2");
        test.equal(zones[0].toDate, Date.UTC(1868,10,1,23,59,59));

        test.equal(zones[1].name, "Pacific/Auckland");
        test.equal(zones[1].offset, "11:30");
        test.equal(zones[1].format, "NZ{s}T");
        test.equal(zones[1].from, "1868 Nov 2");
        test.equal(zones[1].fromDate, Date.UTC(1868,10,2,0,0,0));
        test.equal(zones[1].to, "1946 Jan 1");
        test.equal(zones[1].toDate, Date.UTC(1945,11,31,23,59,59));
        test.equal(zones[1].rule, "NZ");
        let rules = zones[1].getRules();
        test.ok(rules);
        test.equal(rules.length, 4);
        test.equal(rules[0].getName(), "NZ");

        test.equal(zones[2].name, "Pacific/Auckland");
        test.equal(zones[2].offset, "12:00");
        test.equal(zones[2].format, "NZ{s}T");
        test.equal(zones[2].from, "1946 Jan 1");
        test.equal(zones[2].fromDate, Date.UTC(1946,0,1,0,0,0));
        test.equal(zones[2].to, "present");
        test.ok(Date.now() - zones[2].toDate < 1000);
        test.equal(zones[2].rule, "NZ");
        rules = zones[2].getRules();
        test.ok(rules);
        test.equal(rules.length, 8);
        test.equal(rules[0].getName(), "NZ");

        zoneList = zoneLists["Pacific/Chatham"];
        zones = zoneList.getZones();
        
        test.equal(zones.length, 3);

        test.done();
    },
};
