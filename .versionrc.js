module.exports = {
    packageFiles: [
        {
            filename: 'package.json',
            type: 'json'
        }],
    bumpFiles: [
        {
            filename: 'package.json',
            type: 'json'
        },
        {
            filename: 'package-lock.json',
            type: 'json'
        }],
    tagPrefix: '',
    issueUrlFormat: 'https://rankingcoach.atlassian.net/browse/{{id}}'
}
