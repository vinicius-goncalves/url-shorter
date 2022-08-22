(() => {
    const mysql = require('mysql2/promise')

    const options = {
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306,
        database: 'for_studies'
    }

    const connection = mysql.createConnection(options)
    global.connection = connection
})();

const BASE_URL_TO_LINK = `http://localhost:8080/link`

async function getAll() {
    const conn = await connection
    const sql = 'SELECT * FROM urls'
    const [ rows ] = await conn.query(sql)
    return rows
}

async function getByID(id = 123) {
    const conn = await connection
    const sql = 'SELECT * FROM urls WHERE id = ?'
    const [ resultSet ] = await conn.execute(sql, [ id ])
    return resultSet[0]
}

async function getByFullURL(url) {
    const conn = await connection
    const sql = 'SELECT * FROM urls WHERE full_url = ?'
    const [ resultSet ] = await conn.query(sql, [ url ])
    return resultSet[0]
}

async function getURLByLastPath(id = 1234) {
    const conn = await connection
    const sql = 'SELECT * FROM urls WHERE shorter_url = ?'
    const [ resultSet ] = await conn.execute(sql, [`http://localhost:8080/link/${id}`])
    return resultSet[0]
}

async function addNew(url, id) {

    const randomValue = Math.floor(Math.random() * (9999 - 999 + 1) + 999)

    const conn = await connection
    const sql = 'INSERT INTO urls VALUES (DEFAULT, ?, ?, ?)'
    const values = [ 
        randomValue, 
        url, 
        `${BASE_URL_TO_LINK}/${id}`
    ]

    const [ resultSet ] = await conn.execute(sql, values)
    return resultSet
}

async function getMaxID () {
    const conn = await connection
    const sql = 'SELECT MAX(sql_id) FROM urls'
    const [ [ { ['MAX(sql_id)']: maxId }  ] ] = await conn.query(sql)
    return maxId
}

async function getBetween(startIndex, endIndex) {
    const conn = await connection
    const sql = 'SELECT * FROM urls WHERE sql_id BETWEEN ? AND ?'
    const [ resultSet ] = await conn.execute(sql, [startIndex, endIndex])
    return resultSet
}

module.exports = {
    getAll,
    getByID,
    getURLByLastPath,
    addNew,
    getBetween,
    getMaxID,
    getByFullURL
}