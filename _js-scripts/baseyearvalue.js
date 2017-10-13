const width = 600
const height = 350
const margin = {top:50, left:80, bottom:30, right:30}

const data = []
for (let i = 1987; i <= 2017; i++) {
    data.push({year: i})
}
const marketvalues = {
    1987: 170000,
    1989: 250000,
    1990: 250000,
    1991: 220000,
    1993: 150000,
    1995: 150000,
    1996: 155000,
    2000: 310000,
    2001: 300000,
    2002: 300000,
    2004: 530000,
    2005: 600000,
    2007: 650000,
    2008: 630000,
    2009: 600000,
    2011: 620000,
    2012: 680000,
    2015: 950000,
    2017: 1000000,
}
// inflation factors from
// http://www.boe.ca.gov/proptaxes/pdf/lta16055.pdf
const inflationFactors = {
    2017: 1.02,
    2016: 1.01525,
    2015: 1.01998,
    2014: 1.00454,
    2013: 1.02,
    2012: 1.02,
    2011: 1.00753,
    2010: .99763,
    2009: 1.02,
    2008: 1.02,
    2007: 1.02,
    2006: 1.02,
    2005: 1.02,
    2004: 1.01867,
    2003: 1.02,
    2002: 1.02,
    2001: 1.02,
    2000: 1.02,
    1999: 1.01853,
    1998: 1.02,
    1997: 1.02,
    1996: 1.0111,
    1995: 1.0119,
    1994: 1.02,
    1993: 1.02,
    1992: 1.02,
    1991: 1.02,
    1990: 1.02,
    1989: 1.02,
    1988: 1.02,
    1987: 1.02,
    1986: 1.02,
    1985: 1.02,
    1984: 1.02,
    1983: 1.01,
    1982: 1.02,
    1981: 1.02,
    1980: 1.02,
    1979: 1.02,
    1978: 1.02,
    1977: 1.02,
    1976: 1.02,
}

data[0].transferFrac = 1
// data[20].transferFrac = 2/3

for (i in marketvalues) {
    data.filter(d => d.year == +i)[0].marketvalue = marketvalues[i]
}

let lastMarketIdx = null
for (let i = 0; i < data.length; i++) {
    if (data[i].marketvalue != null) {
        if (lastMarketIdx != null) {
            const lastMarketValue = data[lastMarketIdx].marketvalue
            const lastMarketYear = data[lastMarketIdx].year
            const marketvalue = data[i].marketvalue
            const year = data[i].year
            for (let j = lastMarketIdx + 1; j < i; j++) {
                data[j].marketvalue = marketvalue * (j - lastMarketIdx)/(i - lastMarketIdx) + lastMarketValue * (1 - (j - lastMarketIdx)/(i - lastMarketIdx))
            }
        }
        lastMarketIdx = i
    }
}
for (let i = 0; i < data.length; i++) {
    if (data[i].transferFrac === 1) {
        data[i].factoredvalue = data[i].marketvalue
    } else {
        const transferFrac = +data[i].transferFrac || 0
        const inflationFactor = inflationFactors[data[i].year] != null ? inflationFactors[data[i].year] : 1.02
        data[i].factoredvalue = transferFrac * data[i].marketvalue +
            (1-transferFrac) * data[i-1].factoredvalue * Math.pow(inflationFactor, data[i].year - data[i-1].year)
    }
}

for (let i = 0; i < data.length; i++) {
    data[i].assessedvalue = Math.min(data[i].factoredvalue, data[i].marketvalue)
}

// const x = d3.time.scale().range([0, width])
// scale is a function that maps the data domain (e.g. [1990, 2017] to the range [0, width])
// it also has methods ticks and tickFormat; e.g. x.ticks(5)
const x = d3.scaleLinear().range([0, width])
const y = d3.scaleLinear().range([height, 0])

// scale the range of the data
x.domain(d3.extent(data, d => d.year))
y.domain([0, d3.max(data, d => Math.max(d.factoredvalue, d.marketvalue))])

