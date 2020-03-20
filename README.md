# zic

Ilib's zone info compiler. This tool transforms the IANA tzdata into json format in a way that
ilib can consume it easily.

## Usage

1. Install zic and make sure it is in your path:

```
npm install -g zic
```

2. Get the time zone data.

To use this tool, you must first download the latest tzdata from the IANA web site at:

https://www.iana.org/time-zones

On that page will be a link for "Data Only Distribution" with a file name like "tzdata2017b.tar.gz". Download this and untar it into a temporary directory:

```
> mkdir temp
> mv ~/Downloads/tzdata2017b.tar.gz temp
> cd temp
> tar zxovf tzdata2017b.tar.gz
```

3. Run the Zone Info Compiler

Simply run it without arguments:

```
> zic
```

The result will be a new subdirectory called "zoneinfo" which will contain a number of json files that document
the time zone data in a way that can be used by JS programs.

For ilib, this directory full of files can be copied directly into the `js/data/locale/zoneinfo` directly. In
fact, the ilib build tools do this automatically when ilib is built.

## Zone Info

The IANA tzdata files are organized into a few separate types of data: zones and rules.

Zone data is relatively simple. It documents the rules that a particular zone observes during a particular interval.
For example, the America/New_York time observes the rule named "NYC" from 1942 to 1946, when it switched back to
the general US federal rules until 1967. In this way, particular zones may sometimes match up with larger zones
and sometimes may diverge from them. Whenever a region diverges from the rules set by a larger jurisdiction at any
point in its history, it is given its own time zone name.

Rule data is a little more complicated. It gives the parameters for how a particular daylight savings rule behaves
during a particular time interval. This includes the offset from UTC, when the daylight
time starts and ends, and how much time is saved during daylight time. A rule may be used by multiple time zones
at particular times. For example, the "US" rule is set by the US federal government, and it is used by many zones
throughout the US at various times in history. In fact, over the lifetime of the applicability of the rule,
a particular time zone may decide to use or not use a rule and switch which rule it observes.

People tend to think of "time zones" as a particular band of the earth roughly 15 degrees of longitude wide that
shares the same time. The real picture is much more complicated than that. The problem is that governments are in
charge of the rules for their own jurisdiction, and they can decide the time zone rules for themselves. In many
countries, the federal government decides on the time zone rules for the whole country. This is very common for
small countries where multiple time zones do not make sense. In other countries, particularly in larger ones,
first level regional divisions (states in the US) can also make their own time zone decisions. Even second level
or third level subdivisions also have the ability to decide for themselves.

An example is New Mexico and Arizona, two states in the US. Even though New Mexico and Arizona are roughly
within the "Mountain" time zone band, they have different time zone designations because the Arizona legislature
decided that Arizona will not observe daylight savings time while New Mexico still does. The result is that for
part of the year, New Mexico and Arizona have the same time offset from UTC, and for part of the year, they are
one hour apart.

## File Formats

There are a few types of files that zic outputs: the rules files, the zone info files, and the zonetab.

### Rule Files

A rule file gives the list of rules applicable at various times. The rule files live in a top-level directory called
simply "rules" and are named after the IANA rule. For example, the "NYC" rule lives in the file `zoneinfo/rules/NYC.json`.

The format is:

```json
{
    "rules": [
        {                       // example rule that observes DST
            "years": {
                "from": 1995,   // year that this rule took effect
                "to": "max",    // year that this rule ended, or "max" if it is ongoing
            },
            "s": {              // info about the start of DST
                "j": 78189.5    // Julian day when the transition happens. Either specify the "j" property
                                // or all of the "m", "r", and "t" properties, but not both sets.
                "m": 10,        // month that it starts
                "r": "l0",      // rule for the day it starts "l" = "last", numbers are Sun=0 through Sat=6.
                                // Other syntax is "0>7". This means the 0-day (Sun) after the 7th of the
                                // month. Other possible operators are <, >, <=, >=
                "t": "2:0",     // time of day that the DST turns on, hours:minutes
                "v": "1:0",     // amount of time saved in hours:minutes
                "c": "D"        // character to replace into the abbreviation for daylight time
            },
            "e": {              // info about the end of DST
                "j": 78322.5    // Julian day when the transition happens. Either specify the "j" property
                                // or all of the "m", "r", and "t" properties, but not both sets.
                "m": 3,         // month that it ends
                "r": "l0",      // rule for the day it ends "l" = "last", numbers are Sun=0 through Sat=6.
                                // Other syntax is "0>7". This means the 0-day (Sun) after the 7th of the
                                // month. Other possible operators are <, >, <=, >=
                "t": "2:0",     // time of day that the DST turns off, hours:minutes
                "c": "S"        // character to replace into the abbreviation for standard time
            }
        }
    ]
}
```

