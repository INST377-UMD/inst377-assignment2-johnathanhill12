//function will go here 

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