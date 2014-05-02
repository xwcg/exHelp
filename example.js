/// <reference path="exHelp.js" />
/// <reference path="exHelp_Date.js" />
/// <reference path="jquery-2.0.0-vsdoc.js" />

(function MyAppSetup(window)
{
    if (window['exHelp'] == void 0)
        return setTimeout(MyAppSetup, 100, window);

    var myapp = new exHelp();

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

    myapp.extend(baseExtension);

    // Expose
    window.m = myapp;
})(window);

alert(m.myFunction(2, 4));

var lastDate = localStorage.getItem("lastdate");
if (lastDate)
{
    var lastDate = new m.exDate(lastDate);
    alert("You last visited on {0}".format(lastDate.format("Y-m-d H:i:s")));
    alert("That was {0} days ago!".format(lastDate.count.daysBetween(new m.exDate().get.timestamp())));
}

var nowDate = new m.exDate().get.timestamp();
localStorage.setItem("lastdate", nowDate);
