/// <reference path="exHelp_Date.js" />
/// <reference path="jquery-2.0.0-vsdoc.js" />

/*!

exHelp Library - Extensible Helper // Version 1.0.2.0
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

(function InitExHelp(window)
{
    if (!$ && !window.$ && !window.jQuery)
    {
        return console.error("exHelp: jQuery not found!");
    }

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
                    Version: "1.0.0.0",
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
            _trigger: function (name, e)
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
                        subscriber.call(window, e);
                    }
                }
            },

            trigger: function (name, e, clearAfter, immediate)
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
                    this.defer(function ()
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

            defer: function (e, context, args, time)
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
                if ($.isFunction(e))
                {
                    // Defer
                    setTimeout(function ()
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

            extend: function (obj)
            {
                /// <summary>
                /// Extend exHelp with (obj)
                /// </summary>
                /// <param name="obj" type="Object">Object to extend exHelp with</param>
                $.extend(this, obj);
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
                    }
                },
            // Math helpers
            math:
                {
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

                        if (cr && !cg && !cb && $.isPlainObject(cr))
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
                        if ($.isPlainObject(c))
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

                        if ($.isPlainObject(c))
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

                        var s = ""+str;
                        while (str.length < num) s = char + s;
                        return s;
                    }

                },

            //! Browser Detection Functions Incoming
            browser:
                {
                    // Returns true<bool> if browser is on a mobile device
                    get isMobile()
                    {
                        // for some reason, 1000x more reliable than checking the user agent (also faster)
                        // iPhone 5 landscape reports 568px width, rounded to 570
                        if ($(window).width() <= 570)
                            return true;

                        return false;
                    },

                    // Returns true<bool> if touch input is used
                    get isTouch()
                    {
                        return $.support.touch;
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
                        return $.browser.msie;
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

            //! Other checking functions

            // Checks if (e)<mixed> is a <String>
            isString: function (e)
            {
                return !!(typeof e == "string" || e instanceof String);
            },

            // Checks if (e)<mixed> is a <jQuery>:<Object>
            isjQuery: function (e)
            {
                return !!(e instanceof jQuery);
            },

            // Checks if (e)<mixed> is a <function>
            isFunction: function (e)
            {
                return $.isFunction(e);
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
                    $onShow && $.isFunction($onShow) && ($notification.ondisplay = $onShow);
                    $onClose && $.isFunction($onClose) && ($notification.onclose = $onClose);

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

    /*
    So why an instance list?
    Google PageSpeed recommends loading javascript with the async flag 
    in order to avoid render blocking, however that might cause exHelp
    instances to be created before any other exHelp plugins (like for
    example exHelp_Date) to extend the base object.

    So we keep a list of active instances and if exHelpExtend gets called
    after we already have active exHelp instances running, we extend them
    too, instead of just the base object. That way we guarantee that all
    running and future exHelp instances get plugins.
    */
    var exHelpList = [];

    var exHelp = function ()
    {
        /// <summary>
        /// Make a new exHelp object
        /// </summary>
        $.extend(this, exHelpObject);

        // Add to list of active instances
        exHelpList.push(this);
    };

    var exHelpExtend = function (e)
    {
        /// <summary>
        /// Extend the base exHelp object. Preferrably call before the first exHelp object gets constructed.
        /// </summary>
        /// <param name="e" type="Object">Extension Object</param>
        exHelpObject.extend(e);

        // If there are active instances
        if (exHelpList.length > 0)
        {
            // Go through them all
            for (var key in exHelpList)
            {
                // And extend them too
                exHelpList[key].extend(e);
            }
        }
    };

    window.exHelp = exHelp;
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