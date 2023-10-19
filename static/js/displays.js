
//Create a drop down menu based on the names 
let selector = d3.select("#selDataset");

//Get the options from the year columns
//Loop through to get each year and append to the dropdown options
for (let i = 0; i < year.length; i++){
    //Check if the year is already in the dropdown
    let isYearPresent = selector.selectAll("option").nodes().some(option => option.value === year[i]);  
    
    //if year not already in dropdown add it
    if (!isYearPresent) {
    selector
            .append("option")
            .text(year[i])
            .property("value", year[i]);
    }
};
