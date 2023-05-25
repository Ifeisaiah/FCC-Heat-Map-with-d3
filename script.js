let baseTemp;
let values = [];

let xScale;
let yScale;

let width = 1200;
let height = 600;
let padding = 60;

let minYear;
let maxYear;

let svg = d3.select('svg')
.attr('width', width)
.attr('height', height)

let generateScales = () => {
  minYear = d3.min(values, (item) => {
              return item.year;
            })

  maxYear = d3.max(values, (item) => {
            return item.year;
          })

  xScale = d3.scaleLinear()
            .domain([minYear, maxYear + 1])
            .range([padding, width-padding])

  yScale = d3.scaleTime()
            .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
            .range([padding, height - padding])
}
let drawCells = () => {

  let tooltip = d3.select('#tooltip');

  svg.selectAll('rect')
    .data(values)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('fill', (item) => {
    let  variance = item.variance;
    if (variance <= -1) {
      return '#accbe1'
    }
    else if (variance <= 0) {
      return '#ff7f51'
    } else if (variance <= 1) {
      return '#efcb68'
    } else {
      return '#bf0603'
    }
  })
    .attr('data-year', (item) => {
    return item.year
  })
    .attr('data-month', (item) => {
    return item.month - 1
  })
    .attr('data-temp', (item) => {
    return baseTemp + item.variance
  })
    .attr('height', (height - 2 * padding) / 12)
    .attr('y', (item) => {
    return yScale(new Date(0, item.month - 1, 0, 0, 0, 0, 0))
  })
    .attr('width', (item) => {
    let numOfYears = maxYear - minYear;
    return (width - (2* padding)) / numOfYears
  })
    .attr('x', (item) => {
    return xScale(item.year)
  })
    .on('mouseover', (item, index) => {
    let months = [
      'January',
      'Feburary',
      'March',
      'Apirl',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'Demember'
    ]
    tooltip.style('visibility', 'visible')
          .html(`${index.year}- ${months[index.month - 1]}<br />${baseTemp + index.variance} <br /> ${index.variance}`)
          .attr('data-year', index.year)

  })
    .on('mouseout', (item) => {
        tooltip.style('visibility', 'hidden')
  })
}   

let drawAxis = () => {
let xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'));

  svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height - padding})`)
  
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'));

  svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`)
}

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
  .then(res => res.json())
  .then(data => {
  baseTemp = data.baseTemperature;
  values = data.monthlyVariance;
  generateScales()
  drawCells()
  drawAxis()
})
