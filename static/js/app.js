d3.json("./samples.json").then((data) => {
  var dataID = data.names;
  dataID.forEach((obj) => {
    var option = d3.select("#selDataset").append("option");
    // Dynamically add 'value' attribute to option tag with D3: https://stackoverflow.com/questions/20860260/dynamically-add-value-attribute-to-option-tag-with-d3
    option.text(obj).attr("value", obj);
  });
  d3.selectAll("#selDataset").on("change", change);
});

function change() {
  var dropdownMenu = d3.select("#selDataset");
  var sampleId = dropdownMenu.node().value;
  d3.json("./samples.json").then((data) => {
    // metadata div
    var filterData = data.metadata.filter((fil) => fil.id == sampleId)[0];
    // console.log(filterData);
    var sample = d3.select("#sample-metadata");
    sample.text("");
    sample.append("p").text("id: " + filterData.id);
    sample.append("p").text("enthnicity: " + filterData.ethnicity);
    sample.append("p").text("gender: " + filterData.gender);
    sample.append("p").text("age: " + filterData.age);
    sample.append("p").text("location: " + filterData.location);
    sample.append("p").text("bbtype: " + filterData.bbtype);
    sample.append("p").text("wfreq: " + filterData.wfreq);
    // barh div
    var filBar = data.samples.filter((fil) => fil.id == sampleId)[0];
    var barKeys = filBar.otu_ids.map((obj) => "OTU " + obj);
    var barValues = filBar.sample_values;
    trace1 = {
      y: barKeys.slice(0, 10).reverse(),
      x: barValues.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    };
    var layout1 = {
      title: `otu_ids vs. sample_values (id: ${sampleId})`,
      height: 500,
      width: 500,
      xaxis: { title: "sample_values" },
    };
    data1 = [trace1];
    Plotly.newPlot("bar", data1, layout1);
    // bubble div: https://plotly.com/javascript/bubble-charts/
    var trace2 = {
      x: filBar.otu_ids,
      y: filBar.sample_values,
      text: filBar.otu_labels,
      mode: "markers",
      marker: {
        size: filBar.sample_values,
        color: filBar.otu_ids,
      },
    };
    var data2 = [trace2];
    var layout2 = {
      title: `otu_ids vs. sample_values (id: ${sampleId})`,
      height: 500,
      width: 1200,
      xaxis: { title: "OTU_ID" },
    };
    Plotly.newPlot("bubble", data2, layout2);
    // Gauge  div:https://plotly.com/javascript/gauge-charts/
    var trace3 = {
      domain: { x: [0, 1], y: [0, 1] },
      value: filterData.wfreq,
      title: { text: "Scrubs per Week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10] },
        steps: [
          { range: [0, 2], color: "rgb(230,225,200)" },
          { range: [4, 6], color: "rgb(230,225,200)" },
          { range: [8, 10], color: "rgb(230,225,200)" },
          { range: [2, 4], color: "rgb(225,210,170)" },
          { range: [6, 8], color: "rgb(225,210,170)" },
        ],
      },
    };
    data3 = [trace3];

    var layout3 = {
      title: `Belly Button Washing Frequency (id: ${sampleId})`,
      width: 600,
      xaxis: { title: "OTU_ID" },
    };
    Plotly.newPlot("gauge", data3, layout3);
  });
}
