const axios = require('axios');

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

module.exports = {
    api,
    uploadFile
};