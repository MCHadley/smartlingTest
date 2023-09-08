const axios = require('axios');
const creds = require('./credentials.json')
const fs = require('fs');

const generateToken = async () => {
    try {
        console.log("running generate token");
        const response = await axios.post('https://api.smartling.com/auth-api/v2/authenticate', {
            userIdentifier: creds.userIdentifier,
            userSecret: creds.userSecret
        })
        if (response.status === 200) {
            return response.data.response.data.accessToken
        } else {
            return 'There was an error with your request'
        }
    } catch (err) {
        console.error(`Something went wrong ${err}`)
    }
}

const getToken = async () => {
    if (!creds.token) {
        console.log('running get token');
        const timestamp = Date.now()
        const token = await generateToken()
        const data = JSON.stringify({ timestamp: timestamp, token: token, userIdentifier: creds.userIdentifier, userSecret: creds.userSecret, projectId: creds.projectId })
        fs.writeFile('credentials.json', data, function () {
            console.log('token saved');
        })
    } else {
        const timestamp = parseInt(creds.timestamp || '0', 10);
        const currentTime = Date.now();
        const elapsedTimeInSeconds = (currentTime - timestamp) / 1000;

        if (elapsedTimeInSeconds >= 480) {
            const timestamp = Date.now()
        } else {
            console.log('timestamp still active');
        }
    }
}

module.exports = {
    getToken
};