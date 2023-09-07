const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require("dotenv");

function api(path) {
    const baseUrl = 'https://api.smartling.com/'
    return `${baseUrl}/${path}`;
}

async function uploadFile(url, form, headers) {
    try {
        const response = await axios.postForm(url, form, headers)
        if (response.data.response.code === 'SUCCESS') {
            return response.data.response
        }
    } catch (error) {
        console.error(`There was an error: ${error}`)
    }
}

function setTimestamp() {
    dotenv.config()
    if (!process.env.TIMESTAMP_VARIABLE) {
        const timestamp = Date.now();
        fs.writeFileSync(
            path.resolve(__dirname, '.env'),
            `TIMESTAMP_VARIABLE=${timestamp}\n`,
            { flag: 'a' }
        );
        console.log(`Timestamp set: ${timestamp}`);
        return
    } else {
        return
    }
};

module.exports = {
    api,
    uploadFile,
    setTimestamp
};