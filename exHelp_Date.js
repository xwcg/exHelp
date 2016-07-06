/// <reference path="exHelp.js" />
/// <reference path="jquery-2.0.0-vsdoc.js" />

/*!

exHelp Library - Date Helper Plugin // Version 1.0.0.0
http://www.github.com/xwcg

The MIT License (MIT)

Copyright (c) 2014 Michael Schwarz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

(function InitExHelp_DatePlugin(window)
{
    if (window['exHelp'] == void 0 || window['exHelpExtend'] == void 0)
    {
        return setTimeout(InitExHelp_DatePlugin, 100, window);
    }

    // Flags

    // <Flag> Sunday
    var FLAG_SUNDAY = 1;

    // <Flag> Monday
    var FLAG_MONDAY = 2;

    // <Flag> Tuesday
    var FLAG_TUESDAY = 4;

    // <Flag> Wednesday
    var FLAG_WEDNESDAY = 8;

    // <Flag> Thursday
    var FLAG_THURSDAY = 16;

    // <Flag> Friday
    var FLAG_FRIDAY = 32;

    // <Flag> Saturday
    var FLAG_SATURDAY = 64;

    // <Flagmask> All days in the week (Mon-Sun)
    var FLAG_ALLDAYS = FLAG_SUNDAY | FLAG_MONDAY | FLAG_TUESDAY | FLAG_WEDNESDAY | FLAG_THURSDAY | FLAG_FRIDAY | FLAG_SATURDAY;

    // <Flagmask> All days in a typical work week (Mon-Fri)
    var FLAG_WORKDAYS = FLAG_MONDAY | FLAG_TUESDAY | FLAG_WEDNESDAY | FLAG_THURSDAY | FLAG_FRIDAY;

    // <Flagmask> All days in a typical weekend (Sat & Sun)
    var FLAG_WEEKENDS = FLAG_SATURDAY | FLAG_SUNDAY;

    // Array with all days in a week
    var FLAG_ARRAY = [FLAG_SUNDAY, FLAG_MONDAY, FLAG_TUESDAY, FLAG_WEDNESDAY, FLAG_THURSDAY, FLAG_FRIDAY, FLAG_SATURDAY];

    var DAYS_X_WEEK = 7;
    var HOURS_X_DAY = 24;
    var MINUTES_X_HOUR = 60;
    var SECONDS_X_MINUTE = 60;
    var MSEC_X_SECOND = 1000;
    var MULTIPLIER_MINUTES = SECONDS_X_MINUTE * MSEC_X_SECOND;
    var MULTIPLIER_HOURS = MINUTES_X_HOUR * MULTIPLIER_MINUTES;
    var MULTIPLIER_DAYS = HOURS_X_DAY * MULTIPLIER_HOURS;

    var exHelpDate =
        {
            exDate: function ($timestamp)
            {
                var $this = this;
                this._timestamp = exHelpDate.date.fix($timestamp).getTime();

                this.round = function (step)
                {
                    if (!step) step = 5;

                    var dd = exHelpDate.date.fix(this._timestamp);
                    dd.setHours(exHelpDate.date.get.hour(dd),
                        Math.round(exHelpDate.date.get.minute(dd) / step) * step,
                        0, 0);
                    this._timestamp = dd.getTime();
                    return this;
                };

                this.get =
                    {
                        date: function () { return exHelpDate.date.fix($this._timestamp); },
                        timestamp: function () { return this.date().getTime(); },

                        year: function ()
                        {
                            return exHelpDate.date.get.year($this._timestamp);
                        },
                        years: function () { return this.year(); },

                        month: function (leadingZero, zeroIndexed)
                        {
                            return exHelpDate.date.get._leadify(exHelpDate.date.get.month($this._timestamp, false) - (!!zeroIndexed ? 1 : 0), !!leadingZero);
                        },
                        month: function (leadingZero, zeroIndexed) { return this.month(leadingZero, zeroIndexed); },

                        day: function (leadingZero)
                        {
                            return exHelpDate.date.get.day($this._timestamp, !!leadingZero);
                        },
                        days: function (leadingZero) { return this.day(leadingZero); },

                        hour: function (leadingZero, twelveHourFormat)
                        {
                            return exHelpDate.date.get.hour($this._timestamp, !!leadingZero, !!twelveHourFormat);
                        },
                        hours: function (leadingZero, twelveHourFormat) { return this.hour(leadingZero, twelveHourFormat); },

                        minute: function (leadingZero)
                        {
                            return exHelpDate.date.get.minute($this._timestamp, !!leadingZero);
                        },
                        minutes: function (leadingZero) { return this.minute(leadingZero); },

                        second: function (leadingZero)
                        {
                            return exHelpDate.date.get.second($this._timestamp, !!leadingZero);
                        },
                        seconds: function (leadingZero) { return this.second(leadingZero); },

                        week: function ()
                        { return exHelpDate.date.get.isoWeek($this._timestamp); },
                        dotw: function ()
                        { return exHelpDate.date.get.dotw($this._timestamp); },
                        dotwInt: function ()
                        { return exHelpDate.date.get.dotwInt($this._timestamp); }
                    };

                this.set =
                    {
                        year: function (value)
                        {
                            var dd = exHelpDate.date.fix($this._timestamp);
                            dd.setFullYear(value);
                            $this._timestamp = dd.getTime();
                            return $this;
                        },
                        years: function (value) { return this.year(value); },

                        month: function (value)
                        {
                            var dd = exHelpDate.date.fix($this._timestamp);
                            dd.setMonth(value);
                            $this._timestamp = dd.getTime();
                            return $this;
                        },
                        months: function (value) { return this.month(value); },

                        day: function (value)
                        {
                            var dd = exHelpDate.date.fix($this._timestamp);
                            dd.setDate(value);
                            $this._timestamp = dd.getTime();
                            return $this;
                        },
                        days: function (value) { return this.day(value); },

                        hour: function (value)
                        {
                            var dd = exHelpDate.date.fix($this._timestamp);
                            dd.setHours(value);
                            $this._timestamp = dd.getTime();
                            return $this;
                        },
                        hours: function (value) { return this.hour(value); },

                        minute: function (value)
                        {
                            var dd = exHelpDate.date.fix($this._timestamp);
                            dd.setMinutes(value);
                            $this._timestamp = dd.getTime();
                            return $this;
                        },
                        minutes: function (value) { return this.minute(value); },

                        second: function (value)
                        {
                            var dd = exHelpDate.date.fix($this._timestamp);
                            dd.setSeconds(value);
                            $this._timestamp = dd.getTime();
                            return $this;
                        },
                        seconds: function (value) { return this.second(value); }
                    };

                this.add =
                    {
                        year: function (value)
                        {
                            $this._timestamp = exHelpDate.date.add.years($this._timestamp, value).getTime();
                            return $this;
                        },
                        years: function (value) { return this.year(value); },

                        month: function (value)
                        {
                            $this._timestamp = exHelpDate.date.add.months($this._timestamp, value).getTime();
                            return $this;
                        },
                        months: function (value) { return this.month(value); },

                        day: function (value)
                        {
                            $this._timestamp = exHelpDate.date.add.days($this._timestamp, value).getTime();
                            return $this;
                        },
                        days: function (value) { return this.day(value); },

                        hour: function (value)
                        {
                            $this._timestamp = exHelpDate.date.add.hours($this._timestamp, value).getTime();
                            return $this;
                        },
                        hours: function (value) { return this.hour(value); },

                        minute: function (value)
                        {
                            $this._timestamp = exHelpDate.date.add.minutes($this._timestamp, value).getTime();
                            return $this;
                        },
                        minutes: function (value) { return this.minute(value); },

                        second: function (value)
                        {
                            $this._timestamp = exHelpDate.date.add.seconds($this._timestamp, value).getTime();
                            return $this;
                        },
                        seconds: function (value) { return this.second(value); }
                    };

                this.sub =
                    {
                        year: function (value)
                        {
                            $this._timestamp = exHelpDate.date.sub.years($this._timestamp, value).getTime();
                            return $this;
                        },
                        years: function (value) { return this.year(value); },

                        month: function (value)
                        {
                            $this._timestamp = exHelpDate.date.sub.months($this._timestamp, value).getTime();
                            return $this;
                        },
                        months: function (value) { return this.month(value); },

                        day: function (value)
                        {
                            $this._timestamp = exHelpDate.date.sub.days($this._timestamp, value).getTime();
                            return $this;
                        },
                        days: function (value) { return this.day(value); },

                        hour: function (value)
                        {
                            $this._timestamp = exHelpDate.date.sub.hours($this._timestamp, value).getTime();
                            return $this;
                        },
                        hours: function (value) { return this.hour(value); },

                        minute: function (value)
                        {
                            $this._timestamp = exHelpDate.date.sub.minutes($this._timestamp, value).getTime();
                            return $this;
                        },
                        minutes: function (value) { return this.minute(value); },

                        second: function (value)
                        {
                            $this._timestamp = exHelpDate.date.sub.seconds($this._timestamp, value).getTime();
                            return $this;
                        },
                        seconds: function (value) { return this.second(value); }
                    };

                this.count =
                    {
                        daysBetween: function (otherDate)
                        {
                            return exHelpDate.date.get.daysBetween($this._timestamp, otherDate);
                        },
                        monthsBewteen: function (otherDate)
                        {
                            return exHelpDate.date.get.monthsBetween($this._timestamp, otherDate);
                        },
                        yearsBewteen: function (otherDate)
                        {
                            return exHelpDate.date.get.yearsBetween($this._timestamp, otherDate);
                        },
                        daysInYear: function ()
                        {
                            var t1 = new exHelpDate.exDate($this._timestamp);
                            t1.set.month(0).set.day(0).set.hour(0).set.minute(0).set.second(0);

                            var t2 = new exHelpDate.exDate($this._timestamp);
                            t2.set.month(11).set.day(31).set.hour(23).set.minute(59).set.second(59);
                            return t2.count.daysBetween(t1);
                        }
                    };

                this.to =
                    {
                        string: function ()
                        {
                            return exHelpDate.date.to.debugString($this._timestamp);
                        },
                        sqlString: function ()
                        {
                            if (isNaN($this._timestamp))
                                return "";

                            return exHelpDate.date.to.sqlString($this._timestamp);
                        }
                    };

                this.from =
                    {
                        sqlString: function (str)
                        {
                            try
                            {
                                var mainBits = str.split(" ");
                                var dateBits = mainBits[0].split("-");
                                var timeBits = mainBits[1].split(":");

                                $this.set.year(dateBits[0])
                                .set.month(dateBits[1] - 1)
                                .set.day(dateBits[2])
                                .set.hour(timeBits[0])
                                .set.minute(timeBits[1])
                                .set.second(timeBits[2]);
                            }
                            catch (ex)
                            {
                                $this._timestamp = NaN;
                            }
                            return $this;
                        }
                    };

                this.is =
                    {
                        leapYear: function ()
                        {
                            /*
                            if year is divisible by 400 then is_leap_year
                            else if year is divisible by 100 then not_leap_year
                            else if year is divisible by 4 then is_leap_year
                            else not_leap_year
                            */

                            var year = $this.get.year();

                            if (year % 400 == 0)
                                return true;
                            else if (year % 100 == 0)
                                return false;
                            else if (year % 4 == 0)
                                return true;
                            else
                                return false;
                        },
                        after: function (other_date)
                        {
                            return $this.get.timestamp() > exHelpDate.date.fix(other_date).getTime();
                        },
                        before: function (other_date)
                        {
                            return $this.get.timestamp() < exHelpDate.date.fix(other_date).getTime();
                        },
                        within: function (lower, upper, ambos)
                        {
                            return exHelpDate.date.is.Within($this._timestamp, lower, upper, !!ambos);
                        },
                        AM: function ()
                        {
                            return exHelpDate.date.is.AM($this._timestamp);
                        },
                        same: function (other_date)
                        {
                            return exHelpDate.date.is.same($this._timestamp, other_date);
                        },
                        sameMinute: function (other_date)
                        {
                            return exHelpDate.date.is.sameMinute($this._timestamp, other_date);
                        },
                        sameHour: function (other_date)
                        {
                            return exHelpDate.date.is.sameHour($this._timestamp, other_date);
                        },
                        sameDay: function (other_date)
                        {
                            return exHelpDate.date.is.sameDay($this._timestamp, other_date);
                        },
                        sameWeek: function (other_date)
                        {
                            return exHelpDate.date.is.sameWeek($this._timestamp, other_date);
                        },
                        sameMonth: function (other_date)
                        {
                            return exHelpDate.date.is.sameMonth($this._timestamp, other_date);
                        },
                        sameYear: function (other_date)
                        {
                            return exHelpDate.date.is.sameYear($this._timestamp, other_date);
                        },
                        valid: function ()
                        {
                            return !isNaN($this._timestamp);
                        }
                    };

                this.for = function (callback, steps, until)
                {
                    var $steps =
                        {
                            year: 0,
                            month: 0,
                            day: 0,
                            hour: 0,
                            minute: 0,
                            second: 0
                        };

                    exHelp.extend($steps, steps);

                    var $until = new exHelpDate.exDate(until);

                    if ($until.is.before(this))
                    {
                        do
                        {
                            if (exHelp.is.function(callback))
                                callback.apply(this);

                            this.sub.year($steps.year)
                            .sub.month($steps.month)
                            .sub.day($steps.day)
                            .sub.hour($steps.hour)
                            .sub.minute($steps.minute)
                            .sub.second($steps.second);

                        } while (this.is.after($until));
                    }
                    else
                    {
                        do
                        {
                            if (exHelp.is.function(callback))
                                callback.apply(this);

                            this.add.year($steps.year)
                            .add.month($steps.month)
                            .add.day($steps.day)
                            .add.hour($steps.hour)
                            .add.minute($steps.minute)
                            .add.second($steps.second);

                        } while (this.is.before($until));
                    }

                    return this;
                };

                this.format = function (formatstring, defaultValue)
                {
                    if (isNaN($this._timestamp))
                        return defaultValue ? defaultValue : "";

                    return exHelpDate.date.to.phpString($this._timestamp, !!formatstring ? formatstring : "d-m-Y H:i:s");
                };

                // Overrides

                this.toString = function ()
                {
                    return this.to.string();
                };
            },

            // Helpers for working with dates
            date:
            {
                _FirstDotw: FLAG_MONDAY,


                set FirstDayOfTheWeek(d)
                {
                    /// <summary>Set a new first day of the week</summary>
                    /// <param name="d" type="Flag">Weekday Flag</param>

                    this._FirstDotw = d;
                },
                get FirstDayOfTheWeek()
                {
                    /// <summary>Get the current set first day of the week (Default: Monday)</summary>

                    return this._FirstDotw;
                },

                normalize: function (d)
                {
                    /// <summary>
                    /// Set time to 12:00:00.00
                    /// </summary>
                    /// <param name="d" type="Date">Date to change time of</param>
                    /// <returns type="Date">New date</returns>
                    var dd = new Date((d.getTime) ? d.getTime() : d);
                    dd.setHours(12, 0, 0, 0);
                    return dd;
                },
                normalizeMonth: function (d)
                {
                    /// <summary>
                    /// Set date to 1st day of the month and time to 12:00:00.00
                    /// </summary>
                    /// <param name="d" type="Date">Date to normalize</param>
                    /// <returns type="Date">New date</returns>
                    var dd = exHelpDate.date.fix(d);
                    dd.setDate(1);
                    dd.setHours(12, 0, 0, 0);
                    return dd;
                },
                // (Deprecated) Use normalizeMonth
                safeDate: function (d)
                {
                    var dd = this.fix(d);
                    dd.setDate(15);
                    return dd;
                },
                fix: function (d)
                {
                    /// <summary>
                    /// Converts input value into a valid Date object
                    /// </summary>
                    /// <param name="d" type="mixed">Value to make into a Date (string, number, etc..)</param>
                    /// <returns type="Date">Parsed date or current date if failed</returns>

                    //try
                    //{
                    //    var fixed = new Date((d.getTime) ? d.getTime() : d);
                    //    if (!fixed.getTime || isNaN(fixed.getTime()))
                    //        fixed = new Date(parseInt(d, 10));
                    //    return fixed;
                    //}
                    //catch (x)
                    //{
                    //    console.error("Error fixing date: ", d);
                    //    return this.now;
                    //}

                    if (d === undefined || d === false || d === true || d === null)
                        return this.now;

                    if (d instanceof exHelpDate.exDate)
                        return d.get.date();

                    try
                    {
                        var fixed = new Date(d.getTime ? d.getTime() : d);
                        return (!fixed.getTime || isNaN(fixed.getTime())) && (fixed = new Date(parseInt(d, 10))), fixed;
                    }
                    catch (x)
                    {
                        return console.error("Error fixing date: ", d), this.now;
                    }
                },
                round: function (d)
                {
                    /// <summary>
                    /// Rounds time to within 5 minutes
                    /// </summary>
                    /// <param name="d" type="Date">Date to round time of</param>
                    /// <returns type="Date">Rounded date</returns>

                    var dd = exHelpDate.date.fix(d);
                    dd.setHours(exHelpDate.date.get.hour(dd),
                        Math.round(exHelpDate.date.get.minute(dd) / 5) * 5,
                        0, 0);
                    return dd;
                },
                /// <deprecated type="deprecate" >Gets the timezone offset in minutes</deprecated>
                get timezoneOffset()
                {
                    return (-((new Date().getTimezoneOffset()) * MULTIPLIER_MINUTES));
                },
                getTimezoneOffset: function (d)
                {
                    /// <deprecated type="deprecate" >Gets the timezone offset in minutes</deprecated>
                    return (-((this.fix(d).getTimezoneOffset()) * MULTIPLIER_MINUTES));
                },
                get now()
                {
                    /// <summary>Current date and time</summary>

                    return new Date();
                },
                // Get something from a date
                get:
                    {
                        _fix: function (d)
                        {
                            return exHelpDate.date.fix(d);
                        },
                        _leadify: function (v, lead)
                        {
                            //if (v < 10 && !!lead)
                            //    return "0{0}".format(v);
                            //else
                            //    return v;

                            return v < 10 && !!lead ? "0{0}".format(v) : v;
                        },

                        second: function (d, leadingZero)
                        {
                            /// <signature>
                            /// <summary>
                            /// Get seconds of given date
                            /// </summary>
                            /// <param name="d" type="Date">Date</param>
                            /// <param name="leadingZero" type="Boolean">If true, returns with leading zero</param>
                            /// <returns type="String">Seconds</returns>
                            /// </signature>
                            ///
                            /// <signature>
                            /// <summary>
                            /// Get seconds of given date
                            /// </summary>
                            /// <param name="d" type="Date">Date</param>
                            /// <returns type="Number">Seconds</returns>
                            /// </signature>
                            /// 

                            var val = this._fix(d).getSeconds();
                            return this._leadify(val, leadingZero);
                        },
                        minute: function (d, leadingZero)
                        {
                            /// <signature>
                            /// <summary>
                            /// Get minutes of given date
                            /// </summary>
                            /// <param name="d" type="Date">Date</param>
                            /// <param name="leadingZero" type="Boolean">If true, returns with leading zero</param>
                            /// <returns type="String">Minutes</returns>
                            /// </signature>
                            ///
                            /// <signature>
                            /// <summary>
                            /// Get minutes of given date
                            /// </summary>
                            /// <param name="d" type="Date">Date</param>
                            /// <returns type="Number">Minutes</returns>
                            /// </signature>
                            /// 

                            var val = this._fix(d).getMinutes();
                            return this._leadify(val, leadingZero);
                        },
                        hour: function (d, leadingZero, twelveHourFormat)
                        {
                            /// <signature>
                            /// <summary>
                            /// Get Hour of given date
                            /// </summary>
                            /// <param name="d" type="Date">Date</param>
                            /// <returns type="Number">Hour</returns>
                            /// </signature>
                            /// 
                            /// <signature>
                            /// <summary>
                            /// Get Hour of given date
                            /// </summary>
                            /// <param name="d" type="Date">Date</param>
                            /// <param name="leadingZero" type="Boolean">If true, returns with leading zero</param>
                            /// <returns type="String">Hour</returns>
                            /// </signature>
                            /// 
                            /// <signature>
                            /// <summary>
                            /// Get Hour of given date
                            /// </summary>
                            /// <param name="d" type="Date">Date</param>
                            /// <param name="leadingZero" type="Boolean">If true, returns with leading zero</param>
                            /// <param name="twelveHourFormat" type="Boolean">If true, uses 12-hour format</param>
                            /// <returns type="String|Number">Hour</returns>
                            /// </signature>

                            var val = this._fix(d).getHours();

                            //if (!!twelveHourFormat)
                            //{
                            //    if (val == 0)
                            //        val = 12;
                            //    else if (val >= 13)
                            //        val -= 12;
                            //}

                            !twelveHourFormat || (val == 0 ? val = 12 : val >= 13 && (val -= 12));

                            return this._leadify(val, leadingZero);
                        },
                        day: function (d, leadingZero)
                        {
                            /// <signature>
                            /// <summary>
                            /// Get Day of given date
                            /// </summary>
                            /// <param name="d" type="Date">Date</param>
                            /// <param name="leadingZero" type="Boolean">If true, returns with leading zero</param>
                            /// <returns type="String">Day</returns>
                            /// </signature>
                            ///
                            /// <signature>
                            /// <summary>
                            /// Get Day of given date
                            /// </summary>
                            /// <param name="d" type="Date">Date</param>
                            /// <returns type="Number">Day</returns>
                            /// </signature>

                            return this._leadify(this._fix(d).getDate(), leadingZero);
                        },
                        month: function (d, leadingZero)
                        {
                            /// <signature>
                            /// <summary>
                            /// Get Month of given date
                            /// NOTE: Return Value 1-12, substract 1 if you want to work with JS Date functions
                            /// </summary>
                            /// <param name="d" type="Date">Date</param>
                            /// <param name="leadingZero" type="Boolean">If true, returns with leading zero</param>
                            /// <returns type="String">Month</returns>
                            /// </signature>
                            ///
                            /// <signature>
                            /// <summary>
                            /// Get Month of given date
                            /// NOTE: Return Value 1-12, substract 1 if you want to work with JS Date functions
                            /// </summary>
                            /// <param name="d" type="Date">Date</param>
                            /// <returns type="Number">Month</returns>
                            /// </signature>

                            return this._leadify((this._fix(d).getMonth() + 1), leadingZero);
                        },
                        year: function (d)
                        {
                            /// <summary>
                            /// Get Year of given date
                            /// </summary>
                            /// <param name="d" type="Date">Date</param>
                            /// <returns type="Number">Year</returns>

                            return this._fix(d).getFullYear();
                        },
                        isoWeek: function (d)
                        {
                            /// <summary>
                            /// Get Week of given date
                            /// </summary>
                            /// <param name="d" type="Date">Date</param>
                            /// <returns type="Number">ISO 8601 Week Number</returns>

                            var b = this._fix(d);
                            b.setDate(b.getDate() + 4 - (b.getDay() || 7));
                            var c = b.getTime();
                            return b.setMonth(0), b.setDate(1), Math.floor(Math.round((c - b) / 864e5) / 7) + 1;
                        },

                        timestamp: function (d)
                        {
                            /// <summary>
                            /// Get Timestamp of given date
                            /// </summary>
                            /// <param name="d" type="Date">Date</param>
                            /// <returns type="Number">Timestamp</returns>

                            return this._fix(d).getTime();
                        },

                        // Special Methods

                        // Day of the Week Mask<FLAG_*<int>> of (d)
                        dotw: function (d)
                        {
                            var mask = 0x0;
                            var dN = this._fix(d);

                            switch (dN.getDay())
                            {
                                case 0:
                                    mask |= FLAG_SUNDAY;
                                    break;
                                case 1:
                                    mask |= FLAG_MONDAY;
                                    break;
                                case 2:
                                    mask |= FLAG_TUESDAY;
                                    break;
                                case 3:
                                    mask |= FLAG_WEDNESDAY;
                                    break;
                                case 4:
                                    mask |= FLAG_THURSDAY;
                                    break;
                                case 5:
                                    mask |= FLAG_FRIDAY;
                                    break;
                                case 6:
                                    mask |= FLAG_SATURDAY;
                                    break;
                            }

                            return mask;
                        },
                        // Returns: Day of the Week <int> for (d)
                        // NOTE: Value range 1-7; Where 1 = Monday and 7 = Sunday
                        dotwInt: function (d)
                        {
                            /// <summary>
                            /// ISO-8601 numeric representation of the day of the week
                            /// </summary>
                            /// <param name="d" type="Date">The Date</param>
                            /// <returns type="Number">1 (for Monday) through 7 (for Sunday)</returns>

                            var dN = this._fix(d);

                            switch (dN.getDay())
                            {
                                case 0:
                                    return 7;
                                default:
                                    return dN.getDay();
                            }
                        },
                        // Returns: DOTW Mask<FLAG_*<int>> for (d)<int>
                        dotwForInt: function (d)
                        {
                            var mask = 0x0;

                            switch (d)
                            {
                                case 0:
                                    mask |= FLAG_MONDAY;
                                    break;
                                case 1:
                                    mask |= FLAG_TUESDAY;
                                    break;
                                case 2:
                                    mask |= FLAG_WEDNESDAY;
                                    break;
                                case 3:
                                    mask |= FLAG_THURSDAY;
                                    break;
                                case 4:
                                    mask |= FLAG_FRIDAY;
                                    break;
                                case 5:
                                    mask |= FLAG_SATURDAY;
                                    break;
                                case 6:
                                    mask |= FLAG_SUNDAY;
                                    break;
                            }

                            return mask;
                        },
                        // Returns: <Array<Date>> of all (dotw)Mask<FLAG_*<int>> in current month of (d)
                        dotwArrayFor: function (d, dotw)
                        {
                            /// <summary>
                            /// Generates an Array of all (dotw)'s in the month of (d)
                            /// Example:
                            /// *.date.dotwArrayFor(new Date(), FLAG_MONDAY);
                            /// Returns an array of all Mondays of your current month 
                            /// </summary>
                            /// <param name="d" type="Date">The date to query</param>
                            /// <param name="dotw" type="Int(FLAG_*)">Day of the week flagmask</param>
                            /// <returns type="Array">Array with all (dotw)'s in the month</returns>

                            if ((FLAG_ALLDAYS & dotw) <= 0)
                            {
                                return null;
                            }

                            var fD = this._fix(d);
                            var mD = this.month(fD) - 1;
                            var arr = [];
                            fD = new Date(this.year(fD), this.month(fD) - 1, 1);

                            while (fD.getMonth() == mD)
                            {
                                if (this.dotw(fD) == dotw)
                                {
                                    arr.push(new Date(fD.getTime()));
                                }

                                // 864e5 === 86400000
                                fD = new Date(fD.getTime() + 864e5); //date_addDays(fD, 1);
                            }

                            return arr;
                        },
                        // Returns: (Array<<FLAG_*<int>>, <Date>>) of every (n)<int>'th day of the week in current month of (d)
                        nthDayArr: function (d, n)
                        {
                            var fD = this._fix(d);
                            var mD = this.month(fD) - 1;
                            var arr = [];
                            //new Date(year, month, day, hours, minutes, seconds, milliseconds);
                            fD = new Date(this.year(fD), this.month(fD) - 1, 1);

                            var arr = [];
                            for (var i = 0; i < FLAG_ARRAY.length; i++)
                            {
                                arr[FLAG_ARRAY[i]] = [0, null];
                            }

                            while (fD.getMonth() == mD)
                            {
                                if (arr[this.dotw(fD)][0] < n)
                                {
                                    arr[this.dotw(fD)][0]++;
                                    arr[this.dotw(fD)][1] = new Date(fD.getTime());
                                }

                                //var found = 0;
                                //for (var i = 1; i < arr.length; i *= 2)
                                //{
                                //    arr[i][0] == n && found++;
                                //}

                                for (var found = 0, i = 1; i < arr.length; i *= 2)
                                    arr[i][0] == n && found++;

                                if (found >= 7)
                                    break;

                                fD = new Date(fD.getTime() + 864e5); //date_addDays(fD, 1);
                            }

                            var outarr = [];

                            for (var i = 1; i < arr.length; i *= 2)
                                outarr[i] = arr[i][1]

                            return outarr;
                        },
                        // Returns: <Date> of the first Day of the Week of (d)
                        // Note: Set First Day of the week with *.date.FirstDayOfTheWeek
                        weekStart: function (d)
                        {
                            var dateLook = this._fix(d);
                            var dateStart = null;

                            // Is this day the set start of the week?
                            if (this.dotw(dateLook) & exHelpDate.date.FirstDayOfTheWeek)
                            {
                                dateStart = new Date(dateLook);
                            }
                            else // no
                            {
                                var distanceBack = 0,
                                    distanceForw = 0,
                                    dateBack = null,
                                    dateForw = null;

                                // search for it in the past
                                while (!(this.dotw(dateLook) & exHelpDate.date.FirstDayOfTheWeek))
                                {
                                    dateLook = exHelpDate.date.sub.days(dateLook, 1);
                                    distanceBack++;
                                }

                                dateBack = exHelpDate.date.fix(dateLook);
                                dateLook = this._fix(d);

                                // search for it in the future
                                while (!(this.dotw(dateLook) & exHelpDate.date.FirstDayOfTheWeek))
                                {
                                    dateLook = exHelpDate.date.add.days(dateLook, 1);
                                    distanceForw++;
                                }

                                dateForw = exHelpDate.date.fix(dateLook);

                                // use the closest
                                dateStart = distanceBack < distanceForw ? exHelpDate.date.fix(dateBack) : exHelpDate.date.fix(dateForw);

                                // if not in the same week
                                if (!exHelpDate.date.is.sameWeek(dateStart, d))
                                    // use the other one
                                    dateStart = distanceBack > distanceForw ? exHelpDate.date.fix(dateBack) : exHelpDate.date.fix(dateForw);
                            }

                            return dateStart;
                        },
                        // Returns: First Day<Date> of (month)<int[0-11]> in (year)<int> 
                        startForYearAndMonth: function (year, month)
                        {
                            return new Date(year, month, 1, 0, 0, 0);
                        },
                        // Returns: Last Day<Date> of (month)<int[0-11]> in (year)<int> 
                        endForYearAndMonth: function (year, month)
                        {
                            var start = this.startForYearAndMonth(year, month);
                            return this.endOfMonth(start);
                        },
                        // Returns: <Date> of the first day of the week of the (week)<int>'th week of (year)<int> 
                        startForYearAndWeek: function (year, week)
                        {
                            var ts = new Date(year, 0, 1).getTime();
                            ts += ((week - 1) * 7) * MULTIPLIER_DAYS;

                            return new Date(ts);
                        },
                        // Returns: <Date> of the last day of the week of the (week)<int>'th week of (year)<int> 
                        endForYearAndWeek: function (year, week)
                        {
                            var d = exHelpDate.date.add.days(this.startForYearAndWeek(year, week), 6);
                            d.setHours(23);
                            d.setMinutes(59);
                            d.setSeconds(59);

                            return d;
                        },

                        // Returns: First Day<Date> of current month of (d)
                        startOfMonth: function (d)
                        {
                            var cd = this._fix(d);
                            return new Date(cd.getFullYear(), cd.getMonth(), 1, 0, 0, 0);
                        },
                        // Returns: Last Day<Date> of current month of (d)
                        endOfMonth: function (d)
                        {
                            var cd = this._fix(d);
                            return new Date(cd.getFullYear(), cd.getMonth() + 1, 0, 23, 59, 59);
                        },
                        // Returns: Number<int> of days of the current month of (d)
                        // Note: aka. How many days does this month have?
                        lastDotm: function (d)
                        {
                            return this.day(this.endOfMonth(d));
                        },

                        // Returns: Number<int> of days between (a) and (b)
                        daysBetween: function (a, b)
                        {
                            var dA = this._fix(a),
                                dB = this._fix(b),
                                start = dA.getTime() < dB.getTime() ? dA : dB,
                                end = dA.getTime() > dB.getTime() ? dA : dB;

                            return Math.ceil(Math.abs((exHelpDate.date.normalize(start).getTime() - exHelpDate.date.normalize(end).getTime()) / MULTIPLIER_DAYS));
                        },
                        // Returns: Number<int> of weeks between (a) and (b)
                        weeksBetween: function (a, b)
                        {
                            var dA = this._fix(a),
                                dB = this._fix(b),
                                start = dA.getTime() < dB.getTime() ? dA : dB,
                                end = dA.getTime() > dB.getTime() ? dA : dB;

                            return Math.floor(Math.abs(start - end) / (7 * MULTIPLIER_DAYS));
                        },
                        // Returns: Number<int> of Months between (a) and (b)
                        monthsBetween: function (a, b)
                        {
                            var dA = this._fix(a),
                                dB = this._fix(b),
                                start = dA.getTime() < dB.getTime() ? dA : dB,
                                end = dA.getTime() > dB.getTime() ? dA : dB;

                            // Check for February safety
                            // couldn't be bothered to look up how little days february has at worst,
                            // 27 will probably do.
                            if (this.day(start) > 27)
                            {
                                start.setDate(26);
                            }

                            var count = 0;

                            while ((this.month(start) !== this.month(end)) || (this.year(start) !== this.year(end)))
                            {
                                count++;

                                start = exHelpDate.date.add.months(start, 1);
                            }

                            return count;
                        },
                        // Returns: Number<int> of years between (a) and (b)
                        yearsBetween: function (a, b)
                        {
                            var dA = this._fix(a),
                                dB = this._fix(b),
                                start = this._fix(dA.getTime() < dB.getTime() ? dA : dB),
                                end = this._fix(dA.getTime() > dB.getTime() ? dA : dB);

                            return Math.abs(exHelpDate.date.get.year(end) - exHelpDate.date.get.year(start));
                        }
                    },
                // Add(+) Something to a date
                add:
                    {
                        _fix: function (d)
                        {
                            return exHelpDate.date.fix(d);
                        },

                        _multiplier:
                            {
                                seconds: 1000,
                                minutes: 60,
                                hours: 60,
                                day: 24
                            },

                        // Add (a)<int> seconds to (d)
                        // Returns: new <Date>
                        seconds: function (d, a)
                        {
                            var ts = this._fix(d).getTime() + (a * this._multiplier.seconds);
                            return new Date(ts);
                        },
                        // Add (a)<int> minutes to (d)
                        // Returns: new <Date>
                        minutes: function (d, a)
                        {
                            return this.seconds(d, a * this._multiplier.minutes);
                        },
                        // Add (a)<int> hours to (d)
                        // Returns: new <Date>
                        hours: function (d, a)
                        {
                            return this.minutes(d, a * this._multiplier.hours);
                        },
                        // Add (a)<int> days to (d)
                        // Returns: new <Date>
                        days: function (d, a)
                        {
                            return this.hours(d, a * this._multiplier.day);
                        },
                        // Add (a)<int> months to (d)
                        // Returns: new <Date>
                        months: function (d, a)
                        {
                            var f = this._fix(d);
                            return this._fix(f.setMonth(f.getMonth() + a));
                        },
                        // Add (a)<int> years to (d)
                        // Returns: new <Date>
                        years: function (d, a)
                        {
                            var f = this._fix(d);
                            return this._fix(f.setFullYear(f.getFullYear() + a));
                        }
                    },
                // Substract(-) something from a date
                sub:
                    {
                        _fix: function (d)
                        {
                            return exHelpDate.date.fix(d);
                        },
                        _multiplier:
                            {
                                seconds: 1000,
                                minutes: 60,
                                hours: 60,
                                day: 24
                            },

                        // Substract (a)<int> seconds from (d)
                        // Returns: new <Date>
                        seconds: function (d, a)
                        {
                            var ts = this._fix(d).getTime() - (a * this._multiplier.seconds);
                            return new Date(ts);
                        },
                        // Substract (a)<int> minutes from (d)
                        // Returns: new <Date>
                        minutes: function (d, a)
                        {
                            return this.seconds(d, a * this._multiplier.minutes);
                        },
                        // Substract (a)<int> hours from (d)
                        // Returns: new <Date>
                        hours: function (d, a)
                        {
                            return this.minutes(d, a * this._multiplier.hours);
                        },
                        // Substract (a)<int> days from (d)
                        // Returns: new <Date>
                        days: function (d, a)
                        {
                            return this.hours(d, a * this._multiplier.day);
                        },
                        // Substract (a)<int> months from (d)
                        // Returns: new <Date>
                        months: function (d, a)
                        {
                            var f = this._fix(d);
                            return this._fix(f.setMonth(f.getMonth() - a));
                        },
                        // Substract (a)<int> years from (d)
                        // Returns: new <Date>
                        years: function (d, a)
                        {
                            var f = this._fix(d);
                            return this._fix(f.setFullYear(f.getFullYear() - a));
                        }
                    },
                // Check something about a date
                is:
                    {
                        _fix: function (d)
                        {
                            return exHelpDate.date.fix(d);
                        },

                        // Returns: true<bool> if (a) and (b) are EXACTLY the same
                        same: function (a, b)
                        {
                            var aa = this._fix(a);
                            var bb = this._fix(b);
                            if (aa === bb)
                                return true;

                            return false;
                        },

                        // Returns: true<bool> if (a) and (b) are on the same minute
                        sameMinute: function (a, b)
                        {
                            var aa = this._fix(a);
                            var bb = this._fix(b);

                            if (this.sameHour(aa, bb) && aa.getMinutes() == bb.getMinutes())
                                return true;

                            return false;
                        },

                        // Returns: true<bool> if (a) and (b) are on the same hour
                        sameHour: function (a, b)
                        {
                            var aa = this._fix(a);
                            var bb = this._fix(b);

                            if (this.sameDay(aa, bb) && aa.getHours() == bb.getHours())
                                return true;

                            return false;
                        },

                        // Returns: true<bool> if (a) and (b) are on the same day
                        sameDay: function (a, b)
                        {
                            var aa = this._fix(a);
                            var bb = this._fix(b);

                            if (this.sameMonth(aa, bb) &&
                                aa.getDate() == bb.getDate())
                                return true;

                            return false;
                        },
                        // Returns: true<bool> if (a) and (b) are in the same week
                        sameWeek: function (a, b)
                        {
                            var aa = this._fix(a);
                            var bb = this._fix(b);

                            if (this.sameYear(aa, bb) &&
                                exHelpDate.date.get.isoWeek(aa) == exHelpDate.date.get.isoWeek(bb))
                            {
                                return true;
                            }

                            return false;
                        },
                        // Returns: true<bool> if (a) and (b) are in the same month
                        sameMonth: function (a, b)
                        {
                            var aa = this._fix(a);
                            var bb = this._fix(b);

                            if (this.sameYear(aa, bb) &&
                                exHelpDate.date.get.month(aa) == exHelpDate.date.get.month(bb))
                            {
                                return true;
                            }

                            return false;
                        },
                        // Returns: true<bool> if (a) and (b) are in the same year
                        sameYear: function (a, b)
                        {
                            var aa = this._fix(a);
                            var bb = this._fix(b);

                            if (aa.getFullYear() == bb.getFullYear())
                            {
                                return true;
                            }

                            return false;
                        },
                        // Returns: true<bool> if (a) is before (b)
                        ABeforeB: function (a, b)
                        {
                            var aa = this._fix(a);
                            var bb = this._fix(b);

                            aa.setHours(0, 0, 0, 0);
                            bb.setHours(0, 0, 0, 0);

                            if (aa.getTime() < bb.getTime())
                            {
                                return true;
                            }

                            return false;
                        },
                        // Returns: true<bool> if (a) is after (b)
                        AAfterB: function (a, b)
                        {
                            var aa = this._fix(a);
                            var bb = this._fix(b);

                            aa.setHours(0, 0, 0, 0);
                            bb.setHours(0, 0, 0, 0);

                            if (aa.getTime() > bb.getTime())
                            {
                                return true;
                            }

                            return false;
                        },
                        // Returns: true<bool> if (d) is between (a) and (b), if [(ambos)<bool>:false] is true includes (a) and (b) 
                        Within: function (d, a, b, ambos)
                        {
                            var dd = this._fix(d);
                            var aa = this._fix(a);
                            var bb = this._fix(b);

                            if (!!ambos && (this.sameDay(dd, aa) || this.sameDay(dd, bb)))
                                return true;

                            if (this.ABeforeB(dd, aa) || this.AAfterB(dd, bb))
                            {
                                return false;
                            }

                            return true;
                        },
                        AM: function (d)
                        {
                            var dd = this._fix(d);
                            if (exHelpDate.date.get.hour(dd) >= 12)
                                return false;

                            return true;
                        }
                    },
                to:
                    {
                        _fix: function (d)
                        {
                            return exHelpDate.date.fix(d);
                        },

                        // Returns: <String> representation of (d) in format: YYYY-MM-DD(W)W
                        debugString: function (d)
                        {
                            var a = this._fix(d);

                            return "{0}-{1}-{2}W{3}".format(
                                exHelpDate.date.get.year(a),
                                exHelpDate.date.get.month(a, true),
                                exHelpDate.date.get.day(a, true),
                                exHelpDate.date.get.isoWeek(a)
                                );
                        },
                        // Returns: <String> representation of (d) in format HH:MM:SS
                        // or in format hh:MM:SS(AM|PM) if [(twelveHourFormat)<bool>:false] is true
                        timeString: function (d, twelveHourFormat)
                        {
                            var a = this._fix(d);

                            if (!!twelveHourFormat)
                            {
                                return "{0}:{1}:{2}{3}".format(
                                        exHelpDate.date.get.hour(a, true, true),
                                        exHelpDate.date.get.minute(a, true),
                                        exHelpDate.date.get.second(a, true),
                                        (exHelpDate.date.get.hour(a) > 12 ? "PM" : "AM")
                                        );
                            }

                            return "{0}:{1}:{2}".format(
                                        exHelpDate.date.get.hour(a, true, false),
                                        exHelpDate.date.get.minute(a, true),
                                        exHelpDate.date.get.second(a, true)
                                        );
                        },

                        phpString: function (d, format)
                        {
                            /// <summary>
                            /// Formats the date using a PHP formatstring, REALLY UGLY AND BUGGY
                            /// </summary>
                            /// <param name="d" type="Date">The date to be formatted</param>
                            /// <param name="format" type="String">PHP format string (e.g.: "Y-m-d H:M:S")</param>
                            /// <returns type="String">Formatted string</returns>

                            var dd = this._fix(d);

                            var str = "" + format;

                            // Day
                            str = str.replace("d", exHelpDate.date.get.day(dd, true));
                            str = str.replace("D", "NI: Three letter day name");
                            str = str.replace("j", exHelpDate.date.get.day(dd, false));
                            str = str.replace("l", "NI: Full day name");
                            str = str.replace("N", exHelpDate.date.get.dotwInt(dd));
                            switch (exHelpDate.date.get.day(dd, true).toString().substr(1, 1))
                            {
                                case "1":
                                    str = str.replace("S", "st");
                                    break;
                                case "2":
                                    str = str.replace("S", "nd");
                                    break;
                                case "3":
                                    str = str.replace("S", "rd");
                                    break;
                                default:
                                    str = str.replace("S", "th");
                                    break;
                            }
                            str = str.replace("w", dd.getDay());
                            str = str.replace("z", "NI: Day of the year");

                            // Week
                            str = str.replace("W", exHelpDate.date.get.isoWeek(dd));

                            // Month
                            str = str.replace("F", "NI: Month full name");
                            str = str.replace("m", exHelpDate.date.get.month(dd, true));
                            str = str.replace("M", "NI: Short month name");
                            str = str.replace("n", exHelpDate.date.get.month(dd, false));
                            str = str.replace("t", exHelpDate.date.get.lastDotm(dd));

                            // Year
                            str = str.replace("L", "NI: Leap year");
                            str = str.replace("o", exHelpDate.date.get.year(dd));
                            str = str.replace("Y", exHelpDate.date.get.year(dd));
                            str = str.replace("y", exHelpDate.date.get.year(dd).toString().substr(2));

                            // Time
                            str = str.replace("a", exHelpDate.date.is.AM(dd) ? "am" : "pm");
                            str = str.replace("A", exHelpDate.date.is.AM(dd) ? "AM" : "PM");
                            str = str.replace("B", "Dafuq is swatch time?");
                            str = str.replace("g", exHelpDate.date.get.hour(dd, false, true));
                            str = str.replace("G", exHelpDate.date.get.hour(dd, false, false));
                            str = str.replace("h", exHelpDate.date.get.hour(dd, true, true));
                            str = str.replace("H", exHelpDate.date.get.hour(dd, true, false));
                            str = str.replace("i", exHelpDate.date.get.minute(dd, true));
                            str = str.replace("s", exHelpDate.date.get.second(dd, true));
                            str = str.replace("u", dd.getMilliseconds());

                            return str;
                        },

                        sqlString: function (d)
                        {
                            /// <summary>
                            /// Creates a string of the given date in MySQL compatible formatting
                            /// </summary>
                            /// <param name="d" type="Date">Date to be stringified</param>
                            /// <returns type="String">MySQL DateTime String</returns>

                            var dd = this._fix(d);
                            return "{0}-{1}-{2} {3}:{4}:{5}".format(
                                exHelpDate.date.get.year(dd),
                                exHelpDate.date.get.month(dd, true),
                                exHelpDate.date.get.day(dd, true),
                                exHelpDate.date.get.hour(dd, true),
                                exHelpDate.date.get.minute(dd, true),
                                exHelpDate.date.get.second(dd, true)
                                );
                        }
                    },

                from:
                    {
                        _fix: function (d)
                        {
                            return exHelpDate.date.fix(d);
                        },

                        sqlString: function (string)
                        {
                            /// <summary>
                            /// Parses a MySQL DateTime string
                            /// </summary>
                            /// <param name="string" type="String">The String to parse</param>
                            /// <returns type="Date">Parsed DateTime</returns>

                            // 2013-01-31 12:59:59
                            var dateTime = string.split(" "); // ["2013-01-31", "12:59:59"]

                            if (dateTime.length != 2)
                                return exHelpDate.date.now;

                            var dateBits = dateTime[0].split("-"); // ["2013", "01", "31"]
                            var timeBits = dateTime[1].split(":"); // ["12", "59", "59"]

                            if (dateBits.length != 3 || timeBits.length != 3)
                                return exHelpDate.date.now;

                            var dd = new Date(dateBits[0], dateBits[1], dateBits[2], timeBits[0], timeBits[1], timeBits[2], 0);

                            return dd;
                        }
                    },

                set:
                    {
                        _fix: function (d)
                        {
                            return exHelpDate.date.fix(d);
                        },

                        // Sets (a) to the date of (b) while keeping the time of (a).
                        // Example:
                        //      a = 2013-01-01 18:30:00
                        //      b = 2013-02-14 19:25:00
                        //      returns: 2013-02-14 18:30:00
                        //
                        // Returns: new <Date>
                        sameDay: function (a, b)
                        {
                            return new Date(exHelpDate.date.get.year(b),
                                exHelpDate.date.get.month(b) - 1,
                                exHelpDate.date.get.day(b),
                                exHelpDate.date.get.hour(a),
                                exHelpDate.date.get.minute(a),
                                exHelpDate.date.get.second(a), 0);
                        },
                        // Sets time of (d) to 00:00:00.000
                        // Returns: new <Date>
                        startOfDay: function (d)
                        {
                            var dd = this._fix(d);
                            dd.setHours(0, 0, 0, 0);
                            return dd;
                        },
                        // Sets time of (d) to 23:59:59
                        // Returns: new <Date>
                        endOfDay: function (d)
                        {
                            var dd = this._fix(d);
                            dd.setHours(23, 59, 59);
                            return dd;
                        },
                        // Sets hour of (d) to (v)<int>
                        hour: function (d, v)
                        {
                            var dd = this._fix(d);
                            return new Date(exHelpDate.date.get.year(dd),
                                exHelpDate.date.get.month(dd) - 1,
                                exHelpDate.date.get.day(dd),
                                v,
                                exHelpDate.date.get.minute(dd),
                                exHelpDate.date.get.second(dd),
                                0);
                        },
                        // Sets minute of (d) to (v)<int>
                        minute: function (d, v)
                        {
                            var dd = this._fix(d);
                            return new Date(exHelpDate.date.get.year(dd),
                                exHelpDate.date.get.month(dd) - 1,
                                exHelpDate.date.get.day(dd),
                                exHelpDate.date.get.hour(dd),
                                v,
                                exHelpDate.date.get.second(dd),
                                0);
                        }
                    }
            }
        };

    // Expose Flags
    window.FLAG_MONDAY = FLAG_MONDAY;
    window.FLAG_TUESDAY = FLAG_TUESDAY;
    window.FLAG_WEDNESDAY = FLAG_WEDNESDAY;
    window.FLAG_THURSDAY = FLAG_THURSDAY;
    window.FLAG_FRIDAY = FLAG_FRIDAY;
    window.FLAG_SATURDAY = FLAG_SATURDAY;
    window.FLAG_SUNDAY = FLAG_SUNDAY;

    // Extend exHelp
    window.exHelpExtend(exHelpDate);

})(window);