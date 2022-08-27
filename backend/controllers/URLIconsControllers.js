const Utils = require('../UtilsGeneric')
const SQLIcons = require('../sql/SQLIcons')

const url = require('url')

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
}

const addNewHostname = async (request, response) => {
    try {

        const dataReceived = await Utils.getBufferData(request)
        const iconObject = JSON.parse(dataReceived)
        console.log(iconObject)
        
        const hostnameFound = await SQLIcons.getIconByHostname(iconObject.hostname)
        if(hostnameFound) {
            response.writeHead(409, defaultHeaders)
            response.write(JSON.stringify({ message: 'Hostname already exists on database' }))
            response.end()
        }

        await SQLIcons.insertNewHostname(iconObject.hostname, iconObject.icon)
        response.writeHead(201, defaultHeaders)
        response.write(JSON.stringify({ message: 'Created' }))
        response.end()

    } catch (error) {
        console.log(error)
        response.writeHead(400, defaultHeaders)
        response.end()
    }
}

module.exports = {
    addNewHostname
}