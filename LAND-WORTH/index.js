const DATA_URL = `https://od.moi.gov.tw/api/v1/rest/datastore/301000000A-000793-023`
const local = './data.json'

function createField(field, tag) {
    return `<${tag}>${field}</${tag}>`
}

function createHeadRow(fields) {
    return `<tr>
        ${fields.map(k => createField(k.id, 'th')).join('')}
    </tr>`
}

function createRow(record) {
    return `<tr>
        ${Object.keys(record).map(k => createField(record[k], 'td')).join('')}
    </tr>`
}
async function startApplication() {
    try {
        const response = await axios.get(local)
        const records = response.data.result.records
        console.log(response.data.result.records)
        const plane = document.querySelector('#data-plane')
        plane.innerHTML = createHeadRow(response.data.result.fields) + records.map(record => createRow(record)).join('')

    } catch (error) {
        console.error(`${error}: fetch user failed`)
    }
}
startApplication()