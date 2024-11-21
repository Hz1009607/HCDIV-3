// 修改图表边距，增加左侧空间
const margin = { top: 50, right: 100, bottom: 50, left: 70 }; // 原 margin.left 由 50 调整为 70
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// 加载 CSV 数据
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

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format(".2s")); // 使用简短格式，例如 300K, 900K

    // 添加 X 轴
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    // 添加 Y 轴
    svg.append("g")
        .call(yAxis);

    // 添加 Y 轴标签
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20) // 调整位置以避免重叠
        .style("text-anchor", "middle")
        .text("Average Price (SGD)");

    // 绘制折线图
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
