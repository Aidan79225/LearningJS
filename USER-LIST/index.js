const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_API_URL = `${BASE_URL}/api/v1/users`
function getShowApiUrl(userId) {
    return `${INDEX_API_URL}/${userId}`
}
const dataPanel = document.querySelector('#data-panel')
const shouldDisplayUserProperty = [
    'name',
    'surname',
    'email',
    'gender',
    'age',
    'region',
    'birthday'
]

const FAV_ID_LIST = 'FAV_ID_LIST'

async function showUserModal(userId) {
    const modalTitle = document.querySelector('#user-modal-title')
    const modalDescription = document.querySelector('#user-modal-description')
    const modalAvatar = document.querySelector('#user-modal-image')
    const response = await axios.get(getShowApiUrl(userId))
    const userInfo = response.data
    modalTitle.innerHTML = userInfo.name
    modalDescription.innerHTML = Object.keys(userInfo).filter((value) => {
        return shouldDisplayUserProperty.includes(value)
    }).map((k) => `${k}: ${userInfo[k]}`).join('<br />')
    modalAvatar.src = userInfo.avatar
}

function createFavIcon(userId) {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="red" class="bi bi-heart-fill fav-icon" viewBox="0 0 16 16" data-user-id = "${userId}">
        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
    </svg>
    `
}

function createUnFavIcon(userId) {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-heart un-fav-icon" viewBox="0 0 16 16" data-user-id = "${userId}">
        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
    </svg>
    `
}

function createUserItem(user, favList) {
    return `
    <div class="col-sm-2 user-item" href="#"'>
        <div class="avatar-group">
            ${favList.includes(user.id.toString()) ? createFavIcon(user.id) : createUnFavIcon(user.id)}
            <img src="${user.avatar}" data-user-id = "${user.id}" data-bs-toggle="modal" data-bs-target="#user-modal"
                class="img-thumbnail border border-dark user-avatar">
        </div>
        <div class="card-body">
            <h5 class="card-title">${user.name}</h5>
        </div>
    </div>
        `
}

function paginationItemTemplate(idx, text) {
    return `<li class="page-item" data-page="${idx}"><a class="page-link" href="#">${text}</a></li>`
}

function generatePaginationContainer() {
    return `<ul id="pagination" class="pagination justify-content-center"></ul>`
}

function renderPagination(userList, favList, lastPage) {
    const PAGE_SIZE = 12
    const paginationNav = document.querySelector('#pagination-nav')
    paginationNav.innerHTML = generatePaginationContainer()
    const paginationContainer = document.querySelector('#pagination')
    const totalPage = Math.ceil(userList.length / PAGE_SIZE)
    paginationContainer.innerHTML =
        `<li class="page-item" id="previous-button"><a class="page-link previous" href="#">Previous</a></li>` +
        [...Array(totalPage).keys()]
            .map((idx) => paginationItemTemplate(idx, idx + 1))
            .join('\n') +
        `<li class="page-item" id="next-button"><a class="page-link next" href="#">Next</a></li>`

    const pages = chunkUserList(userList, PAGE_SIZE)
    setupPageClick(paginationContainer, pages, favList, lastPage)
}

function renderUserList(userList, favList) {
    dataPanel.innerHTML = userList.map((user) => {
        return createUserItem(user, favList)
    }).join('')
}

function searchUserByName(userList, key) {
    return userList.filter((user) => {
        if (key === null || key === '') {
            return true
        }
        return user.name.includes(key)
    })
}

function chunkUserList(userList, chunkSize) {
    const result = [];
    for (let i = 0; i < userList.length; i += chunkSize) {
        result.push(userList.slice(i, i + chunkSize));
    }
    return result;
}

function setupPageClick(paginationContainer, pages, favList, lastPage) {
    paginationContainer.addEventListener('click', (event) => {
        if (event.target.matches('.page-link')) {
            event.preventDefault()
        }
        if (event.target.matches('.page-link.previous')) {
            lastPage[0] = Math.max(0, lastPage[0] - 1)
        } else if (event.target.matches('.page-link.next')) {
            lastPage[0] = Math.min(pages.length - 1, lastPage[0] + 1)
        } else if (event.target.matches('.page-link')) {
            lastPage[0] = parseInt(event.target.parentElement.dataset.page)
        }
        if (event.target.matches('.page-link')) {
            selectPage(lastPage[0], pages, favList)
        }
    })
    selectPage(lastPage[0], pages, favList)
}

function selectPage(lastPage, pages, favList) {
    const previousButton = document.querySelector('#previous-button')
    const nextButton = document.querySelector('#next-button')
    if (lastPage === 0) {
        previousButton.classList.add('disabled')
        nextButton.classList.remove('disabled')
    } else if (lastPage === (pages.length - 1)) {
        previousButton.classList.remove('disabled')
        nextButton.classList.add('disabled')
    } else {
        previousButton.classList.remove('disabled')
        nextButton.classList.remove('disabled')
    }

    document.querySelectorAll('.page-item').forEach((pageLink) => {
        pageLink.classList.remove('active')
        if (pageLink.dataset.page === lastPage.toString()) {
            pageLink.classList.add('active')
        }
    })
    renderUserList(pages[lastPage], favList)
}

function favOnClick(favList, target) {
    if (target.matches('.fav-icon')) {
        favList.splice(favList.indexOf(target.dataset.userId), 1)
    } else if (target.matches('.un-fav-icon')) {
        favList.push(target.dataset.userId)
    }
    localStorage.setItem(FAV_ID_LIST, JSON.stringify(favList))
}

async function startApplication() {
    try {
        const response = await axios.get(INDEX_API_URL)
        const searchInput = document.querySelector('#search-input')
        const searchButton = document.querySelector('#search-submit-button')
        const userList = response.data.results
        let currentUserList = userList
        const favList = JSON.parse(localStorage.getItem('FAV_ID_LIST') || '[]')
        const lastPage = [0]
        dataPanel.addEventListener('click', (event) => {
            if (event.target.matches('.user-avatar')) {
                showUserModal(event.target.dataset.userId)
            } else if (event.target.matches('.fav-icon')) {
                favOnClick(favList, event.target)
                renderPagination(currentUserList, favList, lastPage)
            } else if (event.target.matches('.un-fav-icon')) {
                favOnClick(favList, event.target)
                renderPagination(currentUserList, favList, lastPage)
            } else if (event.target.matches('path')) {
                favOnClick(favList, event.target.parentElement)
                renderPagination(currentUserList, favList, lastPage)
            }
        })
        searchButton.addEventListener('click', (event) => {
            event.preventDefault()
            lastPage[0] = 0
            currentUserList = searchUserByName(userList, searchInput.value)
            renderPagination(currentUserList, favList, lastPage)
        })
        renderPagination(currentUserList, favList, lastPage)
    } catch (error) {
        console.error(`${error}: fetch user failed`)
    }
}

startApplication()