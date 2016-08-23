/*!

exHelp Library - Extensible Helper // Version 1.1.0.1
http://www.github.com/xwcg

The MIT License (MIT)

Copyright (c) 2016 Michael Schwarz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

(function InitExHelp(window)
{
    var exHelpObject =
        {
            _storage: {},
            _subscribers: {},

            // Object to hold settings

            settings: {},

            // Information about the current application
            info:
                {
                    AppName: "Extensible Helper Class",
                    Version: "1.1.0.0",
                    Author: "Michael Schwarz"
                },

            addStorage: function (name)
            {
                /// <summary>
                /// Creates a new storage (name)
                /// </summary>
                /// <param name="name" type="String">Name of the storage</param>
                /// <returns type="Object">Storage object</returns>

                // If the storage is undefined (does not exist)
                if (this._storage[name] === undefined)
                {
                    // Create it
                    this._storage[name] = {};
                }
                // And return it
                return this.getStorage(name);
            },

            getStorage: function (name)
            {
                /// <summary>
                /// Get reference to storage (name)
                /// </summary>
                /// <param name="name" type="String">Name of the Storage</param>
                /// <returns type="Object|undefined">Storage object or undefined if it does not exist</returns>

                // return the storage
                return this._storage[name];
            },

            storage: function (name)
            {
                /// <summary>
                /// Returns a reference to storage (name) and creates it if necessary
                /// </summary>
                /// <param name="name" type="String">Name of the storage</param>
                /// <returns type="Object">Storage object</returns>

                // If the storage exists
                if (this._storage[name])
                    // return it
                    return this._storage[name];
                else
                    // else: create and return it
                    return this.addStorage(name);
            },

            subscribe: function (name, cb)
            {
                /// <summary>
                /// Subscribe a function (cb) to trigger (name)
                /// </summary>
                /// <param name="name" type="String">Trigger name</param>
                /// <param name="cb" type="Function">Callback to execute</param>

                // If the trigger has a subscriber list
                if (this._subscribers[name])
                    // Add this callback to it
                    this._subscribers[name].push(cb);
                else
                {
                    // Else:
                    // Create a new list for that trigger
                    this._subscribers[name] = [];
                    // And call this function again
                    this.subscribe(name, cb);
                }
            },

            unsubscribe: function (name, cb)
            {
                /// <summary>
                /// Unsubscribe a function (cb) from trigger (name)
                /// </summary>
                /// <param name="name" type="String">Trigger name</param>
                /// <param name="cb" type="Function">Callback to unsubscribe</param>

                // If there is a subscriber list for this trigger
                if (this._subscribers[name])
                {
                    // Go through all subsribers
                    for (var i = 0; i < this._subscribers[name].length; i++)
                    {
                        // If the subscriber is the same as the provided callback
                        if (this._subscribers[name][i] === cb)
                        {
                            // Remove it from the subscriber listd
                            this._subscribers[name].splice(i, 1);

                            // and step out of the loop since the index is now corrupted
                            break;
                        }
                    }
                }
            },

            clearSubscriptions: function (name)
            {
                /// <summary>
                /// Clear all subscribers from trigger (name)
                /// </summary>
                /// <param name="name" type="String">Trigger name</param>

                // If there is a subscriber list for this trigger
                if (this._subscribers[name])
                    // Empty it
                    this._subscribers[name] = [];
            },

            // ! Internal Trigger Function
            _trigger: function exHelp_Trigger_Internal(name, e)
            {
                // If there is a subscriber list for this trigger
                if (this._subscribers[name])
                {
                    // scope = subscriber list
                    var scope = this._subscribers[name];

                    // Go through all subscribers
                    for (var i = 0; i < scope.length; i++)
                    {
                        // get the current subscriber
                        var subscriber = scope[i];

                        // And execute it (window context)
                        subscriber.apply(window, e);
                    }
                }
            },

            trigger: function exHelp_Trigger(name, e, clearAfter, immediate)
            {
                /// <signature>
                /// <summary>
                /// Trigger event (name) with parameters (e)
                /// </summary>
                /// <param name="name" type="String">Trigger name</param>
                /// <param name="e" type="Array">Parameters array for the subscriber callback
                /// functions</param>
                /// <param name="clearAfter" type="Boolean">If true, will clear all subscribers of
                /// this trigger after execution</param>
                /// <param name="immediate" type="Boolean">If true, will not be deferred to the end
                /// of the execution queue</param> </signature>
                ///
                /// <signature>
                /// <summary>
                /// Trigger event (name) with parameters (e)
                /// </summary>
                /// <param name="name" type="String">Trigger name</param>
                /// <param name="e" type="Array">Parameters array for the subscriber callback
                /// functions</param>
                /// <param name="clearAfter" type="Boolean">If true, will clear all subscribers of
                /// this trigger after execution</param> </signature>
                ///
                /// <signature>
                /// <summary>
                /// Trigger event (name) with parameters (e)
                /// </summary>
                /// <param name="name" type="String">Trigger name</param>
                /// <param name="e" type="Array">Parameters array for the subscriber callback
                /// functions</param> </signature>

                // Get "this" to a local variable for scoping
                var $this = this;

                // If not immediate
                if (!immediate)
                    // Defer this trigger to the end of the execution stack
                    this.defer(function exHelp_Trigger_Defer()
                    {
                        // Trigger it
                        $this._trigger(name, e);

                        // If we want to clear the subscribers afterwards, do so
                        clearAfter && $this.clearSubscriptions(name);
                    });
                else
                {
                    // If immediate
                    // Trigger it
                    this._trigger(name, e);
                    // If we want to clear the subscribers afterwards, do so
                    clearAfter && this.clearSubscriptions(name);
                }
            },

            defer: function exHelp_Defer(e, context, args, time)
            {
                /// <signature>
                /// <summary>
                /// Puts the function at the end of the execution stack
                /// </summary>
                /// <param name="e" type="Function">Function to defer</param>
                /// <param name="context" type="Object">Context to execute the function in</param>
                /// <param name="args" type="Array">Parameter array</param>
                /// <param name="time" type="Int">Delay time in ms</param> </signature>
                ///
                /// <signature>
                /// <summary>
                /// Puts the function at the end of the execution stack
                /// </summary>
                /// <param name="e" type="Function">Function to defer</param>
                /// <param name="context" type="Object">Context to execute the function in</param>
                /// <param name="args" type="Array">Parameter array</param> </signature>
                ///
                /// <signature>
                /// <summary>
                /// Puts the function at the end of the execution stack
                /// </summary>
                /// <param name="e" type="Function">Function to defer</param>
                /// <param name="context" type="Object">Context to execute the function in</param>
                /// </signature>
                ///
                /// <signature>
                /// <summary>
                /// Puts the function at the end of the execution stack
                /// </summary>
                /// <param name="e" type="Function">Function to defer</param> </signature>

                // If the provided callback is actually a function
                if (this.is.function(e))
                {
                    // Defer
                    setTimeout(function exHelp_Defer_Execution()
                    {
                        // do we have a context?
                        if (context)
                            // Yes, execute it with it
                            e.apply(context, args);
                        else if (args)
                            e.apply(undefined, args);
                        else
                            // No, execute locally
                            e();
                        // Timeout specified? Yes, use it, otherwise use 1 for fastest speed
                    }, time ? time : 1);
                }
            },

            extend: function (base, branch)
            {
                /// <signature>
                /// <summary>
                /// Merges an object into exHelp
                /// </summary>
                /// <param name="base">object to be merged into exHelp</param>
                /// </signature>
                ///
                /// <signature>
                /// <summary>
                /// Merges and object into another object, making the base the result of the merge between base and branch
                /// </summary>
                /// <param name="base">Object that the new object will be merged into</param>
                /// <param name="branch">Object to be merged into the base object</param>
                /// </signature>
                if (!branch)
                {
                    branch = base;
                    base = this;
                }

                for (var key in branch)
                {
                    if (branch[key] !== undefined)
                        base[key] = branch[key];
                }
            },

            each: function (obj, callback, args)
            {
                /// <summary>
                /// Execute a callback for every value in an object or array
                /// </summary>
                /// <param name="obj">Object or array to iterate through</param>
                /// <param name="callback">Callback function to execute for every value. The context of the function will be the value. If the function returns FALSE, the iteration will be stopped.</param>
                /// <param name="args">Additional arguments to be passed to the callback function</param>
                /// <returns type="">The iterator object</returns>
                if (obj["length"] !== void 0)
                {
                    var i = 0, length = obj.length;
                    if (args)
                    {
                        for (; i < length; i++)
                        {
                            if (callback.apply(obj[i], args) === false)
                                break;
                        }
                    }
                    else
                    {
                        for (; i < length; i++)
                        {
                            if (callback.call(obj[i], i, obj[i]) === false)
                                break;
                        }
                    }
                }

                return obj;
            },

            jsonParse: function (str)
            {
                /// <summary>
                /// Parses JSON (j) and fails gracefully on error
                /// </summary>
                /// <param name="str" type="String">JSON to parse</param>
                /// <returns type="mixed|null">JSON Parse result or null on error</returns>
                try
                {
                    return JSON.parse(str);
                }
                catch (e)
                {
                    console.error("JSON Parse Error ", e, "While Parsing: '", str, "'");
                    return null;
                }
            },
            jsonStringify: function (e)
            {
                /// <summary>
                /// Stringifies (e) to JSON and fails gracefully on error
                /// </summary>
                /// <param name="e" type="mixed">Value to stringify into JSON</param>
                /// <returns type="String|null">JSON String or null on error</returns>
                try
                {
                    return JSON.stringify(e);
                }
                catch (e)
                {
                    console.error("JSON Stringify Error ", e, "While Stringifying: ", e);
                    return null;
                }
            },

            // Helpers for randomization
            random:
                {
                    //! Internal random string function (letters AND numbers!)
                    _gen: function (args)
                    {
                        var ASCII_UPPER = args.upper || 65;
                        var ASCII_LOWER = args.lower || 90;
                        var MaxLength = args.len || args.length || 8;

                        var str = "";

                        // As long as the string is not the desired length
                        while (str.length < MaxLength)
                        {
                            // Decide whether to add a letter or number
                            if ((Math.random() * 100) >= 50)
                            {
                                // Add a letter (fancy mathemagics)
                                str += String.fromCharCode(Math.floor((Math.random() * (ASCII_UPPER - ASCII_LOWER)) + ASCII_LOWER));
                            }
                            else
                            {
                                // Add a number (no mathemagics)
                                str += Math.floor(Math.random() * 9).toString();
                            }
                        }

                        return str;
                    },

                    number: function (min, max)
                    {
                        /// <summary>
                        /// Returns a random number between (min) and (max)
                        /// </summary>
                        /// <param name="min" type="Number">Lower bound</param>
                        /// <param name="max" type="Number">Upper bound</param>
                        /// <returns type="Number">Random number</returns>

                        return (Math.random() * (max - min)) + min;
                    },
                    string: function (len, upper)
                    {
                        /// <signature>
                        /// <summary>
                        /// Returns a random string of length (len)
                        /// </summary>
                        /// <param name="len" type="Int">Desired string length</param>
                        /// <param name="upper" type="Boolean">If true, will return UPPERCASE string</param>
                        /// <returns type="String">Random string</returns>
                        /// </signature>
                        /// <signature>
                        /// <summary>
                        /// Returns a random string of length (len)
                        /// </summary>
                        /// <param name="len" type="Int">Desired string length</param>
                        /// <returns type="String">Random string</returns>
                        /// </signature>

                        var ASCII_LOWER = 65; // Lower ascii boundary (A)
                        var ASCII_UPPER = 90; // Upper ascii boundary (Z)

                        if (upper !== undefined && upper === false)
                        {
                            ASCII_LOWER = 97; // Lower ascii boundary (a)
                            ASCII_UPPER = 122; // Upper ascii boundary (z)
                        }

                        return this._gen(
                            {
                                upper: ASCII_UPPER,
                                lower: ASCII_LOWER,
                                len: len
                            });
                    },
                    hex: function (len)
                    {
                        /// <summary>
                        /// Returns a random HEX string [a-f0-9] of length (len)
                        /// </summary>
                        /// <param name="len" type="Int">Desired string length</param>
                        /// <returns type="String">Random Hex String</returns>

                        // Basically the same as a random string generator but the ASCII boundaries are limited to a-f and 0-9
                        var ASCII_LOWER = 97; // Lower ascii boundary (a)
                        var ASCII_UPPER = 102; // Upper ascii boundary (f)

                        return this._gen(
                            {
                                upper: ASCII_UPPER,
                                lower: ASCII_LOWER,
                                len: len
                            });
                    },
                    guid: function ()
                    {
                        /// <summary>
                        /// Returns a pseudorandom GUID [a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}
                        /// </summary>
                        /// <returns type="String">GUID</returns>
                        return "{0}-{1}-{2}-{3}-{4}".format(
                            this.hex(8),
                            this.hex(4),
                            this.hex(4),
                            this.hex(4),
                            this.hex(12)
                            );
                    },
                    hexColor: function ()
                    {
                        /// <summary>
                        /// Returns a random hex colour
                        /// </summary>
                        /// <returns type="String">Hex Colour</returns>
                        return "#" + this.hex(6);
                    },
                    date: function (min, max)
                    {
                        /// <summary>
                        /// Returns a random date between (min) and (max)
                        /// NOTE: Requires exHelp Date Extension!
                        /// </summary>
                        /// <param name="min" type="Date">Lower bound date</param>
                        /// <param name="max" type="Date">Upper bound date</param>
                        /// <returns type="Date">Random date</returns>

                        // We need the date extension, so check for it
                        if (!exHelpObject.date)
                            return console.error("exHelp: Date Extension not found!");

                        // Get timestamps
                        var mmax = exHelpObject.date.fix(max).getTime();
                        var mmin = exHelpObject.date.fix(min).getTime();

                        // Make a new date object by using mathemagics with the timestamps
                        return exHelpObject.date.fix((Math.random() * (mmax - mmin)) + mmin);
                    }
                },

            // Array helpers
            array:
                {
                    clone: function (a)
                    {
                        /// <summary>
                        /// Clones an array (No references!)
                        /// </summary>
                        /// <param name="a" type="Array">Array to be cloned</param>
                        /// <returns type="Array">Cloned array</returns>

                        // By stringyfing the object to JSON and back we avoid pesky references
                        return exHelpObject.jsonParse(exHelpObject.jsonStringify(a));
                    },

                    sieve: function (e)
                    {
                        /// <summary>
                        /// Cleans an array by removing empty values ("", null, undefined) and trimming all strings
                        /// </summary>
                        /// <param name="e" type="Array">Array to be cleaned</param>
                        /// <returns type="Array">Cleaned array</returns>

                        var temp = e;

                        var fncSieve = function (a)
                        {
                            for (var key in a)
                            {
                                var value = a[key];
                                if (exHelpObject.is.string(value))
                                {
                                    a[key] = value = value.trim();
                                    if (value.trim().length == 0)
                                    {
                                        a.splice(key, 1);
                                        return fncSieve(a);
                                    }
                                }
                                else
                                {
                                    if (value === null || value === undefined)
                                    {
                                        a.splice(key, 1);
                                        return fncSieve(a);
                                    }
                                }
                            }
                            return a;
                        };

                        return fncSieve(temp);
                    },

                    contains: function (arr, value)
                    {
                        /// <summary>
                        /// Checks if an array contains a value
                        /// </summary>
                        /// <param name="arr">array to search</param>
                        /// <param name="value">value to look for</param>
                        /// <returns type="boolean">true if the array contains the value</returns>
                        return arr.indexOf(value) !== -1;
                    }

                },
            // Math helpers
            math:
                {
                    rect: function (t, l, b, r)
                    {
                        /// <summary>
                        /// Return a rect helper object for a boundary
                        /// </summary>
                        /// <param name="t">Top border position</param>
                        /// <param name="l">Left border position</param>
                        /// <param name="b">Bottom border position</param>
                        /// <param name="r">Right border position</param>
                        /// <returns type="Object">Rect helper object</returns>
                        return {
                            top: t ? t : 0,
                            left: l ? l : 0,
                            right: r ? r : 0,
                            bottom: b ? b : 0,
                            get width() { return this.right - this.left; },
                            get height() { return this.bottom - this.top; },
                            set width(val) { this.right = this.left + val; },
                            set height(val) { this.bottom = this.top + val; },
                            moveTopBy: function (val) { this.top += val, this.bottom += val; },
                            moveTopTo: function (val) { var h = this.height; this.top = val, this.bottom = this.top + h; },
                            moveLeftBy: function (val) { this.left += val, this.right += val; },
                            moveLeftTo: function (val) { var w = this.width; this.left = val, this.right = this.left + w; },
                            intersects: function (rect)
                            {
                                /// <summary>
                                /// Check whether this rect intersects with the given rect
                                /// </summary>
                                /// <param name="rect">Rect to check collision for</param>
                                /// <returns type="Boolean">true if the given rect intersects</returns>
                                return (this.left <= rect.right &&
                                      rect.left <= this.right &&
                                      this.top <= rect.bottom &&
                                      rect.top <= this.bottom);
                            },
                            contains: function (rect)
                            {
                                /// <summary>
                                /// Check whether the given rect is entirely inside this rect
                                /// </summary>
                                /// <param name="rect">The rect to check</param>
                                /// <returns type="Boolean">true if the given rect is entirely inside this rect</returns>
                                return rect.left <= this.right && rect.left >= this.left &&
                                    rect.top <= this.bottom && rect.top >= this.top &&
                                    rect.right <= this.right && rect.right >= this.left &&
                                    rect.bottom <= this.bottom && rect.bottom >= this.top;
                            }
                        };
                    },
                    easing:
                        {
                            linearTween: function (t, b, c, d)
                            {
                                /// <summary>
                                /// simple linear tweening - no easing, no acceleration
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                return c * t / d + b;
                            },
                            easeInQuad: function (t, b, c, d)
                            {
                                /// <summary>
                                /// quadratic easing in - accelerating from zero velocity
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d;
                                return c * t * t + b;
                            },
                            easeOutQuad: function (t, b, c, d)
                            {
                                /// <summary>
                                /// quadratic easing out - decelerating to zero velocity
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d;
                                return -c * t * (t - 2) + b;
                            },
                            easeInOutQuad: function (t, b, c, d)
                            {
                                /// <summary>
                                /// quadratic easing in/out - acceleration until halfway, then deceleration
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d / 2;
                                if (t < 1) return c / 2 * t * t + b;
                                t--;
                                return -c / 2 * (t * (t - 2) - 1) + b;
                            },
                            easeInCubic: function (t, b, c, d)
                            {
                                /// <summary>
                                /// cubic easing in - accelerating from zero velocity
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d;
                                return c * t * t * t + b;
                            },
                            easeOutCubic: function (t, b, c, d)
                            {
                                /// <summary>
                                /// cubic easing out - decelerating to zero velocity
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d;
                                t--;
                                return c * (t * t * t + 1) + b;
                            },
                            easeInOutCubic: function (t, b, c, d)
                            {
                                /// <summary>
                                /// cubic easing in/out - acceleration until halfway, then deceleration
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d / 2;
                                if (t < 1) return c / 2 * t * t * t + b;
                                t -= 2;
                                return c / 2 * (t * t * t + 2) + b;
                            },
                            easeInQuart: function (t, b, c, d)
                            {
                                /// <summary>
                                /// quartic easing in - accelerating from zero velocity
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d;
                                return c * t * t * t * t + b;
                            },
                            easeOutQuart: function (t, b, c, d)
                            {
                                /// <summary>
                                /// quartic easing out - decelerating to zero velocity
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d;
                                t--;
                                return -c * (t * t * t * t - 1) + b;
                            },
                            easeInOutQuart: function (t, b, c, d)
                            {
                                /// <summary>
                                /// quartic easing in/out - acceleration until halfway, then deceleration
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d / 2;
                                if (t < 1) return c / 2 * t * t * t * t + b;
                                t -= 2;
                                return -c / 2 * (t * t * t * t - 2) + b;
                            },
                            easeInQuint: function (t, b, c, d)
                            {
                                /// <summary>
                                /// quintic easing in - accelerating from zero velocity
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d;
                                return c * t * t * t * t * t + b;
                            },
                            easeOutQuint: function (t, b, c, d)
                            {
                                /// <summary>
                                /// quintic easing out - decelerating to zero velocity
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d;
                                t--;
                                return c * (t * t * t * t * t + 1) + b;
                            },
                            easeInOutQuint: function (t, b, c, d)
                            {
                                /// <summary>
                                /// quintic easing in/out - acceleration until halfway, then deceleration
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d / 2;
                                if (t < 1) return c / 2 * t * t * t * t * t + b;
                                t -= 2;
                                return c / 2 * (t * t * t * t * t + 2) + b;
                            },
                            easeInSine: function (t, b, c, d)
                            {
                                /// <summary>
                                /// sinusoidal easing in - accelerating from zero velocity
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
                            },
                            easeOutSine: function (t, b, c, d)
                            {
                                /// <summary>
                                /// sinusoidal easing out - decelerating to zero velocity
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                return c * Math.sin(t / d * (Math.PI / 2)) + b;
                            },
                            easeInOutSine: function (t, b, c, d)
                            {
                                /// <summary>
                                /// sinusoidal easing in/out - accelerating until halfway, then decelerating
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
                            },
                            easeInExpo: function (t, b, c, d)
                            {
                                /// <summary>
                                /// exponential easing in - accelerating from zero velocity
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                return c * Math.pow(2, 10 * (t / d - 1)) + b;
                            },
                            easeOutExpo: function (t, b, c, d)
                            {
                                /// <summary>
                                /// exponential easing out - decelerating to zero velocity
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                return c * (-Math.pow(2, -10 * t / d) + 1) + b;
                            },
                            easeInOutExpo: function (t, b, c, d)
                            {
                                /// <summary>
                                /// exponential easing in/out - accelerating until halfway, then decelerating
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d / 2;
                                if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                                t--;
                                return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
                            },
                            easeInCirc: function (t, b, c, d)
                            {
                                /// <summary>
                                /// circular easing in - accelerating from zero velocity
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d;
                                return -c * (Math.sqrt(1 - t * t) - 1) + b;
                            },
                            easeOutCirc: function (t, b, c, d)
                            {
                                /// <summary>
                                /// circular easing out - decelerating to zero velocity
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d;
                                t--;
                                return c * Math.sqrt(1 - t * t) + b;
                            },
                            easeInOutCirc: function (t, b, c, d)
                            {
                                /// <summary>
                                /// circular easing in/out - acceleration until halfway, then deceleration
                                /// </summary>
                                /// <param name="t">current time</param>
                                /// <param name="b">start value</param>
                                /// <param name="c">change in value</param>
                                /// <param name="d">duration</param>
                                /// <returns type="float">new value</returns>
                                t /= d / 2;
                                if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                                t -= 2;
                                return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
                            }
                        },
                    // Percentage helpers
                    Percentage:
                        {
                            XofY: function (current, max)
                            {
                                /// <summary>
                                /// Calculates X% of Y
                                /// </summary>
                                /// <param name="current" type="Number">Current Value</param>
                                /// <param name="max" type="Number">Maximum Value</param>
                                /// <returns type="Number">Percentage</returns>
                                return (current / max) * 100;
                            }
                        },
                    Dist2D: function (a, b)
                    {
                        /// <summary>
                        /// Returns the distance between two points on a 2-Dimensional plane
                        /// </summary>
                        /// <param name="a">First point. Ex.: {x: 5, y: 10}</param>
                        /// <param name="b">Second point Ex.: {x: 10, y: 5}</param>
                        /// <returns type="Number">The distance bewteen the first and second point</returns>
                        if (a && a.x != undefined && a.y != undefined && b && b.x != undefined && b.y != undefined)
                        {
                            var xd = b.x - a.x;
                            var yd = b.y - a.y;
                            return Math.sqrt(xd * xd + yd * yd);
                        }

                        return 0;
                    },
                    Midpoint2D: function (a, b)
                    {
                        /// <summary>
                        /// Calculates the coordinates of the midpoint between two objects on a 2-Dimensional plane
                        /// </summary>
                        /// <param name="a">First point. Ex.: {x: 5, y: 10}</param>
                        /// <param name="b">Second point Ex.: {x: 10, y: 5}</param>
                        /// <returns type="Object">X/Y coordinates of the midpoint. Ex.: {x: 2, y: 7}</returns>
                        if (a && a.x != undefined && a.y != undefined && b && b.x != undefined && b.y != undefined)
                        {
                            return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
                        }
                        return { x: 0, y: 0 };
                    },
                    Dist3D: function (a, b)
                    {
                        /// <summary>
                        /// Calculates the distance bewteen two points in three-dimensional space
                        /// </summary>
                        /// <param name="a">First point. Ex.: {x: 5, y: 10, z: 22}</param>
                        /// <param name="b">Second point Ex.: {x: 10, y: 5, z: 11}</param>
                        /// <returns type="Number">The distance bewteen the first and second point</returns>
                        if (a && a.x != undefined && a.y != undefined && b && b.x != undefined && b.y != undefined)
                        {
                            var xd = b.x - a.x;
                            var yd = b.y - a.y;
                            var zd = b.z - a.z;
                            return Math.sqrt(xd * xd + yd * yd + zd * zd);
                        }

                        return 0;
                    }
                },
            // Color functions
            color:
                {
                    // Internal: converts 0-255 to hex equivalent
                    _component: function (c)
                    {
                        var hex = c.toString(16);
                        return hex.length === 1 ? "0" + hex : hex;
                    },
                    HexToRGB: function (hex)
                    {
                        /// <summary>
                        /// Converts a HEX string to an RGB Object
                        /// </summary>
                        /// <param name="hex" type="String">Valid Hex String (#[a-f0-9]{6})</param>
                        /// <returns type="Object">RGB object { r, g, b }</returns>

                        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                        return {
                            r: parseInt(result[1], 16),
                            g: parseInt(result[2], 16),
                            b: parseInt(result[3], 16)
                        };
                    },
                    HexToHSV: function (hex)
                    {
                        /// <summary>
                        /// Converts a HEX string to an HSV Object
                        /// </summary>
                        /// <param name="hex" type="String">Valid Hex String (#[a-f0-9]{6})</param>
                        /// <returns type="Object">HSV object { h, s, v }</returns>

                        var rgb = this.HexToRGB(hex);
                        return this.RGBToHSV(rgb.r, rgb.g, rgb.b);
                    },
                    RGBToHex: function (cr, cg, cb)
                    {
                        /// <signature>
                        /// <summary>
                        /// Converts RGB to Hex String
                        /// </summary>
                        /// <param name="cr" type="Number">Red</param>
                        /// <param name="cg" type="Number">Green</param>
                        /// <param name="cb" type="Number">Blue</param>
                        /// <returns type="String">Hex String</returns>
                        /// </signature>
                        ///
                        /// <signature>
                        /// <summary>
                        /// Converts RGB Object to Hex String
                        /// </summary>
                        /// <param name="cr" type="Object">RGB object { r, g, b }</param>
                        /// <returns type="String">Hex String</returns>
                        /// </signature>

                        if (cr && !cg && !cb && exHelpObject.is.object(cr))
                        {
                            var r = cr.r;
                            var g = cr.g;
                            var b = cr.b;
                        }
                        else
                        {
                            var r = cr;
                            var g = cg;
                            var b = cb;
                        }

                        return "#" + this._component(r) + this._component(g) + this._component(b);
                    },
                    RGBToHSV: function ()
                    {
                        /// <summary>
                        /// Converts RGB Arguments to HSV Object { h, s, v }
                        /// </summary>
                        /// <param name="red" type="Number">Red</param>
                        /// <param name="green" type="Number">Green</param>
                        /// <param name="blue" type="Number">Blue</param>
                        /// <returns type="Object">HSV object { h, s, v }</returns>

                        // http://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript
                        var rr, gg, bb,
                        r = arguments[0] / 255,
                        g = arguments[1] / 255,
                        b = arguments[2] / 255,
                        h, s,
                        v = Math.max(r, g, b),
                        diff = v - Math.min(r, g, b),
                        diffc = function (c)
                        {
                            return (v - c) / 6 / diff + 1 / 2;
                        };

                        if (diff == 0)
                        {
                            h = s = 0;
                        } else
                        {
                            s = diff / v;
                            rr = diffc(r);
                            gg = diffc(g);
                            bb = diffc(b);

                            if (r === v)
                            {
                                h = bb - gg;
                            } else if (g === v)
                            {
                                h = (1 / 3) + rr - bb;
                            } else if (b === v)
                            {
                                h = (2 / 3) + gg - rr;
                            }
                            if (h < 0)
                            {
                                h += 1;
                            } else if (h > 1)
                            {
                                h -= 1;
                            }
                        }
                        return {
                            h: Math.round(h * 360),
                            s: Math.round(s * 100),
                            v: Math.round(v * 100)
                        };
                    },
                    // Converts H,S,V arguments to RGB Object {r, g, b}
                    HSVToRGB: function (h, s, v)
                    {
                        /// <summary>
                        /// Converts HSV arguments to RGB Object
                        /// </summary>
                        /// <param name="h" type="Number">Hue</param>
                        /// <param name="s" type="Number">Saturation</param>
                        /// <param name="v" type="Number">Value</param>
                        /// <returns type="Object">RGB Object {r, g, b}</returns>

                        // http://snipplr.com/view/14590
                        var r, g, b;
                        var i;
                        var f, p, q, t;

                        h = Math.max(0, Math.min(360, h));
                        s = Math.max(0, Math.min(100, s));
                        v = Math.max(0, Math.min(100, v));
                        s /= 100;
                        v /= 100;

                        if (s == 0)
                        {
                            r = g = b = v;
                            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
                        }

                        h /= 60; // sector 0 to 5
                        i = Math.floor(h);
                        f = h - i; // factorial part of h
                        p = v * (1 - s);
                        q = v * (1 - s * f);
                        t = v * (1 - s * (1 - f));

                        switch (i)
                        {
                            case 0:
                                r = v;
                                g = t;
                                b = p;
                                break;

                            case 1:
                                r = q;
                                g = v;
                                b = p;
                                break;

                            case 2:
                                r = p;
                                g = v;
                                b = t;
                                break;

                            case 3:
                                r = p;
                                g = q;
                                b = v;
                                break;

                            case 4:
                                r = t;
                                g = p;
                                b = v;
                                break;

                            default: // case 5:
                                r = v;
                                g = p;
                                b = q;
                        }

                        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
                    },
                    HSVToHex: function (h, s, v)
                    {
                        /// <summary>
                        /// Converts HSV arguments to Hex String
                        /// </summary>
                        /// <param name="h" type="Number">Hue</param>
                        /// <param name="s" type="Number">Saturation</param>
                        /// <param name="v" type="Number">Value</param>
                        /// <returns type="String">Hex String</returns>

                        var rgb = this.HSVToRGB(h, s, v);
                        return this.RGBToHex(rgb);
                    },
                    Saturate: function (c, i)
                    {
                        /// <summary>
                        /// Changes Saturation
                        /// </summary>
                        /// <param name="c" type="HexString|HSVObject|RGBObject">Color to change</param>
                        /// <param name="i" type="Number">Saturation 0-100</param>
                        /// <returns type="HexString|HSVObject|RGBObject">Color with changed saturation in input format</returns>

                        var originalColor = 0;
                        var intensity = i || 100;

                        // Check which color type we have been given
                        if (exHelpObject.is.object(c))
                        {
                            if (c.h && c.s && c.v)
                                originalColor = "HSV";
                            else if (c.r && c.g && c.b)
                                originalColor = "RGB";
                        }
                        else if (c.startsWith("#"))
                            originalColor = "HEX";

                        // No type detected
                        if (originalColor === 0)
                            return c; // Do nothing and return original color

                        var hsv = 0;

                        // Convert input color to HSV
                        switch (originalColor)
                        {
                            case "HSV":
                                hsv = c;
                                break;
                            case "RGB":
                                hsv = this.RGBToHSV(c.r, c.g, c.b);
                                break;
                            case "HEX":
                                hsv = this.HexToHSV(c);
                                break;
                        }

                        // Set the saturation
                        hsv.s = intensity;

                        // Convert back to original color and return it
                        switch (originalColor)
                        {
                            case "HSV":
                                return hsv;
                            case "RGB":
                                return this.HSVToRGB(hsv.h, hsv.s, hsv.v);
                            case "HEX":
                                return this.HSVToHex(hsv.h, hsv.s, hsv.v);
                        }
                    },
                    Lightness: function (c, i)
                    {
                        /// <summary>
                        /// Changes Light-/Brightness
                        /// </summary>
                        /// <param name="c" type="HexString|HSVObject|RGBObject">Color to change</param>
                        /// <param name="i" type="Number">Lightness 0-100</param>
                        /// <returns type="HexString|HSVObject|RGBObject">Color with changed lightness in input format</returns>

                        var originalColor = 0;
                        var intensity = i || 100;

                        if (exHelpObject.is.object(c))
                        {
                            if (c.h && c.s && c.v)
                                originalColor = "HSV";
                            else if (c.r && c.g && c.b)
                                originalColor = "RGB";
                        }
                        else if (c.startsWith("#"))
                            originalColor = "HEX";

                        if (originalColor === 0)
                            return c;

                        var hsv = 0;

                        switch (originalColor)
                        {
                            case "HSV":
                                hsv = c;
                                break;
                            case "RGB":
                                hsv = this.RGBToHSV(c.r, c.g, c.b);
                                break;
                            case "HEX":
                                hsv = this.HexToHSV(c);
                                break;
                        }

                        hsv.v = intensity;

                        switch (originalColor)
                        {
                            case "HSV":
                                return hsv;
                            case "RGB":
                                return this.HSVToRGB(hsv.h, hsv.s, hsv.v);
                            case "HEX":
                                return this.HSVToHex(hsv.h, hsv.s, hsv.v);
                        }
                    }
                },
            // Cookie Helpers
            cookies:
            {
                cookies: [],

                Read: function ()
                {
                    /// <summary>
                    /// Read cookies into the this.cookies array
                    /// </summary>
                    this.cookies = [];
                    var $cookieStr = document.cookie;
                    var $cookieList = $cookieStr.split(";");
                    for (var i = 0; i < $cookieList.length; i++)
                    {
                        var $csplit = $cookieList[i].split("=");
                        var $cookie = { name: $csplit[0], value: $csplit[1] };
                        this.cookies.push($cookie);
                    }
                },

                Clear: function ()
                {
                    /// <summary>
                    /// Sets all current cookies for this domain to expire
                    /// </summary>

                    this.Read();

                    for (var i = 0; i < this.cookies.length; i++)
                    {
                        $cookie = this.cookies[i];
                        document.cookie = "{0}=; expires={1}".format($cookie.name, (new Date(0).toUTCString()));
                    }
                }
            },

            // String Helpers
            string:
                {
                    pad: function (str, char, num)
                    {
                        /// <summary>
                        /// Pads a string to a specified minimum length
                        /// </summary>
                        /// <param name="str" type="mixed">string to be padded</param>
                        /// <param name="char" type="String">char to fill the size</param>
                        /// <param name="num" type="Integer">minimum length</param>
                        /// <returns type="String">Padded string</returns>

                        if (!char || char === "" || char.length === 0) char = " ";
                        if (!num) num = 2;

                        var s = "" + str;
                        while (str.length < num) s = char + s;
                        return s;
                    }

                },

            // HTML5 Fullscreen API Helpers
            fullscreen:
                {
                    _fromUser: false,
                    get isFullscreen()
                    {
                        /// <summary>
                        /// Indicates whether the browser is currently in fullscreen mode
                        /// </summary>
                        return !(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement);
                    },
                    get isUserFullScreen()
                    {
                        /// <summary>
                        /// Indicates whether the fullscreen mode was initiated by calling the enter function
                        /// </summary>
                        return this.isFullscreen && this._fromUser;
                    },
                    enter: function (from)
                    {
                        /// <summary>
                        /// Request fullscreen
                        /// </summary>
                        /// <param name="from">Optional HTML Object to be the source of the request (like a button). If not given, the request will originate from the window document element</param>
                        if (!from) from = document.documentElement;
                        if (!this.isFullscreen)
                        {
                            if (from.requestFullscreen)
                            {
                                from.requestFullscreen();
                            }
                            else if (from.msRequestFullscreen)
                            {
                                from.msRequestFullscreen();
                            }
                            else if (from.mozRequestFullScreen)
                            {
                                from.mozRequestFullScreen();
                            }
                            else if (from.webkitRequestFullscreen)
                            {
                                from.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                            }
                        }

                        this._fromUser = true;
                    },
                    exit: function ()
                    {
                        /// <summary>
                        /// Request to exit fullscreen
                        /// </summary>
                        if (this.isFullscreen)
                        {
                            if (document.exitFullscreen)
                            {
                                document.exitFullscreen();
                            }
                            else if (document.msExitFullscreen)
                            {
                                document.msExitFullscreen();
                            }
                            else if (document.mozCancelFullScreen)
                            {
                                document.mozCancelFullScreen();
                            }
                            else if (document.webkitExitFullscreen)
                            {
                                document.webkitExitFullscreen();
                            }
                        }

                        this._fromUser = false;
                    }
                },

            // Browser and Feature Detection Helpers
            browser:
                {
                    // Returns true<bool> if browser is on a mobile device
                    get isMobile()
                    {
                        // for some reason, 1000x more reliable than checking the user agent (also faster)
                        // iPhone 5 landscape reports 568px width, rounded to 570
                        if (window.innerWidth <= 1024)
                            return true;

                        return false;
                    },
                    // Returns true<bool> if browser is in portrait
                    get isPortrait()
                    {
                        if (window.innerWidth < window.innerHeight)
                            return true;

                        return false;
                    },

                    // Returns true<bool> if touch input is used
                    get isTouch()
                    {
                        return "ontouchstart" in window;
                    },

                    // Returns true<bool> if browser is Mozilla Firefox
                    get isFirefox()
                    {
                        return navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
                    },

                    // Returns true<bool> if browser is Google Chrome
                    get isChrome()
                    {
                        return navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
                    },

                    // Returns true<bool> if browser is Apple Safari
                    get isSafari()
                    {
                        return (navigator.userAgent.toLowerCase().indexOf("safari") > -1 && !this.isChrome)
                         || (navigator.userAgent.toLowerCase().indexOf("applewebkit") > -1 && !this.isChrome);
                    },

                    // Returns true<bool> if browser is Opera
                    get isOpera()
                    {
                        return navigator.userAgent.toLowerCase().indexOf("opera") > -1;
                    },

                    // Returns true<bool> if browser is Microsoft Internet Explorer
                    get isMSIE()
                    {
                        return navigator.userAgent.toLowerCase().indexOf("trident") > -1;
                    },

                    // Returns true<bool> if browser is Microsoft Edge
                    get isEdge()
                    {
                        return navigator.userAgent.toLowerCase().indexOf("edge/") > -1;
                    },

                    // Returns true<bool> if browser is Microsoft IE Mobile
                    get isIEMobile()
                    {
                        return navigator.userAgent.toLowerCase().indexOf("iemobile") > -1;
                    },

                    // Returns true<bool> if browser is on a Windows Phone
                    get isWindowsPhone()
                    {
                        return navigator.userAgent.toLowerCase().indexOf("windows phone") > -1;
                    },

                    // Returns true<bool> if browser uses Webkit
                    get isWebkit()
                    {
                        return navigator.userAgent.toLowerCase().indexOf("webkit") > -1;
                    },

                    // Returns true<bool> if the system is iOS
                    get isiOS()
                    {
                        return (this.isSafari && this.isTouch);
                    },

                    // Returns true<bool> if the system is iOS 7
                    get isiOS7()
                    {
                        return (this.isiOS && (navigator.userAgent.toLowerCase().indexOf("os 7") > -1));
                    },

                    get supportsHistoryAPI()
                    {
                        return !!(window.history && history.pushState);
                    }
                },

            // Networking Helpers
            net:
                {
                    request: function (url, options)
                    {
                        /// <summary>
                        /// Execute an XHR request to a given URL with the given options
                        /// </summary>
                        /// <param name="url">The URL to call</param>
                        /// <param name="options">Specify details of the XHR request by providing an object. If no options are given, the request will be a GET request without any other data.</param>
                        var baseOptions =
                            {
                                method: "GET",
                                data: null,
                                progress: null,
                                load: null,
                                error: null,
                                abort: null,
                                finished: null
                            };

                        exHelp.extend(baseOptions, options);

                        var xhr = new XMLHttpRequest();

                        var onProgress = function WrappedOnProgress(e)
                        {
                            if (baseOptions.progress && exHelp.is.function(baseOptions.progress))
                                baseOptions.progress(e);
                        };
                        var onLoad = function WrappedOnLoad(e)
                        {
                            if (baseOptions.load && exHelp.is.function(baseOptions.load))
                                baseOptions.load(e);
                        };
                        var onError = function WrappedOnError(e)
                        {
                            if (baseOptions.error && exHelp.is.function(baseOptions.error))
                                baseOptions.error(e);
                        };
                        var onAbort = function WrappedOnAbort(e)
                        {
                            if (baseOptions.abort && exHelp.is.function(baseOptions.abort))
                                baseOptions.abort(e);
                        };
                        var onReadyState = function WrappedOnReadyState(e)
                        {
                            switch (xhr.readyState)
                            {
                                case XMLHttpRequest.OPENED:
                                case XMLHttpRequest.HEADERS_RECEIVED:
                                case XMLHttpRequest.LOADING:
                                case XMLHttpRequest.UNSENT:
                                    break;
                                case XMLHttpRequest.DONE:
                                    var success = xhr.status == 200;
                                    if (baseOptions.finished && exHelp.is.function(baseOptions.finished))
                                        baseOptions.finished(success, xhr.responseText);
                                    break;
                            }
                        };

                        xhr.onprogress = onProgress;
                        xhr.onabort = onAbort;
                        xhr.onerror = onError;
                        xhr.onload = onLoad;
                        xhr.onreadystatechange = onReadyState;

                        xhr.open(baseOptions.method, url);

                        if (baseOptions.data && baseOptions.method == "POST")
                        {
                            var datastring = "";

                            // http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
                            var encode = function (obj, prefix)
                            {
                                var str = [];
                                for (var p in obj)
                                {
                                    if (obj.hasOwnProperty(p))
                                    {
                                        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                                        str.push(typeof v == "object" ?
                                          encode(v, k) :
                                          encodeURIComponent(k) + "=" + encodeURIComponent(v));
                                    }
                                }
                                return str.join("&");
                            };

                            datastring = encode(baseOptions.data);
                            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                            xhr.send(datastring);
                        }
                        else
                        {
                        xhr.send();
                    }
                    }
                },

            //! Other checking functions

            is:
                {
                    nullOrEmpty: function (e)
                    {
                        /// <summary>
                        /// Returns true if the given value is null, undefined or an empty array or string
                        /// </summary>
                        if (e === null || e === undefined)
                            return true;

                        if (exHelp.is.arraylike(e) && e.length == 0)
                            return true;

                        return false;
                    },
                    string: function (e)
                    {
                        /// <summary>
                        /// Returns true if the given value is a string
                        /// </summary>
                        return !!(typeof e == "string" || e instanceof String);
                    },
                    "function": function (e)
                    {
                        /// <summary>
                        /// Returns true if the given value is a function
                        /// </summary>
                        return !!(typeof e === "function" || e instanceof Function);
                    },
                    object: function (e)
                    {
                        /// <summary>
                        /// Returns true if the given value is an object
                        /// </summary>
                        return !!(typeof e === "object" || e instanceof Object);
                    },
                    array: Array.isArray,
                    arraylike: function (e)
                    {
                        /// <summary>
                        /// Returns true if the given value has a length property
                        /// </summary>
                        return e !== void 0 && e["length"] !== void 0;
                    },
                    number: function (e)
                    {
                        /// <summary>
                        /// Returns true if the given value is a finite number
                        /// </summary>
                        return !isNaN(e) && isFinite(e) && e !== false && e !== true && e !== null && e !== undefined;
                    },
                    mouse_event: function (e)
                    {
                        /// <summary>
                        /// Returns true if the given event is a mouse event
                        /// </summary>
                        return !!(typeof e === "MouseEvent" || e instanceof MouseEvent);
                    },
                    keyboard_event: function (e)
                    {
                        /// <summary>
                        /// Returns true if the given event is a keyboard event
                        /// </summary>
                        return !!(typeof e === "KeyboardEvent" || e instanceof KeyboardEvent);
                    }
                },

            // HTML5 Notifications
            browserNotification:
            {
                _mode: 0,
                _permission: 1,
                _api: null,
                _counter: 0,

                // Permission Constants<int>
                permissions:
                    {
                        // Permission to show notifications has been requested and granted
                        get ALLOWED()
                        {
                            return 0;
                        },
                        // Permission to show notifications has not been requested
                        get NOT_ALLOWED()
                        {
                            return 1;
                        },
                        // Permission to show notifications has been requested and denied
                        get DENIED()
                        {
                            return 2;
                        }
                    },

                // Mode Constants<int>
                modes:
                    {
                        // HTML5 Notifications are not supported
                        get NONE()
                        {
                            return 0;
                        },
                        // HTML5 Notifications are supported according to the W3C Standard
                        get W3C()
                        {
                            return 1;
                        },
                        // HTML5 Notifications are supported with the Webkit Implementation
                        get WEBKIT()
                        {
                            return 2;
                        }
                    },
                _list: [],

                Init: function ()
                {
                    /// <summary>
                    /// Initialize HTML5 Notifications
                    /// Call via click event to request permissions
                    /// </summary>

                    if (this.Check_Support(true))
                    {
                        switch (this.Permission.Check(true))
                        {
                            case this.permissions.ALLOWED:
                                break;
                            case this.permissions.NOT_ALLOWED:
                                this.Permission.Request();
                                p.browserNotification.Init();
                                break;
                            case this.permissions.DENIED:
                                break;
                        }
                    }
                },

                Check_Support: function (set)
                {
                    /// <signature>
                    /// <summary>
                    /// Check if the current browser supports HTML5 Notifications
                    /// </summary>
                    /// <param name="set" type="Boolean">If true, the value will be set internally as well</param>
                    /// <returns type="Boolean">Whether or not notifications are supported</returns>
                    /// </signature>
                    ///
                    /// <signature>
                    /// <summary>
                    /// Check if the current browser supports HTML5 Notifications
                    /// </summary>
                    /// <returns type="Boolean">Whether or not notifications are supported</returns>
                    /// </signature>
                    ///

                    if (exHelpObject.isSafari)
                    {
                        this._api = null;
                        return false;
                    }

                    var isValid = function (e)
                    {
                        if (!e || !e.checkPermission || !e.createNotification || !e.requestPermission)
                            return false;

                        return true;
                    };

                    if (isValid(window.Notification))
                    {
                        set && (this._api = window.Notification);
                    }
                    if (isValid(window.webkitNotifications))
                    {
                        set && (this._api = window.webkitNotifications);
                    }

                    if (set)
                        return !!this._api;
                    else
                        return isValid(window.Notification) || isValid(window.webkitNotifications);
                },
                // HTML5 Notifications Permission Handling
                Permission:
                    {
                        // Check if HTML5 Notifications are permitted
                        Check: function (set)
                        {
                            /// <signature>
                            /// <summary>
                            /// Check if HTML5 Notifications are permitted
                            /// </summary>
                            /// <param name="set" type="Boolean">If true, the value will be set internally as well</param>
                            /// <returns type="Boolean">Whether or not notifications are permitted</returns>
                            /// </signature>
                            ///
                            /// <signature>
                            /// <summary>
                            /// Check if HTML5 Notifications are permitted
                            /// </summary>
                            /// <returns type="Boolean">Whether or not notifications are permitted</returns>
                            /// </signature>
                            ///

                            if (!exHelpObject.browserNotification._api)
                                if (!exHelpObject.browserNotification.Check_Support(true))
                                    return;

                            var result = exHelpObject.browserNotification._api.checkPermission();
                            set && (exHelpObject.browserNotification._permission = result);
                            return result;
                        },

                        // Request permission to show HTML5 Notifications
                        // NOTE: This has to be executed on a click handler
                        Request: function ()
                        {
                            /// <summary>
                            /// Request permission to show HTML5 Notifications
                            /// NOTE: This has to be executed on a click handler
                            /// </summary>
                            /// <returns type="Boolean">Whether or not notifications have been granted or denied</returns>

                            return p.browserNotification._api.requestPermission();
                        }
                    },
                _Push_Basic: function ($opts)
                {
                    if (!exHelpObject.settings.useNativeNotifications ||
                        !this.Check_Support() ||
                        this.Permission.Check() !== this.permissions.ALLOWED)
                        return;

                    var $title = $opts.title || exHelpObject.info.AppName;
                    var $content = $opts.content || $opts.msg || $opts.message || $opts.txt || $opts.text;
                    var $img = $opts.img || $opts.pic || "favicon.png";

                    var $onShow = $opts.show || $opts.onshow || $opts.onShow || $opts.display || $opts.ondisplay || $opts.onDisplay;
                    var $onClose = $opts.close || $opts.onClose || $opts.hide || $opts.onHide;

                    var $notification = this._api.createNotification($img, $title, $content);
                    $onShow && exHelp.is.isFunction($onShow) && ($notification.ondisplay = $onShow);
                    $onClose && exHelp.is.isFunction($onClose) && ($notification.onclose = $onClose);

                    $notification.show();

                    this._list[this._counter.toString()] = $notification;
                    //this._counter++;

                    return { notification: $notification, id: this._counter++ };
                },

                Push: function (title, message)
                {
                    /// <summary>
                    /// Push a notification
                    /// </summary>
                    /// <param name="title" type="String">Title of the notification</param>
                    /// <param name="message" type="String">Message of the notification</param>
                    /// <returns type="Object">Notification wrapper object { notification, id }</returns>

                    return this._Push_Basic(
                        {
                            title: title,
                            content: message
                        });
                },

                PushWithImage: function (title, message, pic)
                {
                    /// <summary>
                    /// Push a notification with a custom image
                    /// </summary>
                    /// <param name="title" type="String">Title of the notification</param>
                    /// <param name="message" type="String">Message of the notification</param>
                    /// <param name="pic" type="String">URL of the image of the notification</param>
                    /// <returns type="Object">Notification wrapper object { notification, id }</returns>

                    return this._Push_Basic(
                        {
                            title: title,
                            content: message,
                            img: pic
                        });
                },

                PushAdvanced: function (options)
                {
                    /// <summary>
                    /// Push a notification with (options) (For advanced users only)
                    /// </summary>
                    /// <param name="options" type="Object">Settings object { title, txt, img, show, close }</param>
                    /// <returns type=""></returns>

                    return this._Push_Basic(options);
                }
            },

            locale:
                {
                    _locale: "en-us",
                    set: function (l)
                    { this._locale = l; },
                    getString: function (str)
                    {
                        var store = exHelpObject.storage("locale");
                        if (store[this._locale] && store[this._locale][str])
                            return store[this._locale][str];

                        return str;
                    }

                }
        };

    var exHelpExtend = function (e)
    {
        exHelpObject.extend(e);
    };

    window.exHelp = exHelpObject;
    window.exHelpExtend = exHelpExtend;
})(window);

// C# Style String.Format
// http://stackoverflow.com/questions/1038746/equivalent-of-string-format-in-jquery
String.prototype.format = function ()
{
    var a = arguments;
    return this.replace(/{(\d+)}/g, function (c, d)
    {
        return "undefined" != typeof a[d] ? a[d] : c;
    });
};

// http://stackoverflow.com/questions/646628/javascript-startswith
String.prototype.startsWith = function (str)
{
    /// <summary>
    /// Check if this string starts with (str)
    /// </summary>
    /// <param name="str" type="String">Needle to check</param>
    /// <returns type="Boolean">True if this string starts with (str)</returns>
    return this.slice(0, str.length) == str;
};

// http://stackoverflow.com/questions/646628/javascript-startswith
String.prototype.endsWith = function (str)
{
    /// <summary>
    /// Check if this string ends with (str)
    /// </summary>
    /// <param name="str" type="String">Needle to check</param>
    /// <returns type="Boolean">True if this string ends with (str)</returns>
    return this.slice(-str.length) == str;
};

String.prototype.contains = function (str)
{
    return this.indexOf(str) !== -1;
};

// http://stackoverflow.com/questions/202605/repeat-string-javascript
String.prototype.repeat = function (n)
{
    /// <summary>
    /// Repeats this string (n) times
    /// </summary>
    /// <param name="n" type="Integer">How often to repeat this string</param>
    /// <returns type="String">Repeated string</returns>
    var x = this;
    var s = "";
    for (; ;)
    {
        if (n & 1) s += x;
        n >>= 1;
        if (n) x += x;
        else break;
    }
    return s;
};

// http://stackoverflow.com/a/5047712
//String.prototype.width = function (font)
//{
//    var f = font || '12px arial',
//        o = $('<div>' + this + '</div>')
//              .css({ 'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f })
//              .appendTo($('body')),
//        w = o.width();

//    o.remove();

//    return w;
//}