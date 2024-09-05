const API_KEY = 'eOY6teKglfgk1XIMrL9mSdLGQwoJWxoecVPPYhJE';
const currentImageContainer = document.getElementById('current-image-container');
const nasaImage = document.getElementById('nasa-image');
const imageTitle = document.getElementById('image-title');
const imageDescription = document.getElementById('image-description');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchHistory = document.getElementById('search-history');

// Get the current image of the day on page load
window.onload = function () {
    getCurrentImageOfTheDay();
    loadSearchHistory();
};

searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const selectedDate = searchInput.value;
    if (selectedDate) {
        getImageOfTheDay(selectedDate);
        saveSearch(selectedDate);
        addSearchToHistory(selectedDate);
    }
});

function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    fetchImage(currentDate);
}

function getImageOfTheDay(date) {
    fetchImage(date);
}

function fetchImage(date) {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            nasaImage.src = data.url;
            imageTitle.textContent = data.title;
            imageDescription.textContent = data.explanation;
        })
        .catch(error => {
            console.error("Error fetching image:", error);
        });
}


function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem('searches', JSON.stringify(searches));
    }
}


function loadSearchHistory() {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.forEach(date => addSearchToHistory(date));
}

function addSearchToHistory(date) {
    const listItem = document.createElement('li');
    listItem.textContent = date;
    listItem.addEventListener('click', function () {
        getImageOfTheDay(date);
    });
    searchHistory.appendChild(listItem);
}
