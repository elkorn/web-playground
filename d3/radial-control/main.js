var svg = d3.select("#circle");

var tau = 2 * Math.PI;

var viewBoxSize = 120;
var viewBoxCenter = viewBoxSize / 2;

svg.attr('viewBox', '0 0 ' + viewBoxSize + ' ' + viewBoxSize);


var svgSize = svg.node().getBoundingClientRect();

// Rotation - rotate g's in CSS

function range(start, n) {
    return d3.range(n).map(function(i) {
        return start + i;
    });
}

function rotateTranslate(deg) {
    return 'rotate(' + deg + ', ' + viewBoxCenter + ', ' + viewBoxCenter + ') translate(' + viewBoxCenter + ', ' + viewBoxCenter + ')';
}

function translateRotate(deg) {
    return transCenter() + 'rotate(' + deg + ', ' + viewBoxCenter + ', ' + viewBoxCenter + ')';
}

function transCenter() {
    return 'translate(' + viewBoxCenter + ', ' + viewBoxCenter + ') ';
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

function rotateTween(transition, newAngle, translation) {
    transition.attrTween('transform', function(d) {
        var interpolate = d3.interpolate(d.rotation || 0, newAngle % 361);

        return function(t) {
            d.rotation = interpolate(t);
            return 'translate(' + (translation || 0) + ', ' + (translation || 0) + ') rotate(' + d.rotation + ')';
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

function rotate(selector, howMuch) {
    var half = svg.width / 2;
    var halfPx = half + 'px';
    console.log('setting style');
    document.querySelector(selector).style.setProperty('transform', 'rotate(' + howMuch % 361 + 'deg) translate(' + halfPx + ', ' + halfPx + ')');
    document.querySelector(selector).style.setProperty('transform-origin', halfPx + ', ' + halfPx);

    console.log(document.querySelector(selector).style.transform);
}

function outerIndicator(max) {
    var sliderWidth = 0.127;
    var outerIndicator = svg.append("g").attr({
    });
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
        transform: rotateTranslate(-30)
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
            transform: rotateTranslate(-30)
        });

    return outerIndicator;
}

function outerSlider(max) {

    var highlightStart = .11;
    var highlightEnd = .43;

    var outerSlider = svg.append('g').attr({
        transform: transCenter()
    });
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
                                                transform: rotateTranslate(-30)
                                            }).style(arc.style);
                                    });

    var smalls = smallSegmentArcs.map(function(arc, i) {
        return outerSliderHighlight.append('path')
            .datum({
                startAngle: scale(i) * tau,
                endAngle: (scale(i) + scale.rangeBand()) * tau
            }).attr({
                d: arc.d,
                transform: rotateTranslate(-30)
            }).style(arc.style);
    });

    var paddingArc = arc(max - 5.2, 0.7, outerSliderHighlightOuterBorderArc.style);

    outerSliderHighlight.append('path')
        .datum({
            startAngle: -0.1 * tau,
            endAngle: 0.1 * tau,
        }).attr({
            d: paddingArc.d
        }).style(paddingArc.style);

    outerSliderHighlight.append('path')
        .datum({
            startAngle: 0.4 * tau,
            endAngle: 0.6 * tau,
        }).attr({
            d: paddingArc.d,
        }).style(paddingArc.style);
}

function innerCoordinateCircle(max) {
    var circleElement = svg.append('g').attr({
        transform: transCenter()
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
            fill: 'rgba(255,255,255,0.4)'
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
    var container = svg.append('g')
        .datum({
            rotation: 0
        })
        .attr({
            transform: transCenter()
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

    // CROSSHAIR
    var crosshairContainer = svg.append('g').datum({
        rotation: 0
    }).attr({
        transform: transCenter()
    });
    var innerCircle = circle(max - 19, 0.5, {
        fill: 'rgba(255,255,255,0.2)'
    });

    crosshairContainer.append('path').attr({
        d: innerCircle.d,
    }).style(innerCircle.style);

    crosshairContainer.classed('crosshair-container', true);
    crosshairContainer.append('line').attr({
        x1: 0,
        x2: 0,
        y1: -1.5,
        y2: 1.5
    }).style({
        stroke: 'rgba(255,255,255,0.4)',
        'stroke-width': 0.75,
    });

    crosshairContainer.append('line').attr({
        x1: -1.5,
        x2: 1.5,
        y1: 0,
        y2: 0
    }).style({
        stroke: 'rgba(255,255,255,0.4)',
        'stroke-width': 0.75,
    });

    crosshairContainer.append('line').attr({
        y1: 4,
        y2: 5.5,
        x1: 0,
        x2: 0
    }).style({
        stroke: 'rgba(255,255,255,0.4)',
        'stroke-width': 0.75,
    });

    crosshairContainer.append('line').attr({
        y1: -5.5,
        y2: -4,
        x1: 0,
        x2: 0
    }).style({
        stroke: 'rgba(255,255,255,0.4)',
        'stroke-width': 0.75,
    });

    crosshairContainer.append('line').attr({
        x1: 4,
        x2: 5.5,
        y1: 0,
        y2: 0
    }).style({
        stroke: 'rgba(255,255,255,0.4)',
        'stroke-width': 0.75,
    });

    crosshairContainer.append('line').attr({
        x1: -5.5,
        x2: -4,
        y1: 0,
        y2: 0
    }).style({
        stroke: 'rgba(255,255,255,0.4)',
        'stroke-width': 0.75,
    });

    setInterval(function() {
        container.transition().duration(750).call(rotateTween, Math.random() * 30, viewBoxCenter);
    }, 750);

    return {
        container, crosshairContainer
    };
}

function pin(container, max, rotation) {
    var group = container.append('g');
    group.attr({
        transform: rotateTranslate(rotation)
    });
    group.classed('pin', true);

    group.append('line').attr({
        x1: 15,
        y1: 0,
        x2: max - 2,
        y2: 0,
    }).style({
        stroke: 'rgba(255,255,255,0.2)',
        'stroke-width': 0.5
    });

    group.append('circle').attr({
        cx: max - 1,
        cy: 0,
        r: 1,
    }).style({
        fill: 'rgba(255,255,255,0.2)',
    });

    return group;
}

function guideCircle(container, max) {
    return container.append('circle').attr({
        cx: viewBoxCenter,
        cy: viewBoxCenter,
        r: max - 1
    }).style({
        fill: 'none',
        stroke: 'rgba(255,255,255,0.1)',
        'stroke-width': 0.5
    });
}

function guideLine(container, max, rotation) {
    return container.append('line').attr({
        x1: 15,
        y1: 0,
        x2: max - 2,
        y2: 0,
        transform: rotateTranslate(rotation)
    }).style({
        stroke: 'rgba(255,255,255,0.2)',
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
guideLine(svg, 60, 50);
guideLine(svg, 60, 190);
guideLine(svg, 60, 270);
