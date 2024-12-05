const apiKey = 'd405d573f179c5ab980d0dffe5919bbc';
const baseUrl = 'https://api.themoviedb.org/3';

// Load popular movies on page load
$(document).ready(() => {
    fetchPopularMovies();

    // Search button click
    $('#search-button').click(() => {
        const query = $('#search-input').val();
        if (query) {
            searchMovies(query);
        }
    });
});

// Fetch popular movies
function fetchPopularMovies() {
    $.ajax({
        url: `${baseUrl}/movie/popular`,
        method: 'GET',
        data: { api_key: apiKey },
        success: function(response) {
            displayMovies(response.results, '#movie-container');
        },
        error: function(err) {
            console.error('Error fetching popular movies:', err);
        }
    });
}

// Search for movies
function searchMovies(query) {
    console.log('Searching for:', query); // Log query for debugging
    $.ajax({
        url: `${baseUrl}/search/movie`,
        type: 'GET',
        data: {
            api_key: apiKey,
            query: query
        },
        success: function(response) {
            console.log('API Response:', response); // Log API response
            if (response.results.length === 0) {
                alert('No movies found');
            } else {
                displayMovies(response.results); // Display search results
            }
        },
        error: function(error) {
            console.error('Error fetching movies:', error);
            alert('An error occurred while fetching movies. Please try again.');
        }
    });
}

// Display movies
function displayMovies(movies) {
    console.log('Movies to display:', movies); // Log movies for debugging
    const movieContainer = $('#movie-container');
    movieContainer.empty(); // Clear any previous results

    if (movies.length === 0) {
        movieContainer.append('<p>No Movies Found</p>');
        return;
    }

    movies.forEach(movie => {
        console.log('Processing movie:', movie); // Log each movie for debugging
        const movieElement = `
            <div class="movie" data-id="${movie.id}">
                <h3>${movie.title}</h3>
                <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" />
                <p class="movie-overview">${movie.overview}</p>
                <a href="https://www.themoviedb.org/movie/${movie.id}" class="read-more" target="_blank">Read More</a>
            </div>
        `;
        movieContainer.append(movieElement);
    });

    // Make all description boxes the same height
    $('.movie').each(function() {
        const maxHeight = Math.max(...$('.movie').map(function() {
            return $(this).find('.movie-overview').height();
        }).get());
        $('.movie').each(function() {
            $(this).find('.movie-overview').height(maxHeight);
        });
    });
}

// Add click event for movie details (optional)
$('.movie').click(function() {
    const movieId = $(this).data('id');
    fetchMovieDetails(movieId);
});

// Fetch movie details (optional)
function fetchMovieDetails(movieId) {
    $.ajax({
        url: `${baseUrl}/movie/${movieId}`,
        method: 'GET',
        data: { api_key: apiKey, append_to_response: 'credits,reviews' },
        success: function(response) {
            displayMovieDetails(response);
        },
        error: function(err) {
            console.error('Error fetching movie details:', err);
        }
    });
}

// Display movie details (optional)
function displayMovieDetails(movie) {
    $('#movie-details').html(`
        <h2>${movie.title}</h2>
        <p>${movie.overview}</p>
        <p><strong>Release Date:</strong> ${movie.release_date}</p>
        <p><strong>Rating:</strong> ${movie.vote_average}</p>
        <h3>Cast</h3>
        <ul>
            ${movie.credits.cast.slice(0, 5).map(cast => `<li>${cast.name} as ${cast.character}</li>`).join('')}
        </ul>
    `);
}
