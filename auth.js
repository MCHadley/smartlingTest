const axios = require('axios');
const creds = require('./credentials.json')
const fs = require('fs');
const path = require('path');
const dotenv = require("dotenv");
const { setTimestamp } = require('./utils');

const generateToken = async () => {
    dotenv.config()
    try {
        debugger
        console.log("running generate token");
        const response = await axios.post('https://api.smartling.com/auth-api/v2/authenticate', {
            userIdentifier: creds.userIdentifier,
            userSecret: creds.userSecret
        })
        if (response.status === 200) {
            await fs.writeFileSync(
                path.resolve(__dirname, '.env'),
                `AUTH_TOKEN=${response.data.response.data.accessToken}\n`,
                { flag: 'a' }
            );
            debugger
            setTimeout(function () {
                console.log('timeout completed');
            }, 3000)
            console.log(`api response: ${response.data.response.data.accessToken}`);
            console.log(`token created: ${process.env.AUTH_TOKEN}`);
        } else {
            return 'There was an error with your request'
        }
    } catch (err) {
        console.error(`Something went wrong ${err}`)
    }
}

const getToken = async (event, context) => {
    dotenv.config()
    if (!process.env.AUTH_TOKEN) {
        console.log('running get token');
        setTimestamp();
        await generateToken();
        console.log(`get token: ${process.env.AUTH_TOKEN}`);
        return process.env.AUTH_TOKEN
    } else {
        const timestamp = parseInt(process.env.TIMESTAMP_VARIABLE || '0', 10);
        const currentTime = Date.now();
        const elapsedTimeInSeconds = (currentTime - timestamp) / 1000;

        if (elapsedTimeInSeconds >= 480) {
            console.log('token refreshed');
            setTimestamp();
            await generateToken();
            return process.env.AUTH_TOKEN
        } else {
            console.log('timestamp still active');
            return process.env.AUTH_TOKEN
        }
    }
}

module.exports = {
    getToken
};