const axios = require('axios');
const { api } = require('./utils')
const fs = require('fs');
const FormData = require('form-data');
const { getToken } = require('./auth.js');

const projectId = '2160f45b8'

const stringUpload = async (event, context) => {
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
            console.log(fileUpload.data.response);
        }
    } catch (error) {
        console.error(`There was an error: ${error}`)
    }
}

const imageUpload = async (event, conetext) => {
    const imageForm = new FormData();
    imageForm.append('name', 'IMAGE')
    imageForm.append('content', fs.createReadStream('./context.png'))
    const uploadURL = api(`context-api/v2/projects/${projectId}/contexts`)
    try {
        const token = await getToken()
        const fileUpload = await axios.postForm(uploadURL, imageForm, {
            headers: {
                ...imageForm.getHeaders(),
                Authorization: `Bearer ${token}`,
                "content-type": "multipart/form-data"
            }
        })

        if (fileUpload.data.response.code === 'SUCCESS') {
            console.log(fileUpload.data.response);
        }

    } catch (error) {
        console.error(`There was an error: ${error}`)
    }
}

// stringUpload();
imageUpload();