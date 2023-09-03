function api(path) {
    const baseUrl = 'https://api.smartling.com/'
    return `${baseUrl}/${path}`;
}

module.exports = {
    api
};