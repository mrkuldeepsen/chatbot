const { default: mongoose } = require('mongoose')
mongoose.set('strictQuery', true);

mongoose.connect(`${process.env.MONGO_DB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
    .then(() => console.log('Db connection done')).catch(error => console.log('Error>>>>>>', error))


const db = {
    User: require('./user'),
}


module.exports = db