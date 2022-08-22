const randomCharacters = (chars) => {
    const charsShuffle = Array.from(chars)
        .map(char => {
            const sort = Math.random()
            return {
                sort, charItem: char.match(/[a-zA-Z]/g) ? sort < .5 ? char.toUpperCase() : char.toLowerCase() : char
            }
        })
        .sort((a, b) => a.sort - b.sort)
        .map(({ charItem }) => charItem).join('')
    return charsShuffle
}

module.exports = {
    randomCharacters
}