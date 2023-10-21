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

            pieChart(neighborhoodCounts);
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

