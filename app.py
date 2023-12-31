#Import Dependencies
from flask import Flask, render_template, jsonify
from flask_cors import CORS
import sqlite3
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///Resources/stp_crime.db")
#reflect an existing database into a new model
Base = automap_base()
#reflect the tables
Base.prepare(autoload_with=engine)
# Save reference to the table
Crime = Base.classes.crime_table

#################################################
# Flask Setup
#################################################

app = Flask(__name__)
CORS(app,supports_credentials=True)

#################################################
# Flask Routes
#################################################

# Function to query SQLite database and return data as JSON
def query_database():
    conn = sqlite3.connect('Resources/stp_crime.db')
    cursor = conn.cursor()
    data = cursor.execute('SELECT * FROM crime_table').fetchall()
    # data = cursor.fetchall()
    conn.close()
    return data

def crime():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Query all crime incidents
    results = session.query(Crime.DATE, Crime.YEAR, Crime.MONTH, Crime.INCIDENT, Crime.NEIGHBORHOOD).all()
    session.close()
    # Create a dictionary from the row data and append to a list of all_crime
    all_crime = []
    for DATE, YEAR, MONTH, INCIDENT, NEIGHBORHOOD in results:
        crime_dict = {}
        crime_dict["date"] = DATE
        crime_dict["year"] = YEAR
        crime_dict["month"] = MONTH
        crime_dict["incident"] = INCIDENT
        crime_dict["neighborhood"] = NEIGHBORHOOD
        all_crime.append(crime_dict)
    return all_crime

#Index Route
@app.route("/")
def index():
    return render_template("index.html")
    # , crime_data=jsonify(crime()))

#Endpoint to serve data as JSON
@app.route('/data')
def data():
    data = crime()
    return jsonify(data)

if __name__ =='__main__':
    app.run(debug=False)