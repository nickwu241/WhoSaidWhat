const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json';

/**
* @param {string} name The speaker
* @param {string} text The text to post
* @returns {string}
*/
module.exports = (name, text, context, callback) => {
  axios.post('https://hooks.slack.com/services/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', {
    text: `${name}: ${text}`
  })
    .then(response => {
      console.log(response);
      callback(null, `${response.status}`);
    })
    .catch(err => {
      console.log(err);
      callback(err);
    })
};
