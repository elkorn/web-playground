var svg = d3.select("#circle");

var tau = 2 * Math.PI;

svg.attr('viewBox', '0 0 100 100');

function range(start, n) {
    return d3.range(n).map(function(i) {
        return start + i;
    });
}

function arc(radius, width, style) {
    return {
        d: d3.svg.arc()
            .innerRadius(radius)
            .outerRadius(radius + width),
        style: style
    };
}

function circle(radius, width, style) {
    var a = arc(radius, width, style);

    return {
        d: a.d
            .startAngle(0)
            .endAngle(tau),
        style: a.style
    };
}

function arcTween(transition, newAngle, width, arc) {
    transition.attrTween('d', function(d) {
        var interpolateStart = d3.interpolate(d.startAngle, newAngle * tau);
        var interpolateEnd = d3.interpolate(d.endAngle, (newAngle + width) * tau);
        return function(t) {
            d.startAngle = interpolateStart(t);
            d.endAngle = interpolateEnd(t);
            return arc(d);
        };
    });
}

function outerIndicator(max) {
    var sliderWidth = 0.127;
    var outerIndicator = svg.append("g");
    outerIndicator.classed('outer-indicator', true);
    var outerIndicatorArc =
        d3.svg.arc()
        .innerRadius(max - 2)
        .outerRadius(max);

    var outerIndicatorBg = outerIndicator.append('path').attr({
        d: d3.svg.arc()
            .innerRadius(max - 2)
            .outerRadius(max)
            .startAngle(.1 * tau)
            .endAngle(.8 * tau),
        transform: 'rotate(-30, 50, 50) translate(50,50)'
    }).style({
        fill: 'rgba(255,255,255,0.1)'
    });

    var outerIndicatorSlider = outerIndicator
        .append('path')
        .datum({
            startAngle: .1 * tau,
            endAngle: (.1 + sliderWidth) * tau
        })
        .style({
            fill: 'rgba(255,255,255,0.4)'
        })
        .attr({
            'd': outerIndicatorArc,
            transform: 'rotate(-30, 50, 50) translate(50,50)'
        });

    setInterval(function() {
        outerIndicatorSlider.transition().duration(750).call(arcTween, Math.max(.1, Math.min(Math.random(), .8 - sliderWidth)), sliderWidth, outerIndicatorArc);
    }, 750);
}

function outerSlider(max) {

    var highlightStart = .11;
    var highlightEnd = .43;

    var outerSlider = svg.append('g');
    outerSlider.classed('outer-slider', true);
    var outerSliderHighlight = outerSlider.append('g');
    outerSliderHighlight.classed('outer-slider-highlight', true);

    var outerSliderHighlightOuterBorderArc = arc(max, 1, {
        fill: 'rgba(255,255,255,0.4)'
    });

    var outerSliderHighlightBgArc = arc(max - 3, 3, {
        fill: 'rgba(255,255,255,0.1)'
    });

    var outerSliderHighlightInnerBorderArc = arc(max - 4, 1, {
        fill: 'rgba(255,255,255,0.4)'
    });

    var smallSegmentsCount = 5;
    var highlightWidth = highlightEnd - highlightStart;

    var scale = d3.scale.ordinal().domain(d3.range(smallSegmentsCount)).rangeBands([highlightStart, highlightEnd], .9);

    var smallSegmentArcs = range(1, smallSegmentsCount).map(function() {
        return arc(42, 1, {
            fill: 'rgba(255,255,255,0.7)'
        });
    });

    var outerSliderHighlightPaths = [outerSliderHighlightOuterBorderArc,
                                     outerSliderHighlightBgArc,
                                     outerSliderHighlightInnerBorderArc
                                    ].map(function(arc) {
                                        return outerSliderHighlight.append('path')
                                            .datum({
                                                startAngle: highlightStart * tau,
                                                endAngle: highlightEnd * tau,
                                            }).attr({
                                                d: arc.d,
                                                transform: 'rotate(-30, 50, 50) translate(50,50)'
                                            }).style(arc.style);
                                    });

    var smalls = smallSegmentArcs.map(function(arc, i) {
        // console.log((highlightStart + i * smallSegmentWidth + i * smallSegmentPadding), (highlightStart + i * smallSegmentPadding + (i + 1) * smallSegmentWidth));
        return outerSliderHighlight.append('path')
            .datum({
                startAngle: scale(i) * tau,
                endAngle: (scale(i) + scale.rangeBand()) * tau
                // startAngle: (highlightStart + i * smallSegmentPadding + i * smallSegmentWidth) * tau,
                // endAngle: (highlightStart + i * smallSegmentPadding + (i + 1) * smallSegmentWidth) * tau
            }).attr({
                d: arc.d,
                transform: 'rotate(-30, 50, 50) translate(50,50)'
            }).style(arc.style);
    });
}

function innerCoordinateCircle(max) {
    var circleElement = svg.append('g').attr({
        transform: 'translate(50,50)'
    });

    circleElement.classed('inner-coordinate-circle');

    var c = circle(max-1, 1, {
        fill: 'rgba(255,255,255,0.4)'
    });

    circleElement.append('path').attr({
        d: c.d,
    }).style(c.style);
}

outerIndicator(50);
outerSlider(44);
innerCoordinateCircle(38);
