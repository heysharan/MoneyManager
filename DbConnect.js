const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://sharan:Guhan@cluster0.jwljn.mongodb.net/sharanmoney')

const connection = mongoose.connection

connection.on('error', err => console.log('err'))

connection.on('connected', () => console.log('Mongo DB Connection Success'))