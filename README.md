## Overview
This project is a simple web application built using FastAPI and React. It allows users to search and view the annual income statements for Apple Inc. Financial Modeling Prep.

## Prerequisites
Before you begin, ensure that you have the following installed on your system:

Node.js (for the frontend)
Python 3.x (for the backend)
pip (for Python dependencies)

## Installation
1. Clone the repository:
    git clone https://github.com/
    cd project

2. Set up the Frontend(React)
Navigate to the frontend directory and install the necessary Node.js dependencies:
    cd frontend
    npm install
This will install all the JavaScript dependencies listed in the package.json file for the frontend.


3. Set up the Backend (FastAPI)
Install the Python dependencies specified in the requirements.txt file:
    pip install -r requirements.txt
This will install all the necessary Python packages, including FastAPI, requests, and other dependencies.
Create a .env file in the backend directory and add your API keys and other sensitive information. Example:
    API_KEY=your_financial_modeling_prep_api_key
Make sure to replace your_financial_modeling_prep_api_key with your actual API key.

4. Start up server:
For backend, start the FastAPI backend server using Uvicorn:
    uvicorn src.server:app --reload
For frontend, start the React development server:
    npm start
The React app should now be running locally at http://localhost:3000.













3. Run the server:
    ```bash
    uvicorn server:app --reload
    ```

## Usage
After starting the server, you can visit `http://localhost:8000` to use the application.


## Features
- View financial data
- Filter and sort results by date, revenue, and net income