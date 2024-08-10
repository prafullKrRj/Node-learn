const express = require("express")
const students = require("./Students")
const app = express()


app.use((req, res, next) => {
    console.log("Logging Middleware")
    console.log(req.url)
    next()
})

app.use(express.json())

app.get('/user/:id', (req, res) => {
    const userId = req.params.id
    res.send(`UserId: ${userId}`).status(200)
})

app.get('/search', (request, result) => {
    const query = request.query.q
    result.send(`Your Query ${query}`)
})

app.post('/data', (req, res) => {
    res.send("Data page")
})

app.post('/submit', (req, res) => {
    const {name, email} = req.body
    res.send(`Name: ${name}, Mail: ${email}`)
})
app.get('/students', (req, res) => {
    res.status(200).json(
        students
    )
})

app.listen(
    3000, () => {
        console.log("Listening")
    }
)