const axios = require('axios');
const creds = require('./credentials.json')

const getToken = async (event, context) => {
    try {
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

module.exports = {
    getToken
};