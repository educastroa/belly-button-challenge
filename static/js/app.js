const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let globalData;


function getData(callback) {
  d3.json(url)
    .then((data) => {
      callback(data);
      console.log(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}


function renderMetadata(sample) {
  let metadata = globalData.metadata;

  let filteredSample = metadata.filter((result) => result.id == sample);

  let sampleObject = filteredSample[0];

  d3.select("#sample-metadata").html("");

  Object.keys(sampleObject).forEach((key) => {
    d3.select("#sample-metadata")
      .append("h5")
      .text(`${key}: ${sampleObject[key]}`);
  });
}


function renderBarChart(sample) {
  let sampleData = globalData.samples;

  let filteredSample = sampleData.filter((result) => result.id == sample);

  let sampleObject = filteredSample[0];

  let chartItems = sampleObject.otu_ids.map((id, index) => {
    return {
      otu_labels: sampleObject.otu_labels[index],
      otu_ids: id,
      sample_values: sampleObject.sample_values[index],
    };
  });


  const sortedItem = chartItems
    .sort((a, b) => b.sample_values - a.sample_values)
    .slice(0, 10);

  let yticks = sortedItem.map((obj) => `OTU ${obj.otu_ids}`).reverse();

  let xticks = sortedItem.map((obj) => obj.sample_values).reverse();

  let labels = sortedItem.map((obj) => obj.otu_labels).reverse();

  let trace = {
    x: xticks,
    y: yticks,
    text: labels,
    type: "bar",
    orientation: "h",
  };


  Plotly.newPlot("bar", [trace]);
}


function renderBubbleChart(sample) {
  let sampleData = globalData.samples;

  let filteredSample = sampleData.filter((result) => result.id == sample);

  let sampleObject = filteredSample[0];

  let otu_ids = sampleObject.otu_ids;
  let otu_labels = sampleObject.otu_labels;
  let sample_values = sampleObject.sample_values;

  let trace1 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: "Earth",
    },
  };

  let layout = {
    hovermode: "closest",
    xaxis: { title: "OTU ID" },
  };

  Plotly.newPlot("bubble", [trace1], layout);
}


function optionChanged(value) {
  renderMetadata(value);
  renderBarChart(value);
  renderBubbleChart(value);
}


function init() {
  let dropdownMenu = d3.select("#selDataset");

  getData((data) => {
    globalData = data;

    let names = data.names;

    names.forEach((id) => {
      dropdownMenu.append("option").text(id).property("value", id);
    });

    let default_item = names[0];

    renderMetadata(default_item);
    renderBarChart(default_item);
    renderBubbleChart(default_item);
  });
}


init();
