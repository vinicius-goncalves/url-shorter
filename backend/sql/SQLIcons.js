const ConnectionUtils = require('./ConnectionUtils')
const connection = ConnectionUtils.openConnection()

async function getAllIcons () {
    const conn = await connection
    const sql = 'SELECT * FROM urls_sites_types'
    const [ resultSet ] = await conn.query(sql)
    return resultSet
}

async function insertNewHostname (type, icon) {
    const conn = await connection
    const sql = 'INSERT INTO urls_sites_types VALUES (DEFAULT, ?, ?)'
    return (await conn.execute(sql, [ type, icon ]))
}

async function getIconByHostname (hostname) {
    const conn = await connection
    const sql = 'SELECT * FROM urls_sites_types WHERE hostname = ?'
    const [ resultSet ] = await conn.execute(sql, [ hostname ])
    return resultSet[0]
}

async function getIconBetween (startIndex, endIndex) {
    const conn = await connection
    const sql = 'SELECT * FROM urls_sites_types WHERE sql_id BETWEEN ? AND ?'
    const [ resultSet ] = await conn.execute(sql, [ startIndex, endIndex ])
    return resultSet
}

module.exports = {
    getAllIcons,
    insertNewHostname,
    getIconByHostname,
    getIconBetween
}