const assert = require('assert');
const request = require('request');

const {
  _fetchResponseBody,
  _searchApplicationJsSrc,
  searchApplicationJsUrl,
} = require('../../lib/application-js-explorer');


describe('lib/application-js-explorer', function() {
  describe('_fetchResponseBody', function() {
    it('can fetch the body from "http://example.com"', function() {
      return _fetchResponseBody('http://example.com')
        .then(body => {
          assert.strictEqual(typeof body, 'string');
        })
      ;
    });

    it('can reject the promise from the unexisting url', function(done) {
      _fetchResponseBody('http://tabun-sonzaishinai-url-dayo.com')
        .catch(error => {
          assert(error instanceof Error);
          done();
        })
      ;
    });
  });

  describe('_searchApplicationJsSrc', function() {
    it('can search a script tag including the "application.js"', function() {
      const html = `
        <div></div>
        <script src="/assets/application.js"></script>
        <div></div>
      `;

      assert.strictEqual(
        _searchApplicationJsSrc(html),
        '/assets/application.js'
      );
    });

    it('can search a script tag including the "application-{digest}.js"', function() {
      const html = `
        <div></div>
        <script src="/assets/application-83299254db085bb3c9756256845a354db5375e393f4293abf1fa20b48e80af07.js"></script>
        <div></div>
      `;

      assert.strictEqual(
        _searchApplicationJsSrc(html),
        '/assets/application-83299254db085bb3c9756256845a354db5375e393f4293abf1fa20b48e80af07.js'
      );
    });

    it('can return null if there is no target', function() {
      const html = `
        <div></div>
        <script src="/assets/applicationx.js"></script>
        <div></div>
      `;

      assert.strictEqual(_searchApplicationJsSrc(html), null);
    });

    it('can return the first target if there are multiple targets', function() {
      const html = `
        <div></div>
        <script src="/assets/application.js"></script>
        <script src="/assets/application-83299254db085bb3c9756256845a354db5375e393f4293abf1fa20b48e80af07.js"></script>
        <div></div>
      `;

      assert.strictEqual(
        _searchApplicationJsSrc(html),
        '/assets/application.js'
      );
    });
  });

  describe('searchApplicationJsUrl', function() {
    it('can return a promise resolved with a joined url', function() {
      const _responseBodyFetcher = function(url) {
        return new Promise(resolve => {
          resolve(`
            <div></div>
            <script src="/application.js"></script>
            <div></div>
          `);
        });
      };

      return searchApplicationJsUrl('http://foo.com/', { _responseBodyFetcher })
        .then(url => {
          assert.strictEqual(url, 'http://foo.com/application.js');
        })
      ;
    });
  });
});
