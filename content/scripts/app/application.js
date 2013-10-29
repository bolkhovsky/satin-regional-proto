// Some general UI pack related JS
// Extend JS String with repeat method
String.prototype.repeat = function(num) {
    return new Array(num + 1).join(this);
};

(function ($) {
    // Add segments to a slider
    $.fn.addSliderSegments = function (amount) {
        return this.each(function () {
            var segmentGap = 100 / (amount - 1) + "%"
              , segment = "<div class='ui-slider-segment' style='margin-left: " + segmentGap + ";'></div>";
            $(this).prepend(segment.repeat(amount - 2));
        });
    };

    $(function () {
        $('section:first').height($(window).height() - $('nav').height());
        $('section:not(:first)').height($(window).height());
    });

    function rebindSliders() {
        var $slider = $(".ui-slider");
        if ($slider.length) {
            $slider.slider({
                min: 0,
                max: 10,
                value: 10,
                orientation: "horizontal",
                range: "min"
            }).addSliderSegments($slider.slider("option").max);
        }
    }

    define(["require", "exports"], function (require, exports) {
        exports.rebindSliders = rebindSliders;
    });

})(jQuery);