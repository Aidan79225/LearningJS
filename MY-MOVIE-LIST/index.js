const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = [] //電影總清單
let filteredMovies = [] //搜尋清單
let lastPage = 1

const MOVIES_PER_PAGE = 12

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const listModeButton = document.querySelector('#list-mode')
const cascadeModeButton = document.querySelector('#cascade-mode')

function renderCascadeModeMovieList(data) {
  return data.map((item) => {
    // title, image, id
    return `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image
      }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button 
            class="btn btn-primary 
            btn-show-movie" 
            data-bs-toggle="modal" 
            data-bs-target="#movie-modal" 
            data-id="${item.id}"
          >
            More
          </button>
          <button 
            class="btn btn-info btn-add-favorite" 
            data-id="${item.id}"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>`
  }).join('')
}

function renderListModeMovieList(data) {
  return data.map((item) => {
    return `
    <div class="d-flex align-items-center mt-1 border-bottom mt-3 pb-3">
      <h5 class="align-middle">${item.title}</h5>
      <button
        class="col-auto btn btn-primary btn-show-movie ms-auto"
        data-bs-toggle="modal"
        data-bs-target="#movie-modal"
        data-id="${item.id}"
      >
        More
      </button>
      <button 
        class="col-auto btn btn-info btn-add-favorite ms-2 me-5" 
        data-id="${item.id}"
      >
        +
      </button>
    </div>
    `
  }).join('')
}


const VIEW_MODE = {
  ListMode: renderListModeMovieList,
  CascadeMode: renderCascadeModeMovieList
}
let currentMode = VIEW_MODE.ListMode
function renderMovieList(data) {
  console.log(currentMode(data))
  dataPanel.innerHTML = currentMode(data)
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE

  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function showMovieModal(id) {
  // get elements
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  // send request to show api
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results

    // insert data into modal ui
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)

  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }

  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// listen to data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

//listen to search form
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }

  renderPaginator(filteredMovies.length)
  lastPage = 1
  renderMovieList(getMoviesByPage(lastPage))
})

// listen to paginator
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return

  lastPage = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(lastPage))
})

listModeButton.addEventListener('click', (event) => {
  currentMode = VIEW_MODE.ListMode
  renderMovieList(getMoviesByPage(lastPage))
})

cascadeModeButton.addEventListener('click', (event) => {
  currentMode = VIEW_MODE.CascadeMode
  renderMovieList(getMoviesByPage(lastPage))
})

// send request to index api
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })
  .catch((err) => console.log(err))