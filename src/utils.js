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

import { CalendarFactory, DateFactory } from 'ilib-es6';

const months = {
    "Jan": 1,
    "Feb": 2,
    "Mar": 3,
    "Apr": 4,
    "May": 5,
    "Jun": 6,
    "Jul": 7,
    "Aug": 8,
    "Sep": 9,
    "Oct": 10,
    "Nov": 11,
    "Dec": 12
};

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

/**
 * Parse a date string and return an ilib IDate object with the
 * time zone "Etc/UTC"
 * @param {string} dateStr the date to parse in the ISO like format
 * that the IANA tz data uses
 * @return {GregorianDate|undefined} a gregorian date instance in the "Etc/UTC"
 * time zone or undefined if there was an error in parsing the date
 */
export function parseDate(dateStr) {
    if (!dateStr || typeof(dateStr) !== 'string') return undefined;
    var dateElements = {
        timezone: "Etc/UTC"
    };
    var parts = dateStr.trim().split(/\s+/g);
    dateElements.year = parseInt(parts[0]);
    if (isNaN(dateElements.year)) {
        return undefined;
    }
    if (parts.length > 1) {
        dateElements.month = months[parts[1]] || 0;
        if (parts.length > 2) {
            dateElements.day = parseInt(parts[2]);
            if (isNaN(dateElements.day)) {
                dateElements.day = 1;
            }

            if (parts.length > 3) {
                var timeParts = parts[3].split(/:/g);
                dateElements.hour = timeParts[0];
                if (timeParts.length > 1) {
                    dateElements.minute = timeParts[1];
                    if (timeParts.length > 2) {
                        dateElements.second = timeParts[2];
                    }
                }
            }
        }
    }
    return DateFactory(dateElements);
}

export function lastSecond(dateStr) {
    const d = parseDate(dateStr);

    let year = d.getYears(),
        month = d.getMonths(),
        day = d.getDays(),
        hour = d.getHours(),
        minute = d.getMinutes(),
        second = d.getSeconds(),
        date;

    if (hour === 0) {
        if (day === 1) {
            if (month === 1) {
                date = DateFactory({
                    timezone: "Etc/UTC",
                    year,
                    month: 12,
                    day: 31,
                    hour: 23,
                    minute: 59,
                    second: 59
                });
            } else {
                const cal = CalendarFactory({type: "gregorian"});
                date = DateFactory({
                    timezone: "Etc/UTC",
                    year,
                    month,
                    day: cal.getMonLength(month, year),
                    hour: 23,
                    minute: 59,
                    second: 59
                });
            }
        } else {
            date = DateFactory({
                timezone: "Etc/UTC",
                year,
                month,
                day,
                hour: 23,
                minute: 59,
                second: 59
            });
        }
    } else {
        date = d;
    }

    return date.getTimeExtended();
};

