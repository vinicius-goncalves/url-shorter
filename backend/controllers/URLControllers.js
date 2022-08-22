const SQLConnection = require('../SQLConnection')
const Utils = require('../Utils.js')

const url = require('url')

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
        response.write(JSON.stringify({ message: 'An error has occurred when tried to get all URLs.' }))
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
            response.write(JSON.stringify({ message: 'URL searched by ID has not been found.' }))
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

const getURLByLastPath = async (id, response) => {

    try {

        const urlFound = await SQLConnection.getURLByLastPath(id)

        if(!urlFound) {
            response.writeHead(404, { 'Content-Type': 'application/json' })
            response.write(JSON.stringify({ message: 'Link not found on our database. Try again.' }))
            response.end()
            return
        }
    
        const { full_url } = urlFound
        response.writeHead(301, { Location: full_url })
        response.end()

    } catch (error) {
        response.writeHead(400, { 'Content-Type': 'application/json' })
        response.write(JSON.stringify({ message: 'An error has occurred when tried to get the URL by ID path' }))
        response.end()
    }
}

const addNewURL = (request, response) => {
    try {
        const data = new Promise(resolve => {
            const buffer = []
            request.on('data', chunk => {
                buffer.push(chunk)
            })
            request.on('end', () => {
                resolve(Buffer.concat(buffer).toString())
            })
        })

        data.then(async dataReceived => {
            const url = JSON.parse(dataReceived)
            const { newURL } = url
            
            const resultSet = await SQLConnection.addNew(newURL, Utils.randomCharacters('abcd123'))
            console.log(resultSet)

            response.writeHead(201, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
            response.write(JSON.stringify({ message: 'Created' }))
            response.end()
        })

    } catch (error) {
        console.log(error)
        response.writeHead(400, { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' })
        response.write(JSON.stringify({ message: 'Error' }))
        response.end()
    }
}

const getURLsByParamsAndBetween = async (urlWithParams, response) => {
    try {
         
        const maxId = await SQLConnection.getMaxID()

        const params = url.parse(urlWithParams, true).query
        const { ['page']: p, ['limit']: l } = params
        
        const page = Number.parseInt(p)
        const limit = Number.parseInt(l)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const result = new Promise(resolve => {

            const pageResult = Object.create(null)
            
            const thereAreMoreResults = endIndex < maxId ? true : false
            if(thereAreMoreResults) {
                pageResult.nextPage = {
                    next: page + 1,
                    limit,
                    fullUrl: `http://localhost:8080/api/urls/search?page=${page + 1}&limit=${limit}`
                }
            }

            const thereArePreviousResults = startIndex > 0 ? true : false
            if(thereArePreviousResults) {
                pageResult.previousPage = {
                    previous: page - 1,
                    limit,
                    fullUrl: `http://localhost:8080/api/urls/search?page=${page - 1}&limit=${limit}`
                }
            }
            resolve(pageResult)
        })

        result.then(async (result) => {

            const resultSet = await SQLConnection.getBetween((startIndex + 1), endIndex)
            result.items = resultSet
    
            response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
            response.write(JSON.stringify(result, null, 2))
            response.end()
        })

    } catch (error) { 
        console.log(error)
        response.writeHead(400, { 'Access-Control-Allow-Origin': '*' })
        response.end()
    }
}

module.exports = {
    getAllURLs,
    getURLByID,
    getURLByLastPath,
    addNewURL,
    getURLsByParamsAndBetween
}