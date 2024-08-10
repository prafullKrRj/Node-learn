/**
 *          This is a simple CRUD operation using MongoDB and Express
 *          1. Create a database connection
 *          2. Create a Schema
 *          3. Create a Model
 *          4. Create a POST request to save data
 *          5. Create a GET request to get all data
 *          6. Create a PUT request to update data
 *          7. Create a DELETE request to delete data
 * */

import mongoose from 'mongoose';
import express from 'express';

const app = express();

app.use(express.json())

mongoose.connect('mongodb://localhost:27017/mydatabase').then(r => {
    console.log("Database Connected")
}).catch(err =>
    console.log(err)
)


const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    age: Number,
    createdAt: {type: Date, default: Date.now}
});
const User = mongoose.model('User', userSchema);

app.post('/users/add', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save().then(() => {
                res.send("Document Saved")
            }
        ).catch(err => {
            res.status(404).send(err)
        })
    } catch (err) {
        res.status(400).send(err)
    }
})
app.get('/users/all', async (req, res) => {
    try {
        const users = await User.find() // find all documents
        res.send(users)
    } catch (err) {
        res.status(400).send(err)
    }
})
app.put('/users/update/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,      // return the updated document
            runValidators: true // run the model validators
        })
        if (!user) return res.status(404).send('User not found');
        res.send(user);
    } catch (err) {
        res.status(400).send(err)
    }
})

app.delete('/users/delete/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) return res.status(404).send('User not found');
        res.send(user);
    } catch (err) {
        res.status(400).send(err)
    }
})


app.listen(3000, () => {
    console.log("Server is listening...")
})