const svg = d3.select(window.document).select("body").append("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", margin.left + width + margin.right)
    .attr("height", margin.top + height + margin.bottom)
svg.append("title")
    .text("Property value trajectory")
svg.append("desc")
    .text("Property market value, factored base year value, and assessed value over time")
const style = svg.append("style")
    .attr("type", "text/css")
    .text(`
.line {
    stroke: steelblue;
    stroke-width: 4;
    fill: none;
}
.factoredvalue {
    fill: #1E73CD;
    stroke: #1E73CD;
}
.marketvalue {
    stroke: #A8A336;
    fill: #A8A336;
}
.assessedvalue {
    stroke: #F6BC47;
    fill: #F6BC47;
}
.linelabel.factoredvalue {
    stroke: none;
}
.linelabel.marketvalue {
    stroke: none;
}
.axis path, .axis line {
    fill: none;
    stroke: grey;
    stroke-width: 1.5;
    shape-rendering: crispEdges;
}
.line {
    fill: none;
}
.linelabel.assessedvalue {
    stroke-width:0;
    /* stroke: black; */
}
.linelabel {
    font-family: sans-serif;
    font-size: 18px;
    font-weight: bold;
}
.title {
    font-size: 22px;
    font-family: sans-serif;
    font-weight: bold;
}

`)

const defs = svg.append("defs")
// height 120% so that shadow is not clipped (120% is the default)
const filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "120%")
filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 2)
    .attr("result", "blur")
filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 2)
    .attr("dy", 2)
    .attr("result", "offsetBlur")
filter.append("feFlood")
    .attr("flood-color", "black")
    .attr("flood-opacity", "0.2")
    .attr("result", "shadow-color")
filter.append("feComposite")
    .attr("in2", "offsetBlur")
    .attr("in", "shadow-color")
    .attr("operator", "in")
    .attr("result", "colored-shadow")

// overlay original SourceGraphic over translated blurred opacity by using
// feMerge filter. Order of specifying inputs is important!
const feMerge = filter.append("feMerge")

feMerge.append("feMergeNode")
    .attr("in", "colored-shadow")
feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic")




const main = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// x axis
// axis is a function that draws the bar, ticks, subticks, and labels
var mainTickValues = d3.range(1990,2020,5)
const xAxis = d3.axisBottom().scale(x)
    // .ticks(5)
    .tickValues(mainTickValues)
    // .tickSubdivide(4)  // how many subticks to put between ticks
    .tickFormat(x => `${x}`)
main.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .attr("font-size", "14px")
    // subticks, based on d3.axis
// Q: why is it translated by 0.5???
main.append("g")
    .attr("class", "x axis subticks")
    .attr("transform", "translate(0," + height + ")")
    .call(selection => {
        const subticks = d3.range(1987,2018).filter(year => -1 == mainTickValues.indexOf(year))
        selection.selectAll(".tick")
            .data(subticks, x)
            .order()
            .enter().append("g").attr("class", "tick")
            .attr("transform", year => `translate(${x(year) + 0.5},0)`)
            .append("line")
            .attr("stroke", "#000")
            .attr("y2", 6)
    })


// main.append("g")
//     .attr("class", "grid")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom().scale(x).ticks(20).tickSize(-height))
//     .selectAll(".tick")
//     .data(x.ticks(5), function(d) { return d; })
//     .exit()
//     .classed("minor", true);
  
// main.append("g")
//     .attr("class", "axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom().scale(x).ticks(5));
  

// y axis
const yAxis = d3.axisLeft().scale(y)
    .ticks(10)
    .tickFormat(x => "$" + d3.format(",")(x))
    //.tickSubdivide(1)
main.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .attr("font-size", "14px")

const graphDataGroup = main
    .append("g")
    .style("filter", "url(#drop-shadow)")    

// d3.line() is a function that returns an "M" string given
// data points, interpolator, tension
const valueLine = d3.line()
    .x(d => x(d.year) + 0.5)
    .y(d => y(d.factoredvalue) + 0.5)
