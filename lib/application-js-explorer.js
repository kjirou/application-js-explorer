const request = require('request');
const urlModule = require('url');


/**
 * @param {string} url - A url in which the application.js is embeded
 * @return {Promise} Reject except that the body can be fetched
 */
const _fetchResponseBody = (url) => {
  return new Promise((resolve, reject) => {
    request({ url }, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      } else if (response.statusCode !== 200) {
        reject(new Error('Invalid request'));
        return;
      }

      resolve(body);
    });
  });
};

// ex)
//
//   <script src="/assets/application-83299254db085bb3c9756256845a354db5375e393f4293abf1fa20b48e80af07.js"></script>
//
const APPLICATION_JS_SRC_MATCHER = /<script src="([^"]+?application(?:|-[0-9a-f]+)\.js)"><\/script>/;

/**
 * @param {string} html
 * @return {?string} A value of "src" attriburte in the first found application.js's script tag
 */
const _searchApplicationJsSrc = (html) => {
  const matched = html.match(APPLICATION_JS_SRC_MATCHER);

  return matched ? matched[1] : null;
};

/**
 * @param {string} url - A url in which the application.js is embeded
 * @param {(Object|undefined)} options
 * @param {?_responseBodyFetcher} [options._responseBodyFetcher] - Do not use it for testing
 * @return {Promise} Resolved with an url string or null
 */
const searchApplicationJsUrl = (url, options = {}) => {
  const fetcher = '_responseBodyFetcher' in options ? options._responseBodyFetcher : _fetchResponseBody;

  return fetcher(url)
    .then(body => {
      const applicationJsSrc = _searchApplicationJsSrc(body);

      if (applicationJsSrc) {
        return urlModule.resolve(url, applicationJsSrc);
      }

      return null;
    })
  ;
};


module.exports = {
  _fetchResponseBody,
  _searchApplicationJsSrc,
  searchApplicationJsUrl,
};
