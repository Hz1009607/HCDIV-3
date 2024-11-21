// Select the chart div and set dimensions
const margin = { top: 50, right: 100, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load the CSV file (make sure it is in the same directory)
d3.csv("data2.csv").then(data => {
    // Parse the data
    data.forEach(d => {
        d.year = +d.year; // Convert year to number
        d.average_price = +d.average_price; // Convert average_price to number
    });

    // Nest data by flat_type
    const nestedData = d3.group(data, d => d.flat_type);

    // Define scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year)) // Get the min and max year
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.average_price)]) // Get the max price
        .range([height, 0]);

    // Define color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Define axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    // Add X-axis
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    // Add Y-axis
    svg.append("g")
        .call(yAxis);

    // Add axis labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .style("text-anchor", "middle")
        .text("Year");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 10)
        .style("text-anchor", "middle")
        .text("Average Price (SGD)");

    // Draw lines for each flat type
    nestedData.forEach((values, key) => {
        svg.append("path")
            .datum(values)
            .attr("fill", "none")
            .attr("stroke", colorScale(key))
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(d => xScale(d.year))
                .y(d => yScale(d.average_price))
            );

        // Add legend
        svg.append("text")
            .attr("x", width + 10)
            .attr("y", yScale(values[values.length - 1].average_price))
            .attr("class", "legend")
            .style("fill", colorScale(key))
            .text(key);
    });
}).catch(error => {
    console.error("Error loading the data: ", error);
});
