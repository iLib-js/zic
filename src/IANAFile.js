/*
 * IANAFile.js - Represent an IANA tzdata file
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

import RuleList from './RuleList';
import Rule from './Rule';

import ZoneList from './ZoneList';
import Zone from './Zone';

const fs = require("fs");

class IANAFile {
    constructor(pathName) {
        this.rules = {};
        this.zones = {};

        const data = fs.readFileSync(pathName, "utf-8");
        const lines = data.split(/\n/g);
        let recentZone = false;
        let recentZoneName;

        lines.forEach(line => {
            if (line[0] !== '#') {
                const fields = line.split(/\s+/g);

                if (fields.length > 1) {
                    if (fields[0] === "Rule") {
                        let rule = new Rule(fields);

                        let ruleList = this.rules[rule.getName()];
                        if (!ruleList) {
                            ruleList = new RuleList({
                                name: rule.getName()
                            });
                            this.rules[rule.getName()] = ruleList;
                        }

                        ruleList.addRule(rule);
                        recentZone = false;
                        recentZoneName = undefined;
                    } else if (fields[0] === "Zone" || recentZone) {
                        if (recentZone) {
                            fields.splice(0, 1, "Zone", recentZoneName);
                        }
                        let zone = new Zone(fields);
                        let zoneName = zone.getName();
                        let zoneList = this.zones[zoneName];
                        if (!zoneList) {
                            zoneList = new ZoneList({
                                name: zoneName,
                                rules: this.rules
                            });
                            this.zones[zoneName] = zoneList;
                        }

                        zoneList.addZone(zone);
                        recentZone = true;
                        recentZoneName = zoneName;
                    }
                } else {
                    recentZoneName = undefined;
                    recentZone = false;
                }
            }
        });
    }

    getRules() {
        return this.rules;
    }

    getZones() {
        return this.zones;
    }
};

export default IANAFile;