// 设置画布大小和边距
const margin = { top: 50, right: 150, bottom: 50, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// 创建 SVG 容器
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// 加载 CSV 数据
d3.csv("data2.csv").then(data => {
    // 数据清理与转换
    data.forEach(d => {
        d.year = +d.year; // 确保年份为数字
        d.average_price = +d.average_price; // 确保价格为数字
    });

    // 按房型分组数据
    const nestedData = d3.group(data, d => d.flat_type);

    // 定义 X 和 Y 轴比例尺
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year)) // 自动获取年份范围
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.average_price)]) // 自动获取最大价格
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // 定义颜色

    // 添加 X 轴
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d"))) // 确保年份显示为整数
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
