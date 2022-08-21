const http = require('http')

const port = process.env.PORT || 8080
const URLControllers = require('../controllers/URLControllers')
const SQLConnection = require ('../SQLConnection')

const server = http.createServer(async (request, response) => {
    
    const { method, url } = request
    
    switch(method.toLowerCase()) {
        case 'get':
            if(url === '/api/urls') {
                URLControllers.getAllURLs(response)
                break
            }

            if(url.match(/\/api\/urls\/[0-9]/g)) {
                const id = url.split('/')[3]
                URLControllers.getURLByID(id, response)
                break
            }
        
            if(url.match(/\/link\/[0-9]/g)) {
                const id = url.split('/')[2]
                URLControllers.getURLByLastPath(id, response)
                break
            }
        default:
            break
    }
})

server.listen(8080, () => console.log(`Server started on port ${port}`))