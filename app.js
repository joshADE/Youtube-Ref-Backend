const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); 

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI || 'mongodb://localhost/yt-app';
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

app.use('/users', require('./routes/userRoutes'));
app.use('/videos', require('./routes/videoRoute'));
app.use('/collections', require('./routes/collectionRoutes'));

if (process.env.NODE_ENV === 'production') {
    // Embedded React app here
    // app.use(express.static('client/build'));

    // app.get('*', (req, res) => {
    //     res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // relative path
    // })
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})