const { fileUploader } = require("../middleware/middleware");
const { BotMsgs } = require("../model");

exports.botMsg = async (req, res) => {
    const botmsg = BotMsgs.find()
}



exports.botReply = (arg, uuid,) => {

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const userInputa = {
        greetings: ['hi', 'Hi', 'hello'],

        first_name: '',
        last_name: '',
        email: '',

        purpose: ['general inquiry', 'career options'],

        professions: ['human resource', 'developer', 'ui/ux designer', 'marketing', 'manager'],
        status: ['experience', 'fresher'],
        positions: ['node developer', 'react developer', 'mern developer', 'react native developer', 'flutter'],

        candidateCV: ''
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

    const getKeysByValue = (obj, value) => {

        if (uuid.count === 1) {
            uuid.count = 2
            uuid.data.first_name = value

            return response["first_name"];
        }
        if (uuid.count === 2) {
            uuid.count = 3
            uuid.data.last_name = value
            return response["last_name"];
        }

        if (uuid.count === 3) {
            if (value.match(mailformat)) {
                uuid.count = 0
                uuid.data.email = value

                const newBotMsg = new BotMsgs(uuid.data)
                newBotMsg.save();
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

                    key === 'greetings' ? uuid.count++ : uuid.count = 0

                    keys.push(key);
                }
            }
        }

        return getResp(keys);
    }

    return getKeysByValue(userInputa, arg.toLowerCase());
};
