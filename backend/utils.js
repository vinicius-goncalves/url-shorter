const getBufferData = (request) => {
    const promise = new Promise(resolve => {

        const buffer = []
        request.on('data', (chunk) => {
            buffer.push(chunk)
        })

        request.on('end', () => {
            resolve(Buffer.concat(buffer).toString())
        })
    })

    return promise
}

const randomCharacters = (length, chars) => {
    const charsShuffle = Array.from(chars)
        .map(char => {
            const sort = Math.random()
            console.log(sort)

            const resultObject = {
                sort, 
                character: sort < .45 ? char.toUpperCase() : char.toLowerCase()
            }
            return resultObject
        
        }).sort((a, b) => a.sort - b.sort)
          .map(({ character }) => character).join('').slice(0, length)
        
    return charsShuffle
}

module.exports = {
    randomCharacters,
    getBufferData
}