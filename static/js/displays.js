const url = "http://localhost:5000/data"

d3.json(url).then(function(data) {
    console.log(data)
});

// Function to filter data by year
function filterDataByYear(data, year) {
    return data.filter(entry => entry.year === year);
}

//Function to caculate incident counts by neighborhood
function calculateNeighborhoodCounts(data, year) {
    let filterData = filterDataByYear(data, year);
    
    let neighborhoodCounts = {};
    filterData.forEach(entry=> {
        let neighborhood = entry.neighborhood; 
        neighborhoodCounts[neighborhood] = (neighborhoodCounts[neighborhood] || 0) +1;
    });
    
    console.log(neighborhoodCounts);

    return neighborhoodCounts
}

//Function to calculate neighborhood with max incident count
function calculateMaxNeighborhoods(data, year) {
    const maxNeighborhoods = {};

    // Calculate neighborhood counts for the given year
    const neighborhoodCounts = calculateNeighborhoodCounts(data, year);

    // Filter data for the selected year
    const filterData = filterDataByYear(data, year);

    filterData.forEach(entry => {
        let incident = entry.incident;
        let neighborhood = entry.neighborhood;

        if (!maxNeighborhoods[incident] || neighborhoodCounts[neighborhood] > neighborhoodCounts[maxNeighborhoods[incident]]) {
            maxNeighborhoods[incident] = neighborhood;
        }
    });

    console.log(maxNeighborhoods)

    return maxNeighborhoods;
}

// Function to calculate incident counts by incident type
function calculateIncidentCounts(data, year) {
    let filterData = filterDataByYear(data, year);

    let incidentCounts = {}; // Initialize an empty object to store incident counts

    filterData.forEach(entry => {
        let incident = entry.incident;
        incidentCounts[incident] = (incidentCounts[incident] || 0) + 1;
    });

    console.log(incidentCounts);

    return incidentCounts;
}

function maxNeighborhoodsTable(maxNeighborhoods) {

    //clear the incident data in the div
    d3.select("#incident").html("");

    let entries = Object.entries(maxNeighborhoods);

    entries.forEach(([key, value]) => {
        d3.select("#incident").append("h5").text(`${key}: ${value}`);
    });

    console.log(entries);
}

//Function to generate pie chart
function pieChart(neighborhoodCounts) {
    let labels = Object.keys(neighborhoodCounts);
    let values = Object.values(neighborhoodCounts);

    let data = [{
        type: "pie",
        labels: labels,
        values: values
    }];

    let layout = {
        title: 'Crime Distribution by Neighborhood'
    };

    Plotly.newPlot('pie', data, layout);
};

//function to create the bubble chart (TRISTAN)
function bubbleChart(incidentCounts) {
    let labels = Object.keys(incidentCounts);
    let values = Object.values(incidentCounts);

    let trace = {
        x: labels, // Use incident types as x-values
        y: values, // Use incident counts as y-values
        mode: 'markers',
        marker: {
            size: values, // Use incident counts for marker size
            sizemode: 'area',
            color: values,
            colorscale: 'Jet',
            opacity: 0.5
        }
    };

    let data = [trace];

    let layout = {
        title: 'Incident Type Bubble Chart',
        xaxis: {
            title: 'Incident Type'
        },
        yaxis: {
            title: 'Incident Count'
        }
    };

    Plotly.newPlot('bubble', data, layout);
}

//Function for the initial displays
function init() {
    //Fetch data from the API and create the initial graph
    d3.json(url).then(function(data) {
        //Filter data for the year 2014
        let filterData = filterDataByYear(data, 2014);
        updateGraph(filterData);
        //Calculate neighborhood counts after fetching data
        let neighborhoodCounts = calculateNeighborhoodCounts(filterData, 2014);
        pieChart(neighborhoodCounts);

        // Calculate neighborhoods with the highest counts for each incident type
        const maxNeighborhoods = calculateMaxNeighborhoods(filterData, 2014);
        maxNeighborhoodsTable(maxNeighborhoods);

        let incidentCounts = calculateIncidentCounts(filterData, 2014);
        bubbleChart(incidentCounts)
    })
    .catch(function(error) {
        console.error("Error fetching data:", error);
    });
}

//Function to update the graph
function updateGraph(filterData){
        
    //On change to the DOM, call getData()
    d3.select("#selDataset").on("change", function() {
        let selectedYear = parseInt(d3.select(this).property("value"));
        d3.json(url).then(function(data) {
            let filterData = filterDataByYear(data, selectedYear);
            updateGraph(filterData);

            let neighborhoodCounts = calculateNeighborhoodCounts(filterData, selectedYear);
            let incidentCounts = calculateIncidentCounts(filterData, selectedYear);
            let maxNeighborhoods = calculateMaxNeighborhoods(filterData, selectedYear)

            pieChart(neighborhoodCounts);
            bubbleChart(incidentCounts);
            maxNeighborhoodsTable(maxNeighborhoods)
        });
    });
    
    console.log(filterData);

        //Calculate the count for each combination of "MONTH" and "INCIDENT"
        let countData = {};

        filterData.forEach(entry => {
            let key = entry.month + '-' +entry.incident;
            countData[key] = (countData[key] || 0) +1;
        });

        //Extract months and incidents from the data
        let months = new Set(filterData.map(entry=>entry.month));
        let incidents = new Set(filterData.map(entry=>entry.incident));

        console.log(months, incidents)

        //Prepare data for the line chart
        let linedata = [];

        incidents.forEach(incidentType => {
            let counts = [...months].map(month => {
                let key = month + '-' + incidentType;
                return countData[key] || 0;
            });
       
            linedata.push({
                x: months,
                y: counts,
                type: 'line',
                name: incidentType
            });
        });

        // Generate the bubble chart data (TRISTAN)

    
        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        let layout = {
            title: 'Crime Count by Month',
            xaxis: {
                title: 'Month',
                tickangle: -45,
                tickvals: months,
                ticktext: [...months].map(month=> monthNames[month - 1])
            },
            yaxis: {
                title: 'Crime Count'
            }
        };
        
         Plotly.newPlot("line", linedata, layout);
};
    
init();

