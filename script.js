const { api, uploadFile, downloadFile } = require('./utils')
const fs = require('fs');
const path = require('path')
const FormData = require('form-data');
const { getToken } = require('./auth.js');
const axios = require('axios');
const creds = require('./credentials.json')

const projectId = '2160f45b8'

const stringUpload = async () => {
    debugger
    await getToken()
    const stringForm = new FormData();
    stringForm.append('file', fs.createReadStream('./localizable.strings'))
    stringForm.append('fileUri', 'translationFile.txt')
    stringForm.append('fileType', "ios")
    stringForm.append('smartling.placeholder_format_custom', '\\{\\{.+?\\}\\}')
    const uploadURL = api(`files-api/v2/projects/${projectId}/file`)
    try {
        console.log('making api call');
        console.log(`token from credss file: ${creds.token}`);
        const headers = {
            headers: {
                ...stringForm.getHeaders(),
                Authorization: `Bearer ${creds.token}`,
                "content-type": "multipart/form-data"
            }
        }
        const response = await uploadFile(uploadURL, stringForm, headers)
        return response
    } catch (error) {
        console.error(`There was an error: ${error}`)
    }
}

const imageUpload = async (event, context) => {
    const imageForm = new FormData();
    imageForm.append('name', 'IMAGE')
    imageForm.append('content', fs.createReadStream('./context.png'))
    const uploadURL = api(`context-api/v2/projects/${projectId}/contexts`)
    try {
        const token = await getToken()
        const headers = {
            headers: {
                ...imageForm.getHeaders(),
                Authorization: `Bearer ${token}`,
                "content-type": "multipart/form-data"
            }
        }
        const response = await uploadFile(uploadURL, imageForm, headers)
    } catch (error) {
        console.error(`There was an error: ${error}`)
    }
}

const translationDownload = async (event, context) => {
    const fileUri = 'translationFile.txt'
    const downloadURL = api(`files-api/v2/projects/${projectId}/locales/all/file/zip?fileUri=${fileUri}`)
    try {
        const token = await getToken()
        const response = await axios.get(downloadURL, {
            responseType: 'stream',
            headers: { Authorization: `Bearer ${token}` },
        });
        const savePath = path.join(__dirname, 'translations.zip')
        const writer = fs.createWriteStream(savePath)
        response.data.pipe(writer)

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.log('File downloaded successfully.');
    } catch (error) {
        console.error(`There was an error: ${error}`);
    }
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('Usage: node myScript.js [stringUpload | imageUpload]');
} else {
    const functionName = args[0];
    if (functionName === 'stringUpload') {
        stringUpload();
    } else if (functionName === 'imageUpload') {
        imageUpload();
    } else if (functionName === 'translationDownload') {
        translationDownload();
    } else {
        console.log('Invalid function name. Use "stringUpload" or "imageUpload".');
    }
}