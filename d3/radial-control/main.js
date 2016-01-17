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

function drawCircle(container, circle) {
    container.append('path').attr({
        d: circle.d,
    }).style(circle.style);
}

function drawArc(container, arc, start, end) {
    container.append('path').datum({
        startAngle: start * tau,
        endAngle: end * tau,
    }).attr({
        d: arc.d
    }).style(arc.style);
}

function outerIndicator(max) {
    var sliderWidth = 0.127;
    var outerIndicator = svg.append("g").classed('outer-indicator', true);
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

    var outerSlider = svg.append('g').classed('outer-slider', true);
    var outerSliderHighlight = outerSlider.append('g').classed('outer-slider-highlight', true);

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
        return outerSliderHighlight.append('path')
            .datum({
                startAngle: scale(i) * tau,
                endAngle: (scale(i) + scale.rangeBand()) * tau
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

    var c = circle(max - 1, 1, {
        fill: 'rgba(255,255,255,0.4)'
    });

    circleElement.append('path').attr({
        d: c.d,
    }).style(c.style);

    var numberOfTicks = 24;
    var tickSize = 2;
    var tickScale = d3.scale.ordinal().domain(d3.range(numberOfTicks)).rangeBands([0, 1]);

    var ticks = d3.range(numberOfTicks).map(function(i) {
        return circleElement.append('line').attr({
            x1: 0,
            y1: 0,
            x2: tickSize,
            y2: 0,
            transform: 'rotate(' + (tickScale(i) * 360) + ') translate(' + (max - tickSize - 1) + ',0)'
        })
            .style({
                stroke: 'rgba(255,255,255,0.4)'
            });
    });

    var smallSegmentsCount = 24;

    var scale = d3.scale.ordinal().domain(d3.range(smallSegmentsCount)).rangeBands([0, 1], 0.9);

    var smallSegmentArcs = range(1, smallSegmentsCount).map(function() {
        return arc(max - 7, 1, {
            fill: 'rgba(255,255,255,0.7)'
        });
    });

    var smalls = smallSegmentArcs.map(function(arc, i) {
        return circleElement.append('path')
            .datum({
                startAngle: scale(i) * tau,
                endAngle: (scale(i) + scale.rangeBand()) * tau
            }).attr({
                d: arc.d,
            }).style(arc.style);
    });

    function barArc(start, width) {
        return {
            background: arc(start, width, {
                fill: 'rgba(255,255,255,0.4)'
            }),
            foreground: arc(start + 1, width - 2, {
                fill: 'rgba(255,255,255,0.7)'
            })
        };
    }

    var barsCount = 12;
    var barBgScale = d3.scale.ordinal().domain(d3.range(barsCount))
        .rangeBands([0.5, 1]);
    var barFgScale = d3.scale.ordinal().domain(d3.range(barsCount))
        .rangeBands([0.5, 1], .1);
    var bars = d3.range(barsCount).map(function(i) {
        var arc = barArc(max - 9, 4);
        circleElement.append('path')
            .datum({
                startAngle: barBgScale(i) * tau,
                endAngle: (barBgScale(i) + barBgScale.rangeBand()) * tau
            })
            .attr({
                d: arc.background.d
            }).style(arc.background.style);
        circleElement.append('path')
            .datum({
                startAngle: barFgScale(i) * tau,
                endAngle: (barFgScale(i) + barFgScale.rangeBand()) * tau
            })
            .attr({
                d: arc.foreground.d
            }).style(arc.foreground.style);
    });
}

function innerCircle(max) {
    var container = svg.append('g').attr({
        transform: 'translate(50,50)'
    });

    container.classed('inner-circle');

    var outerCircle = circle(max - 1, 1, {
        fill: 'rgba(255,255,255,0.4)'
    });

    drawCircle(container, outerCircle);

    var mediumCircle = circle(max - 16, 0.5, {
        fill: 'rgba(255,255,255,0.2)'
    });

    drawCircle(container, mediumCircle);

    var circleBreak = arc(max - 16.2, 1, {
        fill: '#111'
    });

    drawArc(container, circleBreak, 0.47, 0.53);

    container.append('line').attr({
        x1: 8,
        y1: 0,
        x2: max - 1,
        y2: 0,
        transform: 'rotate(90)'
    }).style({
        stroke: 'rgba(255,255,255,0.2)',
    });

    container.append('line').attr({
        x1: 8,
        y1: 0,
        x2: 14,
        y2: 0,
        transform: 'rotate(90)'
    }).style({
        stroke: 'rgba(255,255,255,0.4)',
    });

    var innerCircle = circle(max - 19, 0.5, {
        fill: 'rgba(255,255,255,0.2)'
    });

    container.append('path').attr({
        d: innerCircle.d,
    }).style(innerCircle.style);

    // CROSSHAIR
    container.append('line').attr({
        x1: 0,
        x2: 0,
        y1: -1.5,
        y2: 1.5
    }).style({
        stroke: 'rgba(255,255,255,0.4)',
        'stroke-width': 0.75,
    });

    container.append('line').attr({
        x1: -1.5,
        x2: 1.5,
        y1: 0,
        y2: 0
    }).style({
        stroke: 'rgba(255,255,255,0.4)',
        'stroke-width': 0.75,
    });

    container.append('line').attr({
        y1: 4,
        y2: 5.5,
        x1: 0,
        x2: 0
    }).style({
        stroke: 'rgba(255,255,255,0.4)',
        'stroke-width': 0.75,
    });

    container.append('line').attr({
        y1: -5.5,
        y2: -4,
        x1: 0,
        x2: 0
    }).style({
        stroke: 'rgba(255,255,255,0.4)',
        'stroke-width': 0.75,
    });

    container.append('line').attr({
        x1: 4,
        x2: 5.5,
        y1: 0,
        y2: 0
    }).style({
        stroke: 'rgba(255,255,255,0.4)',
        'stroke-width': 0.75,
    });

    container.append('line').attr({
        x1: -5.5,
        x2: -4,
        y1: 0,
        y2: 0
    }).style({
        stroke: 'rgba(255,255,255,0.4)',
        'stroke-width': 0.75,
    });
}

function pin(container, max, rotation) {
    var group = container.append('g');
    group.classed('pin', true);

    group.append('line').attr({
        x1: 15,
        y1: 0,
        x2: max - 2,
        y2: 0,
        transform: 'translate(50,50) rotate(' + rotation + ')'
    }).style({
        stroke: 'rgba(255,255,255,0.2)',
        'stroke-width': 0.5
    });

    group.append('circle').attr({
        cx: max - 1,
        cy: 0,
        r: 1,
        transform: 'translate(50,50) rotate(' + rotation + ')'
    }).style({
        fill: 'rgba(255,255,255,0.2)',
    });
}

function guideCircle(container, max) {
    container.append('circle').attr({
        cx: 50,
        cy: 50,
        r: max - 1
    }).style({
        fill: 'none',
        stroke: 'rgba(255,255,255,0.1)',
        'stroke-width': 0.5
    });
}

guideCircle(svg, 49);
guideCircle(svg, 46);
guideCircle(svg, 41);
outerIndicator(50);
outerSlider(44);
innerCoordinateCircle(38);
innerCircle(25);
pin(svg, 50, 45);
pin(svg, 50, 75);
