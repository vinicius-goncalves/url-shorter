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

async function getURLByLastPath(id = 1234) {
    const conn = await connection
    const sql = 'SELECT * FROM urls WHERE shorter_url = ?'
    const [ resultSet ] = await conn.execute(sql, [`http://localhost:8080/link/${id}`])
    return resultSet[0]
}

module.exports = {
    getAll,
    getByID,
    getURLByLastPath
}