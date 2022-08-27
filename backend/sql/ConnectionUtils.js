const openConnection = () => {

    const mysql = require('mysql2/promise')
    
    const database = {
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306,
        database: 'for_studies'
    }

    const connection = mysql.createConnection(database)
    return connection
}

module.exports = {
    openConnection
}