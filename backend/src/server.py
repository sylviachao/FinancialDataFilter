import os
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
from datetime import datetime


# Load environment variables from .env
load_dotenv()

API_KEY = os.getenv("API_KEY")
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")  # Default to localhost if not set

app = FastAPI()

origins=[frontend_url]
# Add CORSMiddleware to allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow requests from the specified origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # Allow the methods you want to support
    allow_headers=["*"],  # Allow all headers
)

# Fetch the financial data
@app.get("/api/financial-data")
async def get_financial_data(
    start_year: str = "0000",
    end_year: str = str(datetime.now().year),
    min_revenue: str = "0",  # Keeping them as string
    max_revenue: str = "inf",  # Using 'inf' as a string to indicate no limit
    min_net_income: str = "0",  # String type to process later
    max_net_income: str = "inf",
    sort_by: str = "date",
    sort_order: str = "asc"
):
    try:
        # Fetch the data from the external API
        url = f"https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey={API_KEY}"
        response = requests.get(url)
        data = response.json()
        # Convert start_year and end_year to integers (default to 0 or 2024 if invalid)
        try:
            start_year = int(start_year) if start_year != "" else 0
        except ValueError:
            start_year = 0  # Default to 0 if conversion fails
        
        try:
            end_year = int(end_year) if end_year != "" else int(datetime.now().year)
        except ValueError:
            end_year = int(datetime.now().year)  # Default to current year
        
        # Convert revenue and net income parameters to numbers (or use defaults)
        try:
            min_revenue = float(min_revenue) if min_revenue != "" else 0
        except ValueError:
            min_revenue = 0  # Default value if conversion fails
        
        try:
            max_revenue = float(max_revenue) if max_revenue != "" else float('inf')
        except ValueError:
            max_revenue = float('inf')  # No upper limit if conversion fails
        
        try:
            min_net_income = float(min_net_income) if min_net_income != "" else 0
        except ValueError:
            min_net_income = 0  # Default value if conversion fails
        
        try:
            max_net_income = float(max_net_income) if max_net_income != "" else float('inf')
        except ValueError:
            max_net_income = float('inf')  # No upper limit if conversion fails
        # Filter the data based on the query parameters
        print(start_year,end_year,min_revenue,max_revenue)
        filtered_data = [
            entry for entry in data
            if (int(entry["calendarYear"]) >= start_year) and
               (int(entry["calendarYear"]) <= end_year) and
               (entry["revenue"] >= min_revenue and entry["revenue"] <= max_revenue) and
               (entry["netIncome"] >= min_net_income and entry["netIncome"] <= max_net_income)
        ]

        # Sort the filtered data
        filtered_data.sort(key=lambda x: x[sort_by], reverse=(sort_order == "desc"))

        return filtered_data
    except Exception as e:
        return JSONResponse(content={"error": f"Failed to process data: {str(e)}"}, status_code=500)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
