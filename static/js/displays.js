
const url = "http://localhost:5000/data"
//Create a drop down menu based on the names 
let selector = d3.select("#selDataset");

d3.json(url).then(function(data) {
    console.log(data)
});

//Get the options from the years
d3.json(url).then((data) => {
    let year = data.year;
    console.log(year);

    // Get the options from the year columns
    // Loop through to get each year and append to the dropdown options
    for (let i = 0; i < data.length; i++){
    //Check if the year is already in the dropdown
    let isYearPresent = selector.selectAll("option").nodes().some(option => option.value === year[i]);  
    
    //if year not already in dropdown add it
    if (!isYearPresent) {
    selector
            .append("option")
            .text(year[i])
            .property("value", year[i]);
        };
    };
});
