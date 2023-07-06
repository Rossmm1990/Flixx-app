const global = {
    currentPage: window.location.pathname,
    search: {
        term: '',
        type: '',
        page: 1,
        totalPages: 1,
        totalResults: 0,
        totalSearched: 0,
    },
    api: {
        apiKey: 'a4ef005689352a6bb6f20504558098eb',
        apiUrl: 'https://api.themoviedb.org/3/'
    }
}

async function displayPopluarMovies() {
    const {results} = await fetchAPIData('movie/popular')
    results.forEach((movie) => {
        const div = document.createElement('div')
        div.innerHTML = `<div class="card">
        <a href="movie-details.html?id=${movie.id}">
          <img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>
      </div>`

      document.getElementById('popular-movies').appendChild(div)
    })
}

async function displayPoplularTVShows() {
    const {results} = await fetchAPIData('tv/popular')
    results.forEach((show) => {
        div = document.createElement('div')

    div.innerHTML = `<div class="card">
    <a href="tv-details.html?id=${show.id}">
      <img
        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt="${show.name}"
      />
    </a>
    <div class="card-body">
      <h5 class="card-title">${show.name}</h5>
      <p class="card-text">
        <small class="text-muted">Aired: ${show.first_air_date}</small>
      </p>
    </div>
  </div>`

    document.getElementById('popular-shows').appendChild(div)
    })
}

async function displayTVDetails() {
    const tvShowID = window.location.search.split('=')[1]

    const tvShow = await fetchAPIData(`tv/${tvShowID}`)
    console.log(tvShow)

    displayBackgroundImage('tvShow', tvShow.backdrop_path)

    const div = document.createElement('div')

    div.innerHTML = `<div class="details-top">
    <div>
    ${  
        tvShow.poster_path
            ? `<img
            src="https://image.tmdb.org/t/p/w500${tvShow.poster_path}"
            class="card-img-top"
            alt="${tvShow.name}"
          />`
            : `img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${tvShow.name}"
        />`   
    }
    </div>
    <div>
      <h2>${tvShow.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        8 / 10
      </p>
      <p class="text-muted">Release Date: ${tvShow.first_air_date}</p>
      <p>
        ${tvShow.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group" id="list-group-tv">
        ${
            tvShow.genres.map((genre) => `<li>${genre.name}`).join('')
        }
      </ul>
      <a href="${tvShow.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes:</span> ${tvShow.number_of_episodes}</li>
      <li>
        <span class="text-secondary">Last Episode To Air:</span> ${tvShow.last_episode_to_air.name}
      </li>
      <li><span class="text-secondary">Status:</span> ${tvShow.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${tvShow.production_companies.map((company) => `<span>${company.name}</span>`).join('')}</div>
  </div>`

    document.querySelector('#show-details').appendChild(div)
}

async function displayMovieDetails() {
    const movieID = window.location.search.split('=')[1]
    
    const movie = await fetchAPIData(`movie/${movieID}`)
    
    //  Overlay for background image
    displayBackgroundImage('movie', movie.backdrop_path);
    
    const div = document.createElement('div')

    div.innerHTML = `<div class="details-top">
    <div>
      <img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt="Movie Title"
      />
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>
        ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${movie.genres.map((genre) => `<li>${genre.name}`).join('')}
      </ul>
      <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${movie.production_companies.map((company) => `<span>${company.name}</span>`).join('')}</div>
  </div>`

  document.querySelector('#movie-details').appendChild(div)
}

// Display Backdrop On Details Pages
function displayBackgroundImage(type, backgroundPath) {
    const overLayDiv = document.createElement('div')
    overLayDiv.style.backgroundImage= `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overLayDiv.style.backgroundSize = 'cover';
    overLayDiv.style.backgroundPosition = 'center';
    overLayDiv.style.backgroundRepeat = 'no-repeat';
    overLayDiv.style.height = '100vh';
    overLayDiv.style.width = '100vw';
    overLayDiv.style.position = 'absolute';
    overLayDiv.style.top = '0';
    overLayDiv.style.left = '0';
    overLayDiv.style.zIndex = '-1';
    overLayDiv.style.opacity = '0.1';

    if(type === 'movie') {
        document.querySelector('#movie-details').appendChild(overLayDiv);
    } else {
        document.querySelector('#show-details').appendChild(overLayDiv);
    }
}

// Search Movies/Shows
async function search() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString);

    global.search.type = urlParams.get('type');
    global.search.term = urlParams.get('search-term');

    if (global.search.term !== '' && global.search.term !== null) {
        const {results, total_pages, page, total_results} = await searchAPIData();

        global.search.page = page;
        global.search.totalPages = total_pages;
        global.search.totalResults = total_results;
        
        if(results.length === 0) {
            showAlert('No results found')
            return;
        }

        DisplaySearch(results);
        document.querySelector('#search-term').value = '';

    } else {
        showAlert('Please enter a search term')
    }
    
}

//  Display Silder MOvies
async function displaySlider()  { 
    const { results } = await fetchAPIData('movie/now_playing');

    console.log(results)

    results.forEach((movie) => {
        const div = document.createElement('div')
        div.classList.add('swiper-slide');

        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
            </h4>`

            document.querySelector('.swiper-wrapper').appendChild(div);
            initSwiper();
    });
}

