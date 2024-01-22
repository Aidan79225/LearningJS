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

function createUserItem(user) {
    return `
    <div class="col-sm-2 user-item" href="#"'>
        <div>
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
    return `<li class="page-item"><a class="page-link" href="#" data-page="${idx}">${text}</a></li>`
}

function generatePaginationContainer() {
    return `<ul id="pagination" class="pagination justify-content-center"></ul>`
}

function renderPagination(userList) {
    const PAGE_SIZE = 18
    const paginationNav = document.querySelector('#pagination-nav')
    paginationNav.innerHTML = generatePaginationContainer()
    const paginationContainer = document.querySelector('#pagination')
    const totalPage = Math.ceil(userList.length / PAGE_SIZE)
    paginationContainer.innerHTML =
        [...Array(totalPage).keys()]
            .map((idx) => paginationItemTemplate(idx, idx + 1))
            .join('\n')

    const pages = chunkUserList(userList, PAGE_SIZE)
    setupPageClick(paginationContainer, pages)
    document.querySelector('.page-link').click()
}

function renderUserList(userList) {
    dataPanel.innerHTML = userList.map((user) => {
        return createUserItem(user)
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

function setupPageClick(paginationContainer, pages) {
    paginationContainer.addEventListener('click', (event) => {
        if (event.target.matches('.page-link')) {
            event.preventDefault()
            document.querySelectorAll('.page-item').forEach((pageLink) => {
                pageLink.classList.remove('active')
            })
            event.target.parentElement.classList.add('active')
            renderUserList(pages[event.target.dataset.page])
        }
    })
}

async function startApplication() {
    try {
        const response = await axios.get(INDEX_API_URL)
        const userList = response.data.results
        const searchInput = document.querySelector('#search-input')
        const searchButton = document.querySelector('#search-submit-button')

        dataPanel.addEventListener('click', (event) => {
            if (event.target.matches('.user-avatar')) {
                showUserModal(event.target.dataset.userId)
            }
        })
        searchButton.addEventListener('click', (event) => {
            event.preventDefault()
            renderPagination(searchUserByName(userList, searchInput.value))
        })

        renderPagination(userList)
    } catch (error) {
        console.error(`${error}: fetch user failed`)
    }
}

startApplication()