/// <reference path="exHelp.js" />
/// <reference path="exHelp_Date.js" />
/// <reference path="exHelp_Element.js" />

(function MyAppSetup(window)
{
    if (window['exHelp'] == void 0)
        return setTimeout(MyAppSetup, 100, window);

    var baseExtension =
        {
            info:
                {
                    AppName: "My App",
                    Version: "1.0.0",
                    Author: "Leroy Jenkins"
                },

            myFunction: function (a, b)
            {
                return parseInt(a) * parseInt(b);
            }
        };

    exHelp.extend(baseExtension);

    // Expose
    window.m = exHelp;
})(window);

alert(m.myFunction(2, 4));

var lastDate = localStorage.getItem("lastdate");
if (lastDate)
{
    // exDate lets you consistently handle dates
    var lastDate = new m.exDate(lastDate);
    // the .format string extension lets you use C# style string formatting, exDate even gives you PHP style date formatting
    var lastVisit = "You last visited on {0}".format(lastDate.format("Y-m-d H:i:s"));

    // exDate gives you amazing helper functions to work with dates
    var span = "That was {0} days ago!".format(lastDate.count.daysBetween(new m.exDate().get.timestamp()));

    // Work with DOM elements like in jQuery without overhead!
    var div = m.e("<div>", { "class": "box red", "id": "infoBox" });

    // Some examples
    var p1 = m.e("<p>", { "html": lastVisit });
    var p2 = m.e("<p>");

    p1.appendTo(div);
    // You can even chain them!
    p2.appendTo(div).setHtml(span);;
}

var nowDate = new m.exDate().get.timestamp();
localStorage.setItem("lastdate", nowDate);
