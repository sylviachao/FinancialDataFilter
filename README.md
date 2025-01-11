## Overview
This project is a simple web application built using FastAPI and React. It allows users to search and view the annual income statements for Apple Inc. via Financial Modeling Prep.

The API can be set up in a simple manner.

## Prerequisites
Before you begin, ensure that you have the following installed on your system:

Node.js (for the frontend)
Python 3.x (for the backend)
pip (for Python dependencies)

## Installation
1. Clone the repository:
    git clone [the repository url]
    cd project

2. Set up the Frontend(React)
Navigate to the frontend directory and install the necessary Node.js dependencies:
    cd frontend
    npm install
This will install all the JavaScript dependencies listed in the package.json file for the frontend.
If you wish to filter data on the frontend rather than the server side, update filterTable.js by setting the parameter yourApiKey to your API key.
If you prefer to filter data on the server side, comment out the frontend filtering code and uncomment the backend filtering code.



4. Set up the Backend (If using the backend)
Install the Python dependencies specified in the requirements.txt file:
    pip install -r requirements.txt
This will install all the necessary Python packages, including FastAPI, requests, and other dependencies.
Create a .env file in the backend directory and add your API keys and other sensitive information. Example:
    API_KEY=your_financial_modeling_prep_api_key
    FRONTEND_URL=http://localhost:3000
Make sure to replace your_financial_modeling_prep_api_key with your actual API key.


6. Start up server:
For backend, start the FastAPI backend server using Uvicorn:
    uvicorn src.server:app --reload
For frontend, start the React development server:
    npm start
The React app should now be running locally at http://localhost:3000.


## Usage
After starting the server, you can visit `http://localhost:8000` to use the application.


## Features
- View financial data
- Filter and sort results by date, revenue, and net income
