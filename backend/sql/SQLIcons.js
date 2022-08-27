const ConnectionUtils = require('./ConnectionUtils')
const connection = ConnectionUtils.openConnection()

const getAllIcons = async () => {
    const conn = await connection
    const sql = 'SELECT * FROM urls_sites_types'
    const [ resultSet ] = conn.query(sql)
    return resultSet
}

const addNewIcon = async (type, icon) => {
    const conn = await connection
    const sql = 'INSERT INTO urls_sites_types VALUES (DEFAULT, ?, ?)'
    return (await conn.execute(sql, [ type, icon ]))
}

const getIconByHostname = async (hostname) => {
    const conn = await connection
    const sql = 'SELECT * FROM urls_sites_types WHERE hostname = ?'
    const [ resultSet ] = await conn.execute(sql, [ hostname ])
    return resultSet[0]
}

module.exports = {
    getAllIcons,
    addNewIcon,
    getIconByHostname
}