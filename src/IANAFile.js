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

import Transition from './Transition';
import RawZone from './RawZone';

const fs = require("fs");

class IANAFile {
    constructor(pathName) {
        this.transitions = [];
        this.zones = [];

        if (pathName) {
            const data = fs.readFileSync(pathName, "utf-8");
            this.setContents(data);
        }
    }
    
    setContents(contents) {
        const lines = contents.split(/\n/g);
        let recentZone = false;
        let recentZoneName;

        lines.forEach(line => {
            const cleanLine = line.replace(/#.*$/g, "");
            const fields = cleanLine.split(/\s+/g);

            if (fields.length > 1) {
                if (fields[0] === "Rule") {
                    this.transitions.push(new Transition(fields));
                    recentZone = false;
                    recentZoneName = undefined;
                } else if (fields[0] === "Zone" || recentZone) {
                    if (recentZone) {
                        fields.splice(0, 1, "Zone", recentZoneName);
                    }
                    const z = new RawZone(fields);
                    this.zones.push(z);
                    recentZone = true;
                    recentZoneName = z.getName();
                }
            } else if (line.length === 0) {
                recentZoneName = undefined;
                recentZone = false;
            }
        });
    }

    getTransitions() {
        return this.transitions;
    }

    getRawZones() {
        return this.zones;
    }
};

export default IANAFile;