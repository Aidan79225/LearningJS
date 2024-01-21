const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = `${BASE_URL}/api/movies/`
const POSTER_URL = `${BASE_URL}/posters/`
const dataPanel = document.querySelector('#data-panel')

function showMovieModal(id) {
    const modalTitle = document.querySelector('#movie-modal-title')
    const modalImage = document.querySelector('#movie-modal-image')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescription = document.querySelector('#movie-modal-description')
    axios.get(INDEX_URL + id).then((response) => {
        const data = response.data.results
        modalTitle.innerText = data.title
        modalDate.innerText = 'Release date: ' + data.release_date
        modalDescription.innerText = data.description
        modalImage.innerHTML = `<img src="${POSTER_URL + data.image
            }" alt="movie-poster" class="img-fluid">`
    })
}

function renderMovieList(data) {
    let rawHTML = ''
    data.forEach((item) => {
        // title, image, id 隨著每個 item 改變
        rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image
            }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite">+</button>
        </div>
      </div>
    </div>
  </div>`
    })
    dataPanel.innerHTML = rawHTML
}

dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
        showMovieModal(event.target.dataset.id)  // 修改這裡
    }
})

axios
    .get(INDEX_URL)
    .then((response) => {
        renderMovieList(response.data.results)
    })
    .catch((err) => console.log(err))

const movies = []

