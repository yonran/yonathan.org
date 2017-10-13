const width = 600
const height = 350
const margin = {top:50, left:80, bottom:30, right:30}

const personRectStroke = 3
const arrowStrokeWidth = 5
const arrowMarkerWidth = 2  // = markerWidth tip of the arrow past the end of the path

const svg = d3.select(window.document).select("body").append("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", margin.left + width + margin.right)
    .attr("height", margin.top + height + margin.bottom)
    .attr("title", "Property value trajectory")
    .attr("desc", "Property market value, factored base year value, and assessed value over time")
const defs = svg.append("defs")
defs.selectAll("marker.arrowhead")
    .data(["principal"])
    .enter()
    .append("marker")
    .attr("id", "Triangle")
    .attr("class", clazz => `arrowhead ${clazz}`)
    .attr("viewBox", `0 0 6 10`)
    .attr("refX", 0)
    .attr("refY", 5)
    .attr("markerUnits", "strokeWidth")
    .attr("markerWidth", arrowMarkerWidth)  // markerWidth/markerHeight ratio should match viewBoxWidth/viewBoxHeight
    .attr("markerHeight", arrowMarkerWidth*10/6) // or else the greater dimension will be ignored
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 L 6 5 L 0 10 z")

const style = svg.append("style")
    .attr("type", "text/css")
    .text(`
.title {
    font-size: 22px;
    font-family: sans-serif;
    font-weight: bold;
}
.person rect {
    fill: white;
    stroke: black;
    stroke-width: ${personRectStroke};
}
.person text {
    font-size: 15px;
    font-family: sans-serif;
}
.generationLine path {
    stroke: lightgray;
    stroke-width: 3;
    fill: none;
}
.arrow {
    stroke: black;
    stroke-width: ${arrowStrokeWidth};
    fill: none;
    marker-end: url(#Triangle);
}
.arrow.principal {
    stroke: blue;
}
.arrowhead.principal {
    fill: blue;
}
.horizontal-grid-line,.vertical-grid-line {stroke:none;/*lightgray*/}
`)

const tree = {

}


const main = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

main.selectAll(".vertical-grid-line")
    .data(d3.range(0, width, 10))
    .enter()
    .append("path")
    .attr("class", "vertical-grid-line")
    .attr("d", x => `M ${x},0 L${x},${height}`)
main.selectAll(".horizontal-grid-line")
    .data(d3.range(0, height, 10))
    .enter()
    .append("path")
    .attr("class", "horizontal-grid-line")
    .attr("d", y => `M 0,${y} L${width},${y}`)

const personDx = 70
const generationDy = 80
const people = [
    {
        name: "Mom",
        x: 130,
        y: 130 - generationDy,
    },
    {
        name: "oldbro",
        text: "Brother",
        x: 130 - personDx * 1,
        y: 130,
        parent: "Mom",
    },
    {
        name: "midbro",
        text: "Brother",
        x: 130,
        y: 130,
        parent: "Mom",
    },
    {
        name: "Sister",
        x: 130 + personDx * 1,
        y: 130,
        parent: "Mom",
    },
]
const peopleMap = people.reduce((map, person) => {map[person.name] = person; return map}, new Map())
const generationLines = people.reduce((accumulator, {parent, x, y}) => {
    if (parent != null) {
        let line = accumulator.get(parent)
        if (line == null) {
            line = {
                parentX: peopleMap[parent].x,
                parentY: peopleMap[parent].y,
                children: [],
            }
            accumulator.set(parent, line)
        }
        line.children.push({x: x, y: y})
    }
    return accumulator
}, new Map())
const generationLineGroups = main.selectAll("g.generationLine").data(Array.from(generationLines.values()))
    .enter()
    .append("g")
    .attr("class", "generationLine")
generationLineGroups.selectAll("line.tochild")
    .data(({parentX, parentY, children}) => children.map(child => ({parentX, parentY, x: child.x, y: child.y})))
    .enter()
    .append("path")
    .attr("d", ({parentX, parentY, x, y}) => d3.line()([
        [parentX, parentY],
        [parentX, parentY + generationDy/2],
        [x, parentY + generationDy/2],
        [x, y],
    ]))

const personRectSize = {width: 60, height: 30}
const personRectHeight = 30
const peopleGroups = main.selectAll("g.person").data(people)
    .enter()
    .append("g")
    .attr("class", "person")
    .attr("transform", person => `translate(${person.x}, ${person.y})`)
peopleGroups.append("rect")
    .attr("x", -30)
    .attr("y", -15)
    .attr("width", personRectSize.width)
    .attr("height",  personRectSize.height)
    .attr("rx", 5)
    .attr("ry", 5)
peopleGroups.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .text(person => person.text || person.name)

main.append("path")
    .attr("class", "arrow principal")
    .attr("d", 
        // d3.line()
        //     .curve(d3.curveBasis)
        //     ([
        //         [peopleMap["Mom"].x - personRectSize.width/2 - personRectStroke/2, peopleMap["Mom"].y],
        //         [peopleMap["Mom"].x - personDx * 1/2, 130-generationDy + generationDy/4 - arrowLength/2],
        //         [peopleMap["Mom"].x - personDx * 1, 130 - arrowLength - personRectSize.height/2],
        //     ])
        `M${peopleMap["Mom"].x - personRectSize.width/2 - personRectStroke/2}, ${peopleMap["Mom"].y}
        C ${peopleMap["Mom"].x - personRectSize.width/2 - personRectStroke/2 - 20}, ${peopleMap["Mom"].y}
        ${peopleMap["oldbro"].x - 10}, ${peopleMap["oldbro"].y - personRectSize.height/2 - personRectStroke/2 - arrowStrokeWidth*arrowMarkerWidth - 20}
        ${peopleMap["oldbro"].x - 10}, ${peopleMap["oldbro"].y - personRectSize.height/2 - personRectStroke/2 - arrowStrokeWidth*arrowMarkerWidth}
        `
        // - arrowStrokeWidth*arrowMarkerWidth
    )
// main.append("path")
//     .attr("class", "arrow")
//     .attr("d", "M20,70 T80,100 T160,80 T200,90")
