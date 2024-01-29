const local = './data.json'

function chunkUserList(userList, chunkSize) {
    const result = [];
    for (let i = 0; i < userList.length; i += chunkSize) {
        result.push(userList.slice(i, i + chunkSize));
    }
    while (result[result.length - 1].length < chunkSize) {
        result[result.length - 1].push({ name: " ", alias: " " })
    }
    return result;
}
const MAX_NUMBER = 100000
const ticketNumber = []

function getRandomInt() {
    return Math.floor(Math.random() * MAX_NUMBER);
}


function createTicketNumber() {
    let n = getRandomInt()
    while (ticketNumber.includes(n)) {
        n = getRandomInt()
    }
    return n
}

function createTicket(user) {

    const ticket = String(createTicketNumber()).padStart(5, "0");

    return `
    <div class="ticket-background">
        <div class="raffle-container">
            <div class="raffle-content">
                <span class="text" style="font-size: 20px;">AirDroid Taipei</span>
                    <span class="text title">RAFFLE TICKET</span>
                    <div style="display: flex; justify-content: space-between;">
                        <span class="text">February 06, 2024</span>
                        <span class="text">NO: ${ticket}</span>
                    </div>
                </div>
            </div>
            <div class="name-container">
                <div class="name-content">
                    <span class="text title">TICKET</span>
                    <table class="info-content-table">
                        <tr>
                            <td>
                                <span class="text">Name</span>
                            </td>
                            <td>
                                <span class="text value">${user.name}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="text value"></span>
                            </td>
                            <td>
                                <span class="text">${user.alias}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="text">No:</span>
                            </td>
                            <td>
                                <span class="text value">${ticket}</span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>`
}



function createPage(userList) {
    return `
    <div class="page">
        <div class="subpage">
            ${userList.map(user => createTicket(user)).join('')}
        </div>
    </div>`
}

async function startApplication() {
    try {
        const response = await axios.get(local)
        console.log(response.data[0])

        const userList = chunkUserList(response.data, 5)
        document.querySelector('#content').innerHTML = userList.map(list => createPage(list)).join('')


    } catch (error) {
        console.log(error)
    }
}

startApplication()