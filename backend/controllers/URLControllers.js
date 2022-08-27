const SQLUrls = require('../sql/SQLUrls')
const SQLIcons = require('../sql/SQLIcons')
const Utils = require('../UtilsGeneric')

const url = require('url')

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET'
}

const getAllURLs = async (response) => {

    try {
        
        const allURLs = await SQLUrls.getAll()
        
        response.writeHead(200, headers)
        response.write(JSON.stringify(allURLs, null, 2))
        response.end()

    } catch (error) {
        console.log(error)
        response.writeHead(400, defaultHeaders)
        response.write(JSON.stringify({ message: 'An error has occurred when tried to get all URLs.' }))
        response.end()
    }
}

const getURLByID = async (id, response) => {

    try {
        
        const urlFound = await SQLUrls.getByID(id)

        if(!urlFound) {
            response.writeHead(404, defaultHeaders)
            response.write(JSON.stringify({ message: 'URL searched by ID has not been found.' }))
            response.end()
            return
        }

        response.writeHead(200, defaultHeaders)
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

        const urlFound = await SQLUrls.getURLByLastPath(id)

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

const addNewURL = async (request, response) => {
    try {

        const getData = await Utils.getBufferData(request)
        const dataReceivedObj = JSON.parse(getData)

        const { type } = dataReceivedObj

        switch(type) {
            case 'icon':
                
                response.writeHead(200, defaultHeaders)
                response.end()
                break
            default:
                
                const { newURL } = dataReceivedObj

                const fullURLFound = await SQLUrls.getByFullURL(newURL)
                if(fullURLFound) {
                    response.writeHead(409, defaultHeaders)
                    response.write(JSON.stringify({ urlCreated: false, message: 'The URL to short already exists.' }))
                    response.end()
                    return
                }
                
                let linkGenerated = Utils.randomCharacters(7, 'abcdefgtuvwxyz1234567')
                const URLFound = await SQLUrls.getURLByLastPath(linkGenerated)

                let exit = false
                while(!exit) {
                    if(URLFound) {
                        linkGenerated = Utils.randomCharacters(7, 'abcdefgtuvwxyz1234567')
                        const newSearchResult = await SQLUrls.getURLByLastPath(linkGenerated)
                        if(!newSearchResult) {
                            exit = true
                            return
                        }

                        exit = false
                        return
                    }
                    exit = true
                }

                const urlDetails = url.parse(newURL, true)

                await SQLUrls.addNew(newURL, urlDetails.hostname.replace('www.', ''), linkGenerated)
                response.writeHead(201, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
                response.write(JSON.stringify({ urlCreated: true, id: linkGenerated, message: 'The URL has been created succeffuly!' }))
                response.end()
                break
        }

    } catch (error) {
        console.log(error)
        response.writeHead(400, { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' })
        response.write(JSON.stringify({ message: 'Error' }))
        response.end()
    }
}

const getURLsByParamsAndBetween = async (urlWithParams, response) => {
    try {
         
        const maxId = await SQLUrls.getMaxID()

        const params = url.parse(urlWithParams, true).query
        const { ['page']: p, ['limit']: l } = params
        
        const page = Number.parseInt(p)
        const limit = Number.parseInt(l)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const pagesInformationObject = new Promise(resolve => {

            const pageResult = Object.create(null)
            
            const thereAreMoreResults = endIndex < maxId ? true : false
            switch(thereAreMoreResults) {
                case true:
                    pageResult.nextPage = {
                        areThereMorePages: true,
                        nextPageNumber: page + 1,
                        limit,
                        fullUrl: `http://localhost:8080/api/urls/search?page=${page + 1}&limit=${limit}`
                    }
                    break

                case false:
                    pageResult.nextPage = {
                        areThereMorePages: false
                    }
                    break
            }

            const thereArePreviousResults = startIndex > 0 ? true : false
            switch(thereArePreviousResults) {
                case true:
                    pageResult.previousPage = {
                        areTherePreviousPages: true,
                        previousPageNumber: page - 1,
                        limit,
                        fullUrl: `http://localhost:8080/api/urls/search?page=${page - 1}&limit=${limit}`
                    }
                    break
                case false:
                    pageResult.previousPage = {
                        areTherePreviousPage: false
                    }
                    break
            }

            resolve(pageResult)
        })

        const resultPagesInformation = await pagesInformationObject

        const resultSet = await SQLUrls.getBetween((startIndex + 1), endIndex)

        const resultWithImages = resultSet.map(async item => {
            const iconItem = await SQLIcons.getIconByHostname(item.hostname_identified)
            const unknownItem = await SQLIcons.getIconByHostname('unknown')
            if(!iconItem) {
                item.icon = {
                    icon: Buffer.from(unknownItem.icon).toString('ascii')
                }
                return item
            }

            item.icon = {
                ...iconItem,
                icon: Buffer.from(iconItem.icon).toString('ascii')
            }

            return item
        })

        const items = await Promise.all(resultWithImages)
        const final = {
            resultPagesInformation,
            items
        }

        response.writeHead(200, defaultHeaders)
        response.write(JSON.stringify(final, null, 2))
        response.end()

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