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

        const redditTable = document.querySelector('#redditStockTable tbody');
        if (!redditTable) {
            console.error("redditStockTable tbody element wasn't found.");
            return;
        }
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
        //Updates innerHTML after checking if it exists 
        redditTable.innerHTML = tableHtml;
    } catch (error) {
        //logging errors 
        console.error("Error while fetching Reddit stocks:", error);
        
    } 
}
window.onload = fetchRedditStocks;

// Fetching images for the carousel
async function fetchImages() {
    try {
        const response = await fetch("https://dog.ceo/api/breeds/image/random/10");
        const data = await response.json();
        const carousel = document.getElementById("dogCarousel");
        if (!carousel) {
            console.error("dogCarousel was not found");
            return;
        }
        
        //Clears the carousel before repopulating 
        carousel.innerHTML = "";

        data.message.forEach(imageUrl => {
            const image = document.createElement("img");
            image.src = imageUrl;
            image.alt = "Dog Image";
            carousel.appendChild(image);
        });

        simpleslider.getSlider({
            container: document.getElementById("dogCarousel"),
            transitionTime: 2,
            delay:3.5
        });
    } catch (error) {
        console.error("There was an error while loading images", error);
    }
}

//Fetches and displays dog breeds 
async function fetchBreeds() {
    try {
        const response = await fetch("https://dogapi.dog/api/v2/breeds");
        const data = await response.json();

        if(!Array.isArray(data.data)) {
            console.error("Array expected:", data);
            return;
        }

        const breedsSection = document.getElementById("breedsSection");
        if (!breedsSection) return;

        data.data.forEach(breed => {
            const button = document.createElement("button");
            button.innerText = breed.attributes.name;
            button.setAttribute("dog-id", breed.id);
            button.onclick = () => displayBreedInfo(breed);
            breedsSection.appendChild(button);
        });
        //catching errors 
    } catch (error) {
        console.error("Error while loading dog breeds", error);
    }
}

//Displays info on the breeds after clicking the button
function displayBreedInfo(breed) {
    const infoSection = document.getElementById("infoSection");
    const breedName = breed.attributes.name;
    const breedDescription = breed.attributes.description || "No description available";  

    document.getElementById("breedName").innerText = breedName;
    document.getElementById("breedDescrip").innerText = breedDescription;

    const minLifeSpan = breed.attributes.life.min;
    const maxLifeSpan = breed.attributes.life.max;
    
    document.getElementById("minLife").innerText = minLifeSpan;
    document.getElementById("maxLife").innerText = maxLifeSpan;

    //Displays breed info 
    infoSection.classList.remove("hidden")
}

//Handling content loading
document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;
    if (path.endsWith("A2_index.html")) {
        const stocksButton = document.getElementById("stocksButton");
        if (stocksButton) {
            stocksButton.addEventListener("click", () => {
                window.location.href = "A2_Stocks.html";
            });
        }

        const dogsButton = document.getElementById("dogsButton");
        if (dogsButton) {
            dogsButton.addEventListener("click", () => {
                window.location.href = "A2_Dogs.html";
            });
        }
    }

    if(path.endsWith("A2_Stocks.html")) {
        fetchRedditStocks();
    
    }

    if(path.endsWith("A2_Dogs.html")){
        fetchImages();
        fetchBreeds();
    }
});



