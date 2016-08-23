/// <reference path="_references.js" />

/*!

exHelp Library - Element Helper Plugin // Version 1.0.0.0
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

(function InitExHelp_ElementPlugin(window)
{
    if (window['exHelp'] == void 0 || window['exHelpExtend'] == void 0)
    {
        return setTimeout(InitExHelp_ElementPlugin, 100, window);
    }

    // Exposable exElement function
    var exElement = function (selector, options)
    {
        return new exElement.functions.init(selector, options);
    };

    // Extension element
    var exHelpElement =
        {
            e: exElement,
            isExElement: function (e) { return !!(e instanceof exHelp.e); }
        };

    // Emulate jQuery documentready event
    var domReadySusbcriberTopic = "_dom_ready";
    var onDomReady = function ()
    {
        document.removeEventListener("DOMContentLoaded", onDomReady);
        window.removeEventListener("load", onDomReady);

        exHelp.trigger(domReadySusbcriberTopic);
    };

    document.addEventListener("DOMContentLoaded", onDomReady);
    window.addEventListener("load", onDomReady);

    // internal exElement functions
    exElement.functions = exElement.prototype =
        {
            constructor: exElement,
            init: function (selector, options)
            {
                /// <summary>
                /// Initialize a new exElement
                /// </summary>
                /// <param name="selector">Can be a selector string, an HTML string, a HTMLElement, another exElement or an array of any combination of these.
                /// Selector strings will find the elements in the document, HTML strings will create new elements, HTMLElements will be wrapped into exElement instances.
                /// Can be multiple elements. Multiple objects will be handled equally internally.
                /// </param>
                /// <param name="options">Object of attributes that will be applied to the elements upon instantiation</param>
                /// <returns type="exElement">An exElement instance of all valid elements provided as selector</returns>
                if (!selector) return this;

                var matches = [];

                if (exHelp.is.string(selector))
                {
                    if (selector.charAt(0) == "<" && selector.length >= 3 && selector.charAt(selector.length - 1) == ">")
                    {
                        var tempElement = window.document.createElement("div");
                        tempElement.innerHTML = selector;
                        matches = tempElement.childNodes;

                        return new exElement(matches, options);
                    }
                    else
                    {
                        matches = window.document.querySelectorAll(selector);
                        for (var i = 0; i < matches.length; i++)
                            this[i] = matches[i];

                        this.length = matches.length;
                    }
                }
                else if (exHelp.is.arraylike(selector))
                {
                    var tempmatch, length = selector.length, i = 0;
                    for (; i < length; i++)
                    {
                        if (selector[i] instanceof exHelp.e)
                            tempmatch = selector[i];
                        else
                            tempmatch = new exElement(selector[i], options);

                        if (tempmatch.length > 0)
                            matches.push(tempmatch[0]);
                    }

                    length = matches.length;
                    for (i = 0; i < length; i++)
                        this[i] = matches[i];

                    this.length = matches.length;
                }
                else if (exHelp.is.object(selector))
                {
                    if (selector instanceof exHelp.e)
                        return selector;

                    this.context = this[0] = selector;
                    this.length = 1;
                }

                this._applyOptions(options);

                return this;
            },

            length: 0,

            each: function (callback)
            {
                //exHelp.each(this, callback);
                // Implemented here to reduce overhead
                for (var i = 0; i < this.length; i++)
                    if (callback.call(this[i], i, this[i]) === false)
                        return false;

                return true;
            },

            // Internal

            _applyOptions: function (options)
            {
                var key, value;
                for (key in options)
                {
                    value = options[key];
                    switch (key.toLowerCase())
                    {
                        case "html":
                            if (value.startsWith("__LOCALE__:"))
                            {
                                var localeKey = value.split(":")[1];
                                this.setHtml(exHelp.locale.getString(localeKey));
                            }
                            else
                                this.setHtml(value);
                            break;

                        case "class":
                            this.addClass(value);
                            break;

                        case "width":
                        case "height":
                        case "top":
                        case "left":
                        case "right":
                        case "bottom":
                        case "position":
                            this.setStyle(key, value);
                            break;

                        default:
                            this.setAttr(key, value);
                            break;
                    }
                }
            },

            // Basic DOM Functions

            setAttr: function (name, value)
            {
                this.each(function ()
                {
                    if (this["setAttribute"] !== void 0)
                        this.setAttribute(name, value);
                });
                return this;
            },
            getAttr: function (name)
            {
                var ret = null;
                this.each(function ()
                {
                    if (this["getAttribute"] !== void 0)
                        ret = this.getAttribute(name);
                });
                return ret;
            },
            removeAttr: function (name)
            {
                this.each(function ()
                {
                    if (this["removeAttribute"] !== void 0)
                        this.removeAttribute(name);
                });
                return this;
            },

            setHtml: function (value)
            {
                this.each(function ()
                {
                    if (this["innerHTML"] !== void 0)
                    {
                        this.innerHTML = value;
                    }
                    else if (this["textContent"] !== void 0)
                    {
                        this.textContent = value;
                    }
                });

                return this;
            },

            getHtml: function ()
            {
                var ret = null;
                this.each(function ()
                {
                    if (this["innerHTML"] !== void 0)
                    {
                        ret = this.innerHTML;
                    }
                    else if (this["textContent"] !== void 0)
                    {
                        ret = this.textContent;
                    }
                });
                return ret;
            },

            empty: function ()
            {
                return this.setHtml("");
            },

            remove: function ()
            {
                this.each(function ()
                {
                    this.parentNode.removeChild(this);
                });

                return this;
            },

            children: function ()
            {
                var ret = [];
                this.each(function ()
                {
                    var i = 0, children = this.childNodes, length = children.length;
                    for (; i < length; i++)
                        ret.push(children[i]);
                });

                return new exElement(ret);
            },
            find: function (query)
            {
                var ret = [], ele, isClass = query.charAt(0) == ".", isId = query.charAt(0) == "#", pureName = isClass || isId ? query.substr(1) : query, i, length;

                this.each(function exElement_FindIterator()
                {
                    ele = new exElement(this);
                    if ((isClass && ele.hasClass(pureName)) || (isId && ele.getAttr("id") == pureName) || (!isClass && !isId && ele[0].nodeName.toLowerCase() == pureName.toLowerCase()))
                    {
                        ret.push(this);
                    }

                    if (this.childNodes.length > 0)
                    {
                        ele = ele.children().find(query);
                        length = ele.length;
                        if (length > 0)
                        {
                            for (i = 0; i < length; i++)
                                ret.push(ele[i]);
                        }
                    }
                });

                return new exElement(ret);
            },
            exclusive: function (query)
            {
                var ret = [], ele, isClass = query.charAt(0) == ".", isId = query.charAt(0) == "#", pureName = isClass || isId ? query.substr(1) : query, i, length;

                this.each(function exElement_ExclusiveIterator()
                {
                    ele = new exElement(this);
                    if ((isClass && ele.hasClass(pureName)) || (isId && ele.getAttr("id") == pureName) || (!isClass && !isId && ele[0].nodeName.toLowerCase() == pureName.toLowerCase()))
                    {
                        ret.push(this);
                    }
                });

                return new exElement(ret);
            },

            getValue: function ()
            {
                var values = [];
                this.each(function ()
                {
                    if (this.tagName == "INPUT" && this.type == "checkbox")
                        values.push(this.checked);
                    else if (this["value"] !== void 0)
                        values.push(this.value);
                });

                values = exHelp.array.sieve(values);
                if (values.length > 1)
                    return values;
                else if (values.length == 1)
                    return values[0];
                else
                    return null;
            },

            getWidth: function ()
            {
                return parseFloat(this.getComputedStyle("width"));
            },
            getHeight: function ()
            {
                return parseFloat(this.getComputedStyle("height"));
            },

            getParents: function (until)
            {
                var parents = [],
                    hasUntil = until !== undefined,
                    untilIsClass = hasUntil && until.startsWith("."),
                    untilIsId = hasUntil && until.startsWith("#");

                var gp = function (e)
                {
                    if (e)
                    {
                        var $e = new exElement(e);
                        parents.push(e);
                        if (hasUntil)
                        {
                            if ((untilIsClass && $e.hasClass(until)) || (untilIsId && $e.getAttr("id") == until))
                                return false;
                        }

                        if (e.parentNode)
                        {
                            return gp(e.parentNode);
                        }
                    }
                };

                this.each(function ()
                {
                    if (this)
                    {
                        gp(this.parentNode);
                    }
                });

                return new exElement(parents);
            },

            getPageXY: function ()
            {
                var fullscreenElement = document.fullScreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
                var offset = { x: 0, y: 0 };
                var getOffset = function (e)
                {
                    if (exHelp.fullscreen.isFullscreen && fullscreenElement == e)
                        return;

                    offset.x += e.offsetLeft;
                    offset.y += e.offsetTop;

                    if (e.offsetParent)
                        getOffset(e.offsetParent);
                };

                this.each(function ()
                {
                    getOffset(this);
                });

                return offset;
            },

            getPageBounds: function ()
            {
                var xy = this.getPageXY();
                var bounds = {
                    left: xy.x,
                    top: xy.y,
                    right: xy.x + this.getWidth(),
                    bottom: xy.y + this.getHeight()
                };

                return bounds;
            },


            getRelativeXY: function (until)
            {
                var offset = { x: 0, y: 0 },
                    isClass = until.charAt(0) == ".",
                    isId = until.charAt(0) == "#",
                    pureName = isClass || isId ? until.substr(1) : until;

                var getOffset = function (e)
                {
                    var ele = new exElement(e);
                    if ((isClass && ele.hasClass(pureName)) || (isId && ele.getAttr("id") == pureName) || (!isClass && !isId && ele[0].nodeName.toLowerCase() == pureName.toLowerCase()))
                        return false;

                    offset.x += e.offsetLeft;
                    offset.y += e.offsetTop;

                    if (e.offsetParent)
                        getOffset(e.offsetParent);
                };

                this.each(function ()
                {
                    getOffset(this);
                });

                return offset;
            },

            getRelativeBounds: function (until)
            {
                var xy = this.getRelativeXY(until);
                var bounds = {
                    left: xy.x,
                    top: xy.y,
                    right: xy.x + this.getWidth(),
                    bottom: xy.y + this.getHeight()
                };

                return bounds;
            },

            getRelativeBoundingClientRect: function ()
            {
                var boundingRect = null;
                var relBounds = this.getPageBounds();
                this.each(function ()
                {
                    boundingRect = this.getBoundingClientRect();
                });

                if (boundingRect != null)
                {
                    var outRect = {
                        top: boundingRect.top - relBounds.top,
                        left: boundingRect.left - relBounds.left,
                        right: boundingRect.right - relBounds.right,
                        bottom: boundingRect.bottom - relBounds.bottom,
                        width: boundingRect.width,
                        height: boundingRect.height
                    };

                    return outRect;
                }

                return relBounds;
            },

            getComputedStyle: function (prop)
            {
                var ret = null;

                this.each(function ()
                {
                    if (window.getComputedStyle)
                    {
                        ret = window.getComputedStyle(this, null).getPropertyValue(prop);
                    }
                    else if (this.currentStyle)
                    {
                        ret = this.currentStyle[prop];
                    }
                    else
                    {
                        ret = this.style[prop];
                    }
                });

                return ret;
            },

            addClass: function (value)
            {
                var values = value.split(" ");
                this.each(function ()
                {
                    var classes = this.className.split(" ");
                    for (var i = 0; i < values.length; i++)
                        if (!exHelp.array.contains(classes, values[i]))
                        {
                            classes.push(values[i]);
                        }
                    this.className = classes.join(" ").trim();
                });
                return this;
            },

            removeClass: function (value)
            {
                var values = value.split(" ");
                this.each(function ()
                {
                    var classes = this.className.split(" ");
                    for (var i = 0; i < values.length; i++)
                        if (exHelp.array.contains(classes, values[i]))
                        {
                            classes.splice(classes.indexOf(values[i]), 1);
                        }
                    this.className = classes.join(" ").trim();
                });
                return this;
            },

            toggleClass: function (value)
            {
                var values = value.split(" ");
                this.each(function ()
                {
                    var classes = this.className.split(" ");
                    for (var i = 0; i < values.length; i++)
                        if (exHelp.array.contains(classes, values[i]))
                        {
                            classes.splice(classes.indexOf(values[i]), 1);
                        }
                        else
                        {
                            classes.push(values[i]);
                        }
                    this.className = classes.join(" ").trim();
                });
                return this;
            },

            hasClass: function (value)
            {
                var ret = false;
                this.each(function ()
                {
                    var classes = this.className ? this.className.split(" ") : [];
                    if (exHelp.array.contains(classes, value))
                    {
                        ret = true;
                        return false;
                    }
                });
                return ret;
            },

            setStyle: function (name, value)
            {
                this.each(function ()
                {
                    this.style[name] = value;
                });
            },

            appendTo: function (target)
            {
                target = new exElement(target);
                this.each(function ()
                {
                    var $this = this;
                    target.each(function ()
                    {
                        this.appendChild($this);
                    });
                });
                return this;
            },

            prependTo: function (target)
            {
                target = new exElement(target);
                this.each(function ()
                {
                    var $this = this;
                    target.each(function ()
                    {
                        this.insertBefore($this, this.firstChild);
                    });
                });
                return this;
            },

            // Event handling

            _evtQueue: function ()
            {
                var queue = [];

                this.add = function (e)
                {
                    queue.push(e);
                };

                this.call = function (context)
                {
                    for (var i = 0, l = queue.length; i < l; i++)
                    {
                        queue[i].call(context);
                    }
                };

                this.remove = function (e)
                {
                    var newQueue = [];
                    for (var i = 0, l = queue.length; i < l; i++)
                    {
                        if (queue[i] !== e) newQueue.push(queue[i]);
                    }
                };

                this.length = function () { return queue.length; };
            },

            on: function (events, callback)
            {
                var evts = [], $this = this;
                if (exHelp.is.string(events))
                {
                    if (events.contains(" "))
                        evts = events.split(" ");
                    else if (events.contains(","))
                    {
                        evts = events.split(",");
                        for (var i = 0; i < evts.length; i++)
                            evts[i] = evts[i].trim();
                    }
                    else
                        evts.push(events);
                }

                var i = 0, length = evts.length, e;
                for (; i < length; i++)
                {
                    e = evts[i];

                    switch (e)
                    {
                        case "ready":
                            exHelp.subscribe(domReadySusbcriberTopic, callback);
                            break;

                        case "tap":
                            var tapHandler = function (element)
                            {
                                var isDown = false, ignoreUntilNew = false, xe = new exElement(element);

                                element.addEventListener("touchstart", function (e)
                                {
                                    ignoreUntilNew = false;
                                    isDown = true;
                                    xe.addClass("pressed");
                                });

                                element.addEventListener("touchcancel", function (e)
                                {
                                    if (!ignoreUntilNew)
                                    {
                                        ignoreUntilNew = true;
                                        isDown = false;
                                        xe.removeClass("pressed");
                                    }
                                });

                                element.addEventListener("touchmove", function (e)
                                {
                                    if (!ignoreUntilNew)
                                    {
                                        var bounds = new exElement(element).getPageBounds();

                                        if (e && e.touches && e.touches.length > 0)
                                        {
                                            var touch = e.touches[0];
                                            if (touch.pageX < bounds.left || touch.pageX > bounds.right || touch.pageY < bounds.top || touch.pageY > bounds.bottom)
                                            {
                                                isDown = false;
                                                element.dispatchEvent(new TouchEvent("touchcancel"));
                                            }
                                        }
                                    }
                                });

                                element.addEventListener("touchend", function (e)
                                {
                                    if (!ignoreUntilNew)
                                    {
                                        if (isDown)
                                        {
                                            element._ehe_queue_tap.call(element);
                                            isDown = false;
                                            xe.removeClass("pressed");
                                        }
                                    }
                                });
                            };

                            this.each(function ()
                            {
                                if (!this._ehe_queue_tap)
                                    this._ehe_queue_tap = new $this._evtQueue();

                                if (!this._ehe_taphandler)
                                    this._ehe_taphandler = new tapHandler(this);

                                this._ehe_queue_tap.add(callback);
                            });
                            break;

                        case "resize":
                            var resizeAttacher = function ()
                            {
                                if (this instanceof Element)
                                {
                                    if (this._ehe_resize_handler)
                                    {
                                        this._ehe_queue_resize.add(callback);
                                    }
                                    else
                                    {
                                        if (!this._ehe_queue_resize)
                                            this._ehe_queue_resize = new exElement.functions._evtQueue();

                                        this._ehe_queue_resize.add(callback);
                                        this._ehe_resize_handler = document.createElement("div");

                                        var $this = this;
                                        var style = "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;";
                                        var styleChild = "position: absolute; left: 0; top: 0; transition: 0s;";

                                        this._ehe_resize_handler.className = "ehe-resize-event-dummy";
                                        this._ehe_resize_handler.style.cssText = style;
                                        this._ehe_resize_handler.innerHTML = "<div class=\"resize-sensor-expand\" style=\"{0}\"><div style=\"{1}\"></div></div><div class=\"resize-sensor-shrink\" style=\"{0}\"><div style=\"{1} width: 200%; height: 200%\"></div></div>"
                                        .format(style, styleChild);

                                        this.appendChild(this._ehe_resize_handler);

                                        var expand = this._ehe_resize_handler.childNodes[0];
                                        var expandChild = expand.childNodes[0];
                                        var shrink = this._ehe_resize_handler.childNodes[1];

                                        var reset = function ()
                                        {
                                            expandChild.style.width = 100000 + 'px';
                                            expandChild.style.height = 100000 + 'px';

                                            expand.scrollLeft = 100000;
                                            expand.scrollTop = 100000;

                                            shrink.scrollLeft = 100000;
                                            shrink.scrollTop = 100000;
                                        };

                                        reset();

                                        var lastWidth, lastHeight;
                                        var cachedWidth, cachedHeight; //useful to not query offsetWidth twice

                                        var onScroll = function ()
                                        {
                                            if ((cachedWidth = $this.offsetWidth) != lastWidth || (cachedHeight = $this.offsetHeight) != lastHeight)
                                            {
                                                $this._ehe_queue_resize.call(this);

                                                lastWidth = cachedWidth;
                                                lastHeight = cachedHeight;
                                            }
                                            reset();
                                        };

                                        expand.addEventListener("scroll", onScroll);
                                        shrink.addEventListener("scroll", onScroll);
                                    }

                                    return false;
                                }
                            };

                            if (this.each(resizeAttacher) === false)
                                break;

                        default:
                            this.each(function ()
                            {
                                this.addEventListener(e, callback);
                            });
                            break;
                    }
                }

                return this;
            },
            off: function (events, callback)
            {
                var evts = [], $this = this;
                if (exHelp.is.string(events))
                {
                    if (events.contains(" "))
                        evts = events.split(" ");
                    else if (events.contains(","))
                    {
                        evts = events.split(",");
                        for (var i = 0; i < evts.length; i++)
                            evts[i] = evts[i].trim();
                    }
                    else
                        evts.push(events);
                }

                var i = 0, length = evts.length, e;
                for (; i < length; i++)
                {
                    e = evts[i];

                    switch (e)
                    {
                        case "ready":
                            exHelp.unsubscribe(domReadySusbcriberTopic, callback);
                            break;

                        case "tap":
                            this.each(function ()
                            {
                                if (this._ehe_queue_tap)
                                    this._ehe_queue_tap.remove(callback);
                            });
                            break;

                        case "resize":
                            var resizeAttacher = function ()
                            {
                                if (this instanceof Element)
                                {
                                    if (this._ehe_queue_resize)
                                    {
                                        this._ehe_queue_resize.remove(callback);
                                    }
                                }
                            };

                            if (this.each(resizeAttacher) === false)
                                break;

                        default:
                            this.each(function ()
                            {
                                this.removeEventListener(e, callback);
                            });
                            break;
                    }
                }

                return this;
            }
        };

    exElement.functions.init.prototype = exElement.functions;
    exElement.extend = exElement.functions.extend = function (e)
    {
        exHelp.extend(this, e);
    };


    // Extend exHelp
    window.exHelpExtend(exHelpElement);

})(window);