In the IANA files, rules for the start and end of DST are often separated from each other, as it is sometimes the
case that a government changes only the rules for the start or the end. As a result, figuring out which rules are
applicable for a particular point in time is tedious. To mitigate this problem, the rules applicable to each
interval are pre-calcuated. That is, each interval has a start and an end rule associated with it, even if that
rule is shared with other intervals. That means that if a start or
end rule does not change between intervals, then that rule is repeated as necessary. Even though some rules are
redundant, the idea was to make it dead simple to for implementors to figure out what rules apply to a particular
given point of time. This also ensure that there is no rule gap between in the intervals.

### Zone Info Files

A zone info file contains information about a particular time zone. The zone info files are organized in a directory
hierarchy that matches the standard IANA time zone names. That is the time zone "America/Los_Angeles" will be located in
the file `zoneinfo/America/Los_Angeles.json`.

Each file has the following format:

```json
{
    "intervals": [
        {                           // example interval that uses a rule
            "years": {
                "from": 1967,       // date that this rule took effect
                "to": "1968-03-20"  // date that this rule ended, or "max" if it is ongoing
            },
            "o": "-7:0",            // offset from UTC
            "f": "M{c}T",           // standard abbreviation. For time zones that observe DST, the {c}
                                    // replacement is replaced with the letter in the e.c or s.c properties
                                    // of the rule
            "rule": "US[4]"         // The rule that is observed in this interval, and the index of the
                                    // particular rule in the rule file that is used
        },
        {                           // example interval where the zone does not observe DST at all
            "years": {
                "from": "1968-03-21"    // date that this rule took effect
                "to": "max"         // date that this rule ended, or "max" if it is ongoing
            },
            "o": "-7:0",            // offset from UTC
            "f": "MST",             // standard abbreviation
            "rule": "-"             // no DST rule applicable during this interval
        }
    ]
}
```

The goal for the zic tool is to make sure that all time intervals between when the zone was first defined until
the present time are covered. In some cases, future times are also covered. The reason is that some countries
still use a non-Gregorian calendar to calculate the start/end of DST. The Gregorian dates of the start/end
are pre-calculated for a number of years in advance and given as separate IANA rules so that implementors do
not need to know how to do calendrical calculations in these non-Gregorian calendars.

When the offset and DST for a particular point in time are being calculated, implementors must search the
array of intervals in the zone info file for the particular interval that contains that point in time. Since
all intervals are covered, at least one of the intervals should always apply.

When a rule is specified in a particular interval, it is given with the rule name and the index into the
array of rules in that rule. For example, if a particular rule such as "US" has 7 intervals, then there are
7 array elements in the rule file `zoneinfo/rules/US.json`. If the `America/Phoenix` time zone uses the
rule "US[4]", then it would be the 5th element in the US rules array. In this way, implementors do not need
to search the array of rules to find the one that is applicable for a point in time. The rule that is
applicable has a "from" and "to" time which can be ignored because of the array elements is pre-calculated.

### Zonetab File

The `zoneinfo/zonetab.json` file contain information about the countries to which the zones belong. The format
is very simple. The whole file is a hash that maps the ISO 3166 country code to an array of time zone names that
are used in that country. This can be used by implementers to limit the choices that users see in a UI depending
on the country.

Example: a snippet of the zonetab.json for Germany (DE)

```json
{
    ...
    "DE": [
        "Europe/Berlin",
        "Europe/Busingen"
    ],
    ...
}
```
