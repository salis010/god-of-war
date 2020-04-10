const express = require('express')

const app = express()
const port = 3000

app.use(express.static(__dirname))
app.use(express.static(__dirname + '/dist'))

app.listen(3000, function () {
        console.log(`Listening on port ${port}...`)
})
