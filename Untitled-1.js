d3.csv("data.csv").then(data => {
    data.forEach(d => {
        d.year = +d.year; 
        d.average_price = +d.average_price; 
    });

    console.log(data);

    const nestedData = d3.group(data, d => d.flat_type);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.average_price)])
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    nestedData.forEach((values, key) => {
        svg.append("path")
            .datum(values)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", colorScale(key))
            .attr("d", d3.line()
                .x(d => xScale(d.year))
                .y(d => yScale(d.average_price))
            );
    });

    const legend = svg.selectAll(".legend")
        .data(nestedData.keys())
        .enter().append("g")
        .attr("transform", (d, i) => `translate(${width + 10}, ${i * 20})`);

    legend.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", d => colorScale(d));

    legend.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(d => d);
});
