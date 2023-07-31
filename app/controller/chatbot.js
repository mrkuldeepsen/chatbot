const { handleResponse, handleError } = require("../utils/helper");

exports.chatbot = async (req, res) => {
    try {
        const { message } = req.body;
        handleResponse(res, 200)
    } catch (error) {
        handleError(error.message, req, res)
    }
};


var count = 0;

exports.botReply = (arg) => {
    const obj = {
        greetings: ['hi', 'Hi', 'Hello', 'hello'],
        pupose: ['General inquiry', 'Career options'],
        professions: ['Human resource', 'Developer', 'UI/UX designer', 'Marketing', 'Manager'],
        status: ['Experience', 'Fresher'],
        positions: ['Node developer', 'React Developer', 'MERN developer', 'React native developer', 'Flutter']
    };


    function isValueExistInObject(obj, index, value) {

        const propertyKeys = Object.keys(obj);

        const propertyIndex = propertyKeys[index];
        if (!propertyIndex) {
            return false;
        }
        const propertyValue = obj[propertyIndex];

        if (typeof propertyValue === 'string') {
            if (propertyValue === value) {
                count++;
                return value;
            } else {
                return 'fdgsfdgsfdgsd';
            }
        }

        if (Array.isArray(propertyValue) && propertyValue.includes(value)) {
            count++;
            return ['Hello! How can I assist you today?', 'Please enter your email.'];
        }

        if (typeof propertyValue === 'number') {
            count++;
            return propertyValue === value;
        }

        return 'this is not match';
    };

    return isValueExistInObject(obj, count, arg)



    // if (isGreeting) return ['Hello! How can I assist you today?', 'Please enter your email.']

    // if (isPurpose) return ['Human resource', 'Please enter your email.']

    // var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // if (arg.match(mailformat)) {
    //     const email = arg
    //     return ['Please enter', 'Please enter your email.']

    // }
};