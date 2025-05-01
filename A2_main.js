//Stocks from Polygon Api function
async function fetchPolygonStocks() {
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
window.fetchPolygonStocks = fetchPolygonStocks;

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
                label: ` Stock Prices for ${ticker}`,
                data: values,
                borderColor: "#000000",
                fill: false
            }]
        }
    });
}

//Stocks from Reddit Function 
async function fetchRedditStocks() {
    try {
        //Api Call
        const response = await fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03');
        const data = await response.json()
        //gets  top 5 stocks
        const top5Stocks = data.slice(0,5);

        let tableHtml = "";
        top5Stocks.forEach(stock => { //Sets icon based on sentiment 
            const sIcon = stock.sentiment === "Bullish" ? "<img src='bullishicon.png' alt='Bullish' width='40'>"
            : "<img src='bearishicon.png' alt='Bearish' width='40'>";
            //link to yahoo finance 
            const yahooLink = `https://finance.yahoo.com/quote/${stock.ticker}`;
            //Adding necessary rows 
            tableHtml += `<tr> 
                <td><a href="${yahooLink}" target="_blank">${stock.ticker}</a></td>
                <td>${stock.no_of_comments}</td>
                <td>${sIcon} ${stock.sentiment}</td>
            </tr>`;
        });
        //Adds generated rows to the reddit stocks table 
        document.querySelector("#redditStockTable tbody").innerHTML = tableHtml;
    } catch (error) {
        //logging errors 
        console.error("Error while fetching Reddit stocks:", error);
        //alerts when the fetch fails 
        alert("Failed to load the reddit stock data, please try again!");
    } 
}
window.onload = fetchRedditStocks;

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