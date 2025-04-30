//Stocks from Polygon Api function
async function fetchStock() {
    const ticker = document.getElementById("ticker").value.toUpperCase(); 
    const days = document.getElementById("timePeriod").value; 
    // Checking for ticker input 
    if (!ticker) { 
        alert("Please enter a valid ticker!");
        return;
    }

    try {
        // Retrieving the date
        const endDate = new Date().toISOString().split("T")[0];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const formattedStartDate = startDate.toISOString().split("T")[0];
        //Request daily stock data 
        const apiurl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formattedStartDate}/${endDate}?apiKey=QtGi9XRYfepfDNT1TErSSq_0IGPtHNrE`;
        const response = await fetch(apiurl);
        const data = await response.json();
        //Checks for valid stock data 
        if (data.results && data.results.length > 0) {
            //Formatting the dates 
            const labels = data.results.map(item => {
                const d = new Date(item.t);
                return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
            });
            //Grabs the daily closing price 
            const values = data.results.map(item => item.c);
            // Calling Chart plotting function
            plotChart(labels, values, ticker);
        } else {
            document.getElementById("stocksData").innerHTML = "Stock data unavailable.";
        }
        //Catches and logs errors 
    } catch (error) {
        console.error("Error while fetching stock data:", error);
        document.getElementById("stocksData").innerHTML = "Failed to retrieve stock.";
    }
}
//button calls the function
window.fetchStock = fetchStock;

// Line Chart using chart.js
function plotChart(labels, values, ticker) {
    const canvas = document.getElementById('stocksChart');
    if (!canvas) {
        console.error("stocksChart not found!");
        return;
    }

    const ctx = document.getElementById("stocksChart").getContext("2d");
    //Chart data and setting style 
    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: `Daily closing prices for ${ticker}`,
                data: values,
                borderColor: "#000000",
                fill: false
            }]
        }
    });
}

//Redirects to stocks page 
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('stocksButton').addEventListener('click', function() {
        window.location.href = 'A2_Stocks.html'; 
    });
//Redirects to dogs page 
    document.getElementById('dogsButton').addEventListener('click', function() {
        window.location.href = 'A2_Dogs.html'; 
    });
});