Contributors: Matthew Bond, Angela Gosewehr, Tristan Vazquez & Katy Yelle

## Project Background
Analyzing crime data has many uses such as deciding where to rent or buy a home, determining how to allocate resources to the community as well as determining how changes in laws and policies impact crime. Our goal was to create a St. Paul Crime Data Dashboard using Crime Data available at (https://information.stpaul.gov/datasets/stpaul::crime-incident-report/about)

Using our dashboard we hope to answer the following questions: 
1- How has crime changed in St. Paul year to year?
2- Are there times of the year when certain crimes might be more prevalent in St. Paul?
3- How do crimes change based on the neighborhood?
    
## Repository Structure
    -Main Folder
        -app.py
        -.gitignore
        -index.html
        -README.md

    -Sub Folders
        -Resources
            -crime_data.ipynb
            -crime_incident_data.csv
            -stp_crime.db
        -static
            -js
            -css
            -images
        -templates
            -index.html
        -Images

## File and Process Overview
-crime_incident_data.csv<br>
We downloaded the dataset on 10/12/23 from (https://information.stpaul.gov/datasets/stpaul::crime-incident-report/about). It includes data from August 14, 2014 through the most recent update. The data came with the following license:
Public Domain
This data are provided to you “as is” and without any warranty as to their performance, merchantability, or fitness for any particular purpose. The City of Saint Paul does not represent or warrant that the data or the data documentation are error-free, complete, current, or accurate. You are responsible for any consequences resulting from your use of the data or your reliance on the data. If you transmit or provide the data (or any portion of it) to another user, the data must include this disclaimer.

-crime_data.ipynb<br>
We extracted the data and cleaned it using Pandas in JupyterNotebook.  As part of this process we ensured that our date column was in the datetime format and then used it to generate a year column and a month column. We removed the number in the Neighborhood name column. We reviewed the 'incidents' column combining entries into one format (i.e. Agg. Assault Dom. and Agg. Assault Dom to Aggravated Assault Domestic) and combining similar entries (i.e. Proactive Police Visit and Proactive Foot Patrol were combined to 'Proactive Patrol'). We then reduced the number of columns to be Date, Year, Month, Incident, and Neighborhood. 

<p algin="center">
    <img src="Images\initial_df.png" />
</p>
<img src="Images\clean_df.png" >

We then took the finished DataFrame and created a SQLite database to be used in our Python Flask API. 

-app.py<br>
Our Python Flask API has two main routes.  The index route which launches the HTML, CSS and Javascript files and the data route which accesses the data from the SQLite database to be used in creating the data dashboard. 

<img src="Images/dashboard_header.png" >

-St. Paul Crime Data Dashboard<br>
The dashboard utilizes the index.html file, the style.css file and displays.js file to create the the multi-chart visualization. Users are able to select the year to view data from using the drop down. It then provides 5 visualizations:<br>
    1- A panel that shows the Neighborhood with the most incidents for each incident type.<br>
    2- A pie chart that shows the overall distribution of crime across neighborhoods.<br>
    3- A bar chart that shows the top ten incidents for the city overall.<br>
    4- A line chart that shows the number of each incident per month (with each incident having a unique line).<br>
    5- A bubble chart that shows the number of incidents for the city overall. <br>

## Charts

<img src="Images/Screenshot 2023-10-23 174149.png" >
<img src="Images/Screenshot 2023-10-23 174102.png" >
<img src="Images\Screenshot 2023-10-23 174128.png" >
<img src="Images\Screenshot 2023-10-23 174212.png" >


## Analysis
1- How has crime changed in St. Paul year to year?
- Total crime volume peaked in 2020
- The incident with the largest increase in volume from 2014-2020 was 'discharge of a firearm'.
- The neighborhood with the highest crime volumes transitioned from Payne/Phalen to Capitol River.
    
2- Are there times of the year when certain crimes might be more prevalent in St. Paul?
- Theft, Vandalism/Criminal Damage, and Narcotics all have peaks during summer months.
- Auto theft has a peak during winter months for most years.
- In 2023 and 2022, proactive patrol parallels to theft, criminal damages, auto theft, narcotics, discharge and burglary.

3- How do crimes change based on the neighborhood?
- Overall highest percentage of crimes over the years switched from Payne/Phalen in 2015 to 2017 to Capitol River in 2018 to 2020 and again in 2022.
- Homicides are low overall in the city over the years.
- Lowest overall percentage of crime was between St. Anthony and Summit Hill.
     
Future work and Analysis:
Dashboard <br>
-Add a dashboard page that has a dropdown for different neighborhoods to dig deeper into their crime data; combine with additional datasets to creat neighborhood profile data with demographics, housing prices, etc.
-A map page with data including a choropleth layer with #Crime by neighborhood, and a marker layer with unique markers based on incident type (utilizing the block information initially part of the data)

Analysis<br>
What impact does the positive patrol have on crime?  Has it helped in areas where it is more frequent?  Does it impact certain crime types more than others?

## Presentation
Slide Deck : https://docs.google.com/presentation/d/1girG8mYYZ2dhn-A2ebbSUvz2ehqIEgY6XKP0c98-opo/edit?usp=sharing

## Acknowledgements
Thank you to our instructional team: Hunter Hollis, Randy Sendek and Sam Espe!