graphDataGroup.append("path")
    .attr("class", "line factoredvalue")
    .attr("d", valueLine(data))

const marketLine = d3.line()
    .x(d => x(d.year) + 0.5)
    .y(d => y(d.marketvalue) + 0.5)
    .curve(d3.curveCardinal)
graphDataGroup.append("path")
    .attr("class", "line marketvalue")
    .attr("d", marketLine(data))

// assessed value dots
graphDataGroup.selectAll("circle.assessedvalue").data(data)
    .enter()
    .append("circle")
    .attr("class", "assessedvalue")
    .attr("cx", d => x(d.year) + 0.5)
    .attr("cy", d => y(d.assessedvalue) + 0.5)
    .attr("r", 5)

const legendDimensions = {
    x: 400,
    y: 200,
    width: 200,
    height: 70,
}
if (false) {
    const legend = main.append("g")
        .attr("transform", "translate(" + legendDimensions.x + "," + legendDimensions.y + ")")
        legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", legendDimensions.width)
        .attr("height", legendDimensions.height)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", "1")
    const legendMarket = legend.append("g")
        .attr("transform", "translate(" + 10 + "," + 10 + ")")
    legendMarket.append("text")
        .text("market value")
        .attr("x", 15)
        .attr("y", 0)
        .attr("dy", "0.32em")
        .attr("text-anchor", "start")
    legendMarket.append("path")
        .attr("class", "line marketvalue")
        .attr("d",
            d3.line()
            .x(d => d)
            .y(d => 0)
            ([0,10]))
    
    const legendFactored = legend.append("g")
        .attr("transform", "translate(" + 10 + "," + 30 + ")")
    legendFactored.append("text")
        .text("factored base year value")
        .attr("x", 15)
        .attr("y", 0)
        .attr("dy", "0.32em")
        .attr("text-anchor", "start")
    legendFactored.append("path")
        .attr("class", "line factoredvalue")
        .attr("d",
            d3.line()
            .x(d => d)
            .y(d => 0)
            ([0,10]))
    
    const legendAssessed = legend.append("g")
        .attr("transform", "translate(" + 10 + "," + 50 + ")")
    legendAssessed.append("text")
        .text("assessed value")
        .attr("x", 15)
        .attr("y", 0)
        .attr("dy", "0.32em")
        .attr("text-anchor", "start")
    legendAssessed.append("circle")
        .attr("class", "assessedvalue")
        .attr("cx", 5)
        .attr("cy", 0)
        .attr("r", 5)
} else {
    svg.append("g")
        .attr("class", "title")
        .attr("transform", `translate(${(margin.left + width  + margin.right)/2}, ${20})`)
        .append("text")
        // .append("tspan")
        .attr("text-anchor", "middle")
        // .attr("dominant-baseline", "hanging")
        .text("Property value trajectory")
    main.selectAll(".linelabel.assessedvalue").data([0])
        .enter()
        .append("g")
        .attr("class", "linelabel assessedvalue")
        .attr("transform", `translate(${x(data[8].year) - 6}, ${y(data[8].assessedvalue) + 8})`)
        .append("text")
        // .append("tspan")
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "hanging")
        .text("assessed value")
    main.selectAll(".linelabel.marketvalue").data([0])
        .enter()
        .append("g")
        .attr("class", "linelabel marketvalue")
        .attr("transform", `translate(${x(data[data.length - 1].year) - 6}, ${y(data[data.length - 1].marketvalue)})`)
        .append("text")
        // .append("tspan")
        .attr("text-anchor", "end")
        .text("market value")
    main.selectAll(".linelabel.factoredvalue").data([0])
        .enter()
        .append("g")
        .attr("class", "linelabel factoredvalue")
        .attr("transform", `translate(${x(data[data.length - 1].year) - 6}, ${y(data[data.length - 1].factoredvalue) - 6})`)
        .append("text")
        // .append("tspan")
        .attr("text-anchor", "end")
        // .attr("dominant-baseline", "hanging")
        .text("factored base year value")
}
