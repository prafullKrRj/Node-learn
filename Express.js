const express = require("express")
const app = express()


app.get('/', (req, res) => {
    res.send("Hello World")
})

app.get('/about', (req, res) => {
    res.send('About Page');
});

app.post('/submit', (req, res) => {
    res.send('Form Submitted');
});

app.put('/update', (req, res) => {
    res.send('Resource Updated');
});

app.delete('/delete', (req, res) => {
    res.send('Resource Deleted');
});

const PORT = 3000
app.listen(PORT, () => {
    console.log("Server is listening..")
})