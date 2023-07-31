var router = require('express').Router();

const { chatbots } = require('../controller');



module.exports = app => {
    router.post('/messages', chatbots.chatbot)

    app.use('/api', router)
}