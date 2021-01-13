let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const req = new XMLHttpRequest();

let json;
let values = [];

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

let width = 800;
let height = 600;
let padding = 40;

const svg = d3.select('svg');

let drawCanvas = () => {
    svg.attr('width', width);
    svg.attr('height', height);
}

let generateScales = () => {
    heightScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (d) => {
                        return d[1];
                    })])
                    .range([0, height - (2 * padding)]);
                    
    xScale = d3.scaleLinear()
                    .domain([0, values.length - 1])
                    .range([padding, width - padding]);

    let dates = values.map((d) => {
        return new Date(d[0]);
    })

    xAxisScale = d3.scaleTime()
                   .domain([d3.min(dates), d3.max(dates)])
                   .range([padding, width-padding])

    yAxisScale = d3.scaleLinear()
                   .domain([0, d3.max(values, (d) => {
                       return d[1]                    
                   })])
                   .range([height - padding, padding])

}

let drawBars = () => {
    let bars = d3.select('body')
                 .append('div')
                 .attr('id', 'tooltip')
                 .style('visibility', 'hidden')
                 .style('width', 'auto')
                 .style('height', 'auto')
    
    svg.selectAll('rect')
       .data(values)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('width', (width - (2 * padding)) / values.length)
       .attr('data-date', (d) => {
            return d[0]
       })
       .attr('data-gdp', (d) => {
            return d[1]
       })
       .attr('height', (d) => {
            return heightScale(d[1])
       })
       .attr('x', (d, index) => {
            return xScale(index)
       })
       .attr('y', (d) => {
            return (height - padding) - heightScale(d[1])
       })
       .on('mouseover', (d) => {
           bars.transition()
               .style('visibility', 'visible')
               
               bars.text(d[0] + ' $ ' + d[1]);

               document.querySelector('#tooltip').setAttribute('data-date', d[0])
       })

       .on('mouseout', (d) => {
           bars.transition()
               .style('visibility', 'hidden')
       })

}

let generateAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale);
    let yAxis = d3.axisLeft(yAxisScale);

    svg.append('g')
       .call(xAxis)
       .attr('id', 'x-axis')
       .attr('transform', 'translate(0, ' + (height-padding) + ')');
    
    svg.append('g')
       .call(yAxis)
       .attr('id', 'y-axis')
       .attr('transform', 'translate(' + padding + ', 0)')

}

req.open("GET", url, true);
req.send();
req.onload = function() {
    json = JSON.parse(req.responseText);
    values = json.data;
    console.log(values);
    drawCanvas();
    generateScales();
    drawBars();
    generateAxes();
}

