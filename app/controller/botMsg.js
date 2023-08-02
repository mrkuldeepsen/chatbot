const { BotMsgs } = require("../model");
const fs = require('fs')
const path = require('path');
const pdf = require('pdf-parse');
const axios = require('axios');

const apiKey = 'YOUR_OPENAI_API_KEY';
const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions'; // For GPT-3.5 (Codex)

axios.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;


exports.botMsg = async (req, res) => {
    const botmsg = BotMsgs.find()
}



exports.botReply = (arg, uuid,) => {

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const keys = [];
    let resp = ''

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
    const getResp2 = (index) => {
        return index
    }
    const getKeysByValue = (obj, value) => {

        if (uuid.count === 1) {
            uuid.count = 2
            uuid.data.first_name = value.message

            return response["first_name"];
        }
        if (uuid.count === 2) {
            uuid.count = 3
            uuid.data.last_name = value.message
            return response["last_name"];
        }

        if (uuid.count === 3) {
            if (value?.message?.match(mailformat)) {
                uuid.count = 0
                uuid.data.email = value.message

                const newBotMsg = new BotMsgs(uuid.data)
                newBotMsg.save();
                return response["email"];
            } else {
                return 'Please enter a valid email address.';
            }
        }

        if (!arg?.message && arg?.file) {
            const fileBuffer = arg?.file
            const binaryData = Buffer.from(fileBuffer, 'base64');
            const name = Date.now()
            const filePath = path.join(__dirname, '..', 'upload', `${name}.pdf`); // Replace 'myfile.pdf' with your desired file name and extension
            fs.writeFileSync(filePath, binaryData);

            let dataBuffer = fs.readFileSync(filePath);

            pdf(dataBuffer)
                .then(function (data) {

                    // number of pages
                    // console.log('numpages>>>', data.numpages);
                    // number of rendered pages
                    // console.log('numrender>>', data.numrender);
                    // PDF info
                    // console.log('info>>>', data.info);
                    // PDF metadata
                    // console.log('metadata>>>', data.metadata);
                    // PDF.js version
                    // check https://mozilla.github.io/pdf.js/getting_started/
                    // console.log(data.version);
                    // PDF text

                    console.log('text>>', data.text);
                    resp = data.text

                    const prompt = `act as an human resource chat bot ask me related MCQ with respect to my information below${resp}`;
                    generateResponse(prompt)
                        .then((response) => {
                            console.log('ChatGPT response:>>>>>>>>', response);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                })

            return resp
        }


        for (const key in obj) {

            if (Object.prototype.hasOwnProperty.call(obj, key)) {

                const valuesArray = obj[key];

                if (valuesArray.includes(value.message)) {

                    key === 'greetings' ? uuid.count++ : uuid.count = 0

                    keys.push(key);
                }
            }
        }

        return getResp(keys);
    }

    return getKeysByValue(userInputa, arg);
};


async function generateResponse(prompt) {
    try {
        const response = await axios.post(apiUrl, {
            prompt: prompt,
            max_tokens: 150, // Adjust as needed
            temperature: 0.7, // Adjust to control the randomness of the response (higher values = more random)
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error generating response:', error);
        return 'Error generating response.';
    }
}