function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay:4000,
            disableOnInteraction: false
        },
        breakpoints: {
            500: {
                   slidesPerView: 2
            },
            700: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 4
            }
        }
    })
}

// Display Search Data
async function DisplaySearch(searchs, nextOrPrev = 0) {
  // Clear previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

 if(nextOrPrev === 'prev') {
  global.search.totalSearched -= searchs.length
 } else if (nextOrPrev === 'next') {
  global.search.totalSearched += searchs.length
 } else {
  global.search.totalSearched = searchs.length
 }

  console.log(global.search.totalSearched)

    searchs.forEach((result) => {
        const div = document.createElement('div')
        div.innerHTML = `<div class="card">
        <a href="${global.search.type}-details.html?id=${result.id}">
        ${  
            result.poster_path
                ? `<img
                src="https://image.tmdb.org/t/p/w500${result.poster_path}"
                class="card-img-top"
                alt="${global.search.type === 'movie' ? result.title : result.name}"
              />`
                : `<img
                src="../images/no-image.jpg"
                class="card-img-top"
                alt="${global.search.type === 'movie' ? result.title : result.name}"
            />`   
        }
        </a>
        <div class="card-body">
          <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
          </p>
        </div>
      </div>`


      document.querySelector('#search-results-heading').innerHTML = `
      <h2>${global.search.totalSearched} of ${global.search.totalResults}
      Results for ${global.search.term}`

      document.querySelector('#search-results').appendChild(div)
    })

    displayPagination();
}

// create & Display Pagination For Search
function displayPagination() {
  const div = document.createElement('div')
  div.classList.add('pagination')
  div.innerHTML = `
  <div class="pagination">
          <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">${global.search.page} of ${global.search.totalPages}</div>
        </div>`;
    
  document.querySelector('#pagination').appendChild
  (div);

  if(global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }

  if(global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }
  //  Next Page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData
    ();
    
    DisplaySearch(results, 'next');
  })
  // Previous page
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    DisplaySearch(results, 'prev');
  })
}

// Make request TO search
async function searchAPIData() {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;
    
    showSpinner()

    const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`);

    const data = await response.json();

    hideSpinner()

    return data;
}

async function fetchAPIData(endpoint) {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;
    
    showSpinner()

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    const data = await response.json();

    hideSpinner()

    return data;
}

function showSpinner() {
    document.querySelector('.spinner').classList.add('show')
}

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show')
}

// Highlight active link
function highlightActiveLink() {
    const link = document.querySelectorAll('.nav-link')
    link.forEach((link) => {
        if(link.getAttribute('href') === global.currentPage) {
            link.classList.add('active')
        }
    })
}

function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Show Alert
function showAlert(message, className = 'error') {
    const alertEl = document.createElement('div');
    alertEl.classList.add('alert', className)
    alertEl.appendChild(document.createTextNode(message));
    document.querySelector('#alert').appendChild(alertEl);

    setTimeout(() => alertEl.remove(), 3000)
}

function init() {
    switch(global.currentPage) {
        case '/':
        case '/index.html':
            displayPopluarMovies();
            displaySlider();
            break;
        case '/shows.html':
            displayPoplularTVShows();
            break;
        case '/movie-details.html':
            displayMovieDetails();
            break;
        case '/tv-details.html':
            displayTVDetails();
            break;
        case '/search.html':
            search();
            break;
    }
    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init)

 




// const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&langauge=en-US`);

// ""
"https://image.tmdb.org/t/p/w500${movie.poster_path}"
// "https://image.tmdb.org/t/p/w500${movie.poster_path}"
