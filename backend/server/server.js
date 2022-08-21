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
                const urlFound = await SQLConnection.getURLByLastPath(Number(id))

                if(!urlFound) {
                    response.writeHead(404, { 'Content-Type': 'application/json' })
                    response.write(JSON.stringify({ message: 'Link not found on our database. Try again.' }))
                    response.end()
                    return
                }

                const { full_url } = urlFound
                console.log(full_url)

                response.writeHead(301, { Location: full_url })
                response.end()

                break
            }
        default:
            break
    }
})

server.listen(8080, () => console.log(`Server started on port ${port}`))