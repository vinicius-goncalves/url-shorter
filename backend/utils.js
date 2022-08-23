const getBufferData = (request) => {
    const promise = new Promise(resolve => {

        const buffer = []
        request.on('data', (chunk) => {
            buffer.push(chunk)
        })

        request.on('end', () => {
            resolve(buffer)
        })
    })

    return promise
}

const randomCharacters = (length, chars) => {
    const charsShuffle = Array.from(chars)
        .map(char => {
            
            const sort = Math.random()

            const resultObject = {
                sort, 
                char
            }

            console.log(resultObject)
            return resultObject
            
        })
        .sort((a, b) => a.sort - b.sort)
        .map(({ char }) => Math.random() < .5 ? char.toUpperCase() : char.toLowerCase())
        .join('')
        .slice(0, length)

        
    return charsShuffle
}

module.exports = {
    randomCharacters,
    getBufferData
}