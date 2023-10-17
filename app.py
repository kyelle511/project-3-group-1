#Import Dependencies
from flask import Flask, render_template, jsonify
import sqlite3


#Flask Set Up - Create an app
app = Flask(__name__)

# Flask Routes

# Function to query SQLite database and return data as JSON
def query_database():
    conn = sqlite3.connect('stp_crime.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM crimes')
    data = cursor.fetchall()
    conn.close()
    return data

#Index Route
@app.route("/")
def index():
    return render_template("index.html")

#Endpoint to serve data as JSON
@app.route('/data')
def data():
    data = query_database
    return jsonify(data)

if __name__ =='__main__':
    app.run(debug=True)
