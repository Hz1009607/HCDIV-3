const margin = { top: 50, right: 150, bottom: 50, left: 70 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data2.csv").then(data => {
    // 确保年份和价格为数值类型
    data.forEach(d => {
        d.year = +d.year;
        d.average_price = +d.average_price;
    });

    // 获取唯一年份
    const uniqueYears = [...new Set(data.map(d => d.year))];
    uniqueYears.sort((a, b) => a - b); // 按年份排序

    // 设置 X 轴比例尺
    const xScale = d3.scalePoint()
        .domain(uniqueYears)
        .range([0, width])
        .padding(0.5); // 增加点之间的间距

    // 设置 Y 轴比例尺
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.average_price)]) // 最大值为数据中的最大价格
        .range([height, 0]);

    // 定义颜色比例尺
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // 设置 X 轴
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")); // 格式化年份为整数
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)") // 倾斜显示年份以节省空间
        .style("text-anchor", "end");

    // 设置 Y 轴
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2s")); // 简短显示价格
    svg.append("g").call(yAxis);

    // 添加 Y 轴标签
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .style("text-anchor", "middle")
        .text("Average Price (SGD)");

    // 按 flat_type 分组数据
    const nestedData = d3.group(data, d => d.flat_type);

    // 绘制每个 flat_type 的折线
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

        // 为每条折线添加标注
        svg.append("text")
            .datum(values[values.length - 1]) // 获取最后一个数据点
            .attr("x", d => xScale(d.year) + 5)
            .attr("y", d => yScale(d.average_price))
            .style("fill", colorScale(key))
            .text(key);
    });
}).catch(error => {
    console.error("Error loading the data:", error);
});
