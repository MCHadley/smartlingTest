const axios = require('axios');
const { api } = require('./utils')
const fs = require('fs');
const FormData = require('form-data');
const { getToken } = require('./auth.js');
const { log } = require('console');

const stringUpload = async (event, context) => {
    const projectId = '2160f45b8'
    const stringForm = new FormData();
    stringForm.append('file', fs.createReadStream('./localizable.strings'))
    stringForm.append('fileUri', 'translationFile')
    stringForm.append('fileType', "ios")
    stringForm.append('smartling.[placeholder_format_custom]', '(\{\{.+?\}})')
    const uploadURL = api(`files-api/v2/projects/${projectId}/file`)
    try {
        const token = await getToken()
        const fileUpload = await axios.postForm(uploadURL, stringForm, {
            headers: {
                ...stringForm.getHeaders(),
                Authorization: `Bearer ${token}`,
                "content-type": "multipart/formdata"
            }
        })
        if (fileUpload.data.response.code === 'SUCCESS') {
            console.log("success");
        }
        return fileUpload
    } catch (error) {
        console.error(`There was an error: ${error}`)
    }
}

stringUpload();