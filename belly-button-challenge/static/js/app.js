// Endpoint URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Init Dashboard Load function
function init(){

    // Fetch the JSON
    d3.json(url).then(function(data){

        // Select the dropdown menu
        let dd = d3.selectAll("#selDataset");

        // Append new list items for all 'names'
        for (let i = 0; i < data.names.length; i++){
            dd.append("option").attr("value", data.names[i]).text(data.names[i]);
        };
    
    // Store the ID from dropdown in a variable
    let sampleID = dd.property('value');

    // console.log(sampleID);

    // Use the functions to generate the plots
    genBarChart(sampleID);
    genDemographic(sampleID);
    genBubbleChart(sampleID);
    genGaugeChart(sampleID);
    });

};

// BarChart generator function
function genBarChart(sample){

    // Read in the JSON endpoint
    d3.json(url).then(function(data){
        
        // Assign samples data to variable
        let samples_data = data.samples;

        // Filter the data for sample array
        let sample_array = samples_data.filter(sd => sd.id == sample);

        // Pull data from the array
        let sampleData = sample_array[0];

        // console.log(sampleData);

            // Transform data
            //let id = chart_data.id;
            let transData = [];
            for (let i = 0; i < sampleData.otu_ids.length; i++){
                transData.push({
                    otu : `OTU ${sampleData.otu_ids[i]}`,
                    label : sampleData.otu_labels[i],
                    otuVal : sampleData.sample_values[i]
                });
            };

            // Order by otuVal Descending
            transData.sort((a,b) => b.otuVal - a.otuVal);

            // Slice first 10 values
            let sliced = transData.slice(0,10);

            // Reverse the array to accommodate Plotly's defaults
            let reverseSlice = sliced.reverse();    
            
        // Map the values to the trace object
        let trace1 = {
            x : reverseSlice.map(val => val.otuVal),
            y : reverseSlice.map(val => val.otu),
            text : reverseSlice.map(val => val.label),
            type: "bar",
            orientation : "h"
        };

        // Create a c_data (chart data) array
        let c_data = [trace1];

        // Create char title and other layout features
        let layout = {
            margin :{
                t: 25
            }
        };

        // Generate plot
        Plotly.newPlot("bar", c_data, layout);
    });
};

// DemoGraphic function generator
function genDemographic(sample){
    d3.json(url).then(function(data){

        // Assign metadata to a variable
        let metadata = data.metadata;

        // Filter the metadata to the sample
        let meta_array = metadata.filter(md => md.id == sample);

        // Get data from array
        let meta_data = meta_array[0];

        //console.log("Metadata:", meta_data);

        // Select the sample-metadata div in the demographic panel
        let div = d3.select("#sample-metadata");

        // Add small text attr and clear the div contents
        div.attr("class","small").attr("align", "center").html("");

        // Loop through metadata and append to div
        for (let meta in meta_data){
            div.append().html(`<b>${meta}:</b> \t ${meta_data[meta]} </br>`);
        };

    });
};

// BubbleChart function generator
function genBubbleChart(sample){
    d3.json(url).then(function(data){

        // Assign samples data to variable
        let samples_data = data.samples;

        // Filter the data for sample array
        let sample_array = samples_data.filter(sd => sd.id == sample);

        // Pull data from the array
        let sampleData = sample_array[0];

        //console.log(sampleData);

            // Transform data
            //let id = chart_data.id;
            let transData = [];
            for (let i = 0; i < sampleData.otu_ids.length; i++){
                transData.push({
                    otu : sampleData.otu_ids[i],
                    label : sampleData.otu_labels[i],
                    otuVal : sampleData.sample_values[i]
                });
            };
        
        // Sort the values by otu ascending
        transData.sort((a,b) => b.otuVal - a.otuVal);

        // Map the values to a trace object
        let bubTrace = {
            x : transData.map(val => val.otu),
            y : transData.map(val => val.otuVal),
            mode : 'markers',
            marker :{
                // Size is reduced by 10% to ensure markers are visible
                size: transData.map(val => (val.otuVal * 0.9)),
                opacity : 0.75,
                color : transData.map(val => val.otu),
                colorscale: "Earth",
                line :{
                    color : "black",
                    width : 0.75
                }
            },
            text: transData.map(val => val.label)
        };

        // Create data array
        let bubData = [bubTrace];

        // Create layout object
        let layout = {
            hovermode: "closest",
            hoverdistance:1,
            showlegend:false,
            height: 450,
            width: 1140,
            margin: {
                autoexpand:true,
                t: 10,
                b: 30,
                l: 25,
                r: 25
            },
            xaxis : { title: "OTU ID"}
        };

        // Generate plot
        Plotly.newPlot("bubble", bubData, layout);
    });
};

// Gauge chart for washing frequency
function genGaugeChart(sample){

    // Fetch the JSON file
    d3.json(url).then(function(data){

        // Assign the meta data to a variable
        let metadata = data.metadata;

        // Filter the metadata to the sample
        let meta_array = metadata.filter(md => md.id == sample);

        // get data from array
        let meta_data = meta_array[0];

        // Create the trace object for data required
        let gaugeTrace = {
            value : meta_data.wfreq,
            title : {text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week"},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {
                    dtick : 1,
                    tick0 : 1,
                    range: [null, 9],
                    ticks: "",
                    ticklabelstep : 1                    
                },
                bar:{
                    thickness : 0.05,                    
                    color: "red"                    
                },
                steps: [
                    {range: [0,1], color: "rgb(248,243,236)"},
                    {range: [1,2], color: "rgb(244,241,229)"},
                    {range: [2,3], color: "rgb(233,231,201)"},
                    {range: [3,4], color: "rgb(229,232,176)"},
                    {range: [4,5], color: "rgb(212,229,154)"},
                    {range: [5,6], color: "rgb(182,205,143)"},
                    {range: [6,7], color: "rgb(138,192,134)"},
                    {range: [7,8], color: "rgb(137,188,141)"},
                    {range: [8,9], color: "rgb(131,181,136)"}
                ],
                threshold: {
                    value : meta_data.wfreq,
                    line: { 
                        color : "red",
                        width : 2
                 },
                    thickness : 1
                }
            }
        };

        // Assign trace to data array
        let gaugeData = [gaugeTrace];

        // Create layout object
        let gaugeLayout = {
            margin:{
                t : 0,
                b : 0,
                r : 30,
                l : 30
            }
        };

        // Create the plot
        Plotly.newPlot('gauge', gaugeData, gaugeLayout);

    });
}

// Create an Event to run when the dropdown is changed
function optionChanged(sample){
    console.log(`Subject ID changed: ${sample}`);
    genBarChart(sample);
    genBubbleChart(sample);
    genDemographic(sample);
    genGaugeChart(sample);
    console.log("Charts Updated!");
};

init();