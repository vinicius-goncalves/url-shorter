const SQLConnection = require('../SQLConnection')

const getAllURLs = async (response) => {

    try {
        
        const allURLs = await SQLConnection.getAll()
        response.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
         })
        response.write(JSON.stringify(allURLs, null, 2))
        response.end()

    } catch (error) {
        console.log(error)
        response.writeHead(400, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
        })
        response.write(JSON.stringify({ message: 'An error has occurred when tried to get all products.' }))
        response.end()
    }
}

const getURLByID = async (id, response) => {

    try {
        
        const urlFound = await SQLConnection.getByID(id)

        if(!urlFound) {
            response.writeHead(404, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
            response.write(JSON.stringify({ message: 'Product searched by ID has not been found.' }))
            response.end()
            return
        }

        response.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
        response.write(JSON.stringify(urlFound))
        response.end()

    } catch (error) {
        console.log(error)
        response.writeHead(400)
        response.end()
    }
}

module.exports = {
    getAllURLs,
    getURLByID
}