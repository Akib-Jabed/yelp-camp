const express = require("express");
const path = require("path")

const app =  express()
const port = 3000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    // res.send("Hello World");
    res.render('home');
})

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})