const API_URL = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&api_key=a3574a5b83edd310d7ab8821ab17a282'
const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?api_key=a3574a5b83edd310d7ab8821ab17a282&query='
const IMAGE_URL = 'https://image.tmdb.org/t/p/w1280'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

// Pagination
let currentPage = 1;
const itemsPerPage = 10; // Number of movies per page

// Fetch movies from API
get_movies(API_URL);

async function get_movies(url) {
    const res = await fetch(`${url}&page=${currentPage}`);
    const data = await res.json();

    show_movies(data.results);
}

function show_movies(movies) {
    main.innerHTML = '';
    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview } = movie;
        const movie_element = document.createElement('div');
        movie_element.classList.add('movie');
        movie_element.innerHTML = `
            <img src="${IMAGE_URL + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRating(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
        `;
        main.appendChild(movie_element);
    });
}

// Color of movie rating
function getClassByRating(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

// Fetch movies by searching
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    // Check to see if searched word is in movie API
    if (searchTerm && searchTerm !== '') {
        get_movies(SEARCH_URL + searchTerm);
        search.value = '';
    } else {
        window.location.reload();
    }
});

// Pagination controls
function handlePaginationClick(direction) {

    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
        get_movies(API_URL);
    } else if (direction === 'next') {
        currentPage++;
        get_movies(API_URL);
    }
}

// Event listeners for pagination buttons
document.querySelector('.pagination').innerHTML = '<button id="prev">Previous</button><button id="next">Next</button>';

document.getElementById('prev').addEventListener('click', () => handlePaginationClick('prev'));
document.getElementById('next').addEventListener('click', () => handlePaginationClick('next'));