/*!
* jquery.counterup.js 1.0
*
* Copyright 2013, Benjamin Intal http://gambit.ph @bfintal
* Released under the GPL v2 License
*
* Date: Nov 26, 2013
*/
(function(e) {
    "use strict";
    
    e.fn.counterUp = function(t) {
        var n = e.extend({ time: 400, delay: 10 }, t);

        return this.each(function() {
            var t = e(this);
            var r = n;

            var i = function() {
                var e = [];
                var n = r.time / r.delay;
                var i = t.text();
                var s = /[0-9]+,[0-9]+/.test(i);  // Check for commas in numbers

                i = i.replace(/,/g, "");  // Remove commas from the text

                var o = /^[0-9]+$/.test(i);
                var u = /^[0-9]+\.[0-9]+$/.test(i);
                var a = u ? (i.split(".")[1] || []).length : 0;

                for (var f = n; f >= 1; f--) {
                    var l = parseInt(i / n * f);

                    if (u) l = parseFloat(i / n * f).toFixed(a);

                    if (s) {
                        while (/(\d+)(\d{3})/.test(l.toString())) {
                            l = l.toString().replace(/(\d+)(\d{3})/, "$1,$2");
                        }
                    }

                    e.unshift(l);  // Push values into the array in reverse order
                }

                t.data("counterup-nums", e);  // Store counter-up numbers in data attribute
                t.text("0");

                var c = function() {
                    var counterNums = t.data("counterup-nums");

                    // Check if the counterNums array is valid before calling shift()
                    if (counterNums && counterNums.length > 0) {
                        t.text(counterNums.shift());
                        setTimeout(t.data("counterup-func"), r.delay);
                    } else {
                        console.error("No counter-up numbers to shift.");
                        t.data("counterup-nums", null);  // Clean up
                        t.data("counterup-func", null);
                    }
                };

                t.data("counterup-func", c);
                setTimeout(t.data("counterup-func"), r.delay);
            };

            t.waypoint(i, { offset: "100%", triggerOnce: !0 });
        });
    };

})(jQuery);
