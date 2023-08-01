// const { BotMsg } = require("../model");

exports.botMsg = async (req, res) => {

}

var count = 0;

const userValue = {
    first_name: '',
    last_name: '',
    email: '',
    purpose: '',
    professions: '',
    status: '',
}

exports.botReply = (arg) => {

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const userInputa = {
        greetings: ['hi', 'Hi', 'hello'],

        first_name: '',
        last_name: '',
        email: '',

        purpose: ['general inquiry', 'career options'],

        professions: ['human resource', 'developer', 'ui/ux designer', 'marketing', 'manager'],
        status: ['experience', 'fresher'],
        positions: ['node developer', 'react developer', 'mern developer', 'react native developer', 'flutter']
    };

    const response = {
        greetings: ['Hello there! 👋', 'Welcome to company name', 'Could you please provide your first name?'],

        first_name: ['Could you please provide your last name?'],
        last_name: ['Could you please provide your email address?'],


        email: [`Please select your popuse`, 'General inquiry', 'Career options'],
        purpose: ['Human resource', 'Developer', 'UI/UX designer', 'Marketing', 'Manager'],

        professions: [`Are you ...?`, 'Experience', 'Fresher'],

        status: [`Could you please provide your position?`, 'Node developer', 'React Developer', 'MERN developer', 'React native developer', 'Flutter'],
        positions: [`Please upload your CV`],
        thankyou: `Thank you for your time! Before we wrap up, is there anything else you would like to share with us that we haven't discussed yet?`,
        end: `Thank you for submitting your information. We will be in contact soon.`,
    }


    const getResp = (index) => {
        return response[index]
    }

    const getKeysByValue = async (obj, value) => {

        if (count === 1) {
            count = 2
            userValue.first_name = value

            return response["first_name"];
        }
        if (count === 2) {
            count = 3
            userValue.last_name = value
            return response["last_name"];
        }

        if (count === 3) {
            if (value.match(mailformat)) {
                count = 0
                userValue.email = value
                const newChatbot= new BotMsg(userInputa)
                await newChatbot.save();
                return response["email"];
            } else {
                return 'Please enter a valid email address.';
            }
        }

        const keys = [];
        for (const key in obj) {

            if (Object.prototype.hasOwnProperty.call(obj, key)) {

                const valuesArray = obj[key];
                if (valuesArray.includes(value)) {
                    key === 'greetings' ? count++ : count = 0
                    keys.push(key);
                }
            }
        }

        return getResp(keys);
    }
    return getKeysByValue(userInputa, arg.toLowerCase());
};