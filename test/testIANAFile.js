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
    }
};
