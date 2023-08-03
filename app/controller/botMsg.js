const { BotMsgs } = require("../model");
const fs = require('fs')
const path = require('path');
const pdf = require('pdf-parse');
const axios = require('axios');


const apiKey = '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';
const apiUrl = 'https://api.openai.com/v1/chat/completions'; // For GPT-3.5 (Codex)
axios.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;


exports.botMsg = async (req, res) => {
    const botmsg = BotMsgs.find()
}

exports.botReply = (arg, uuid,) => {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const keys = [];
    let resp = ''


    const steps = ['greetings', 'first_name', 'last_name', 'email', 'purpose', 'professions', 'status', 'positions', 'candidateCV']

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
        chatgptRespons: ''
    }

    const getResult = (result) => {
        return result?.content
    }

    const getResp = (index) => {
        return response[index]
    }

    const getKeysByValue = (obj, value) => {
        if (value?.message === 'skip') {
            let response = steps[uuid.count];
            uuid.count++
            return getResp(response)
        };

        if (uuid.count === 1) {
            uuid.data.first_name = value.message

        }
        
        if (uuid.count === 2) {
            uuid.data.last_name = value.message
        }

        if (uuid.count === 3) {
            if (value?.message?.match(mailformat)) {
                uuid.data.email = value.message
                const newBotMsg = new BotMsgs(uuid.data)
                newBotMsg.save();
            } else {
                return 'Please Enter vailid email and email is require!'
            }
        }


        if (!arg?.message && arg?.file) {
            const fileBuffer = arg?.file
            const binaryData = Buffer.from(fileBuffer, 'base64');
            const name = Date.now()
            const filePath = path.join(__dirname, '..', 'upload', `${name}.pdf`);
            fs.writeFileSync(filePath, binaryData);

            let dataBuffer = fs.readFileSync(filePath);

            pdf(dataBuffer)
                .then(async (data) => {
                    resp = data.text
                    const prompt = `act as an human resource chat bot ask me related MCQ with respect to my information below${resp}`;

                    const newprompt = {
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                role: "user",
                                content: prompt
                            }
                        ]
                    };

                    try {
                        const gptres = await generateResponse(newprompt)
                        getpdfMCq = gptres && gptres?.content;

                    } catch (error) {
                        console.error('Error:', error.message);
                        return error;
                    }
                })
        
            return resp
        }

        let response = steps[uuid.count];
        uuid.count++

        return getResp(response)

    }

    return getKeysByValue(userInputa, arg);
};


async function generateResponse(newprompt) {
    try {
        const response = await axios.post(apiUrl, {
            model: 'gpt-3.5-turbo',
            messages: newprompt.messages, // Use 'messages' property here
            max_tokens: 150,
            temperature: 0.7,
        });

        return response.data.choices[0].message
    }
    catch (error) {
        console.error('Error generating response:', error.response ? error.response.data : error);
        return error;
    }
}