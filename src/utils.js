/*
 * utils.js - Miscellaneous utility functions
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

export function pad2(num) {
    if (num < 0 && num > -10) {
        return `-0${Math.abs(num)}`;
    } else if (num < 10) {
        return `0${num}`;
    }
    return String(num);
};

export function convertToMinutes(time) {
    var parts = time.split(/:/g);
    switch (parts.length) {
        default:
        case 1:
            return parseInt(parts[0]) * 60;
        case 2:
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        case 3:
            // ignore the seconds
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
};

export function formatTime(time) {
    return `${pad2(time.h)}:${pad2(time.m || 0)}`; 
};


