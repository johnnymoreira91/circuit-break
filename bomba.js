const axios = require('axios').default

let sender = function() {
    axios.get('http://localhost:3000/')
}

for (let i = 0; i < 100000; i++) {
    // sender().catch(console.log)
    axios.get('http://localhost:3000/').catch(console.log)
    // console.log(i)
}
console.log('done')