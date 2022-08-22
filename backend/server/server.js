const http = require('http')
const urlNode = require('url')

const port = process.env.PORT || 8080
const URLControllers = require('../controllers/URLControllers')

const server = http.createServer(async (request, response) => {
    
    const { method, url } = request
    
    switch(method.toLowerCase()) {
        case 'get':
            if(url.match('/api/urls/search')) {
                URLControllers.getURLsByParamsAndBetween(url, response)
                break
            }

            if(url === '/api/urls') {
                URLControllers.getAllURLs(response)
                break
            }

            if(url.match(/\/api\/urls\/[0-9]/g)) {
                const id = url.split('/')[3]
                URLControllers.getURLByID(id, response)
                break
            }
        
            if(url.match(/\/link\/[a-zA-Z0-9]/g)) {
                const id = url.split('/')[2]
                console.log(id)
                URLControllers.getURLByLastPath(id, response)
                break
            }
        case 'post':
            if(url === '/api/urls/new') {
                URLControllers.addNewURL(request, response)
                break
            }
        case 'options':
            response.writeHead(200, { 'Access-Control-Allow-Origin': '*' })
            response.end()
            break
        default:
            break
    }
})

server.listen(8080, () => console.log(`Server started on port ${port}`))