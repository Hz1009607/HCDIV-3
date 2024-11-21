// 设置画布大小和边距
const margin = { top: 50, right: 200, bottom: 50, left: 60 }; // 增加右边距以腾出空间
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data2.csv").then(data => {
    data.forEach(d => {
        d.year = +d.year;
        d.average_price = +d.average_price;
    });

    const nestedData = d3.group(data, d => d.flat_type);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.average_price)])
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // 添加 X 轴
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "black")
        .attr("class", "axis-label")
        .text("Year");

    // 添加 Y 轴
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("transform", "rotate(-90)")
        .attr("fill", "black")
        .attr("class", "axis-label")
        .text("Average Price (SGD)");

    // 绘制折线图
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

        // 为每条折线添加图例标签
        svg.append("text")
            .attr("x", width + 10)
            .attr("y", yScale(values[values.length - 1].average_price))
            .attr("fill", colorScale(key))
            .attr("font-size", "12px")
            .text(key);
    });

    // 添加图例
    const legend = svg.selectAll(".legend")
        .data(nestedData.keys())
        .enter().append("g")
        .attr("transform", (d, i) => `translate(${width + 20}, ${i * 20})`); // 调整图例布局，增加间距

    legend.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", d => colorScale(d))
        .attr("y", -12); // 调整矩形位置以对齐文字

    legend.append("text")
        .attr("x", 20) // 增加文字与矩形的水平间隔
        .attr("y", 0) // 调整文字对齐
        .style("dominant-baseline", "middle") // 确保文字垂直居中
        .text(d => d);
});
