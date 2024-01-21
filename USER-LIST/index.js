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
    console.log(userInfo)
}
async function startApplication() {
    try {
        const response = await axios.get(INDEX_API_URL)
        const userList = response.data.results
        dataPanel.innerHTML = userList.map((user) => {
            return createUserItem(user)
        }).join('')

        dataPanel.addEventListener('click', (event) => {
            if (event.target.matches('.user-avatar')) {
                showUserModal(event.target.dataset.userId)
            }
        })
    } catch (error) {
        console.error(`${error}: fetch user failed`)
    }
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

startApplication()