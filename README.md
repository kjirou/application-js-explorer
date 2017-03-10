# application-js-explorer

[![npm version](https://badge.fury.io/js/application-js-explorer.svg)](https://badge.fury.io/js/application-js-explorer)

Look for an url of application.js from Rails server


## Installation

```bash
npm install explore-application-js
```


## Usage

It is used to find the url of `application.js` which is unknown due to the digest.

```bash
explore-application-js https://anywhere-rails-app.com
https://anywhere-rails-app.com/assets/application-83299254db085bb3c9756256845a354db5375e393f4293abf1fa20b48e80af07.js
```

Even without digest you can get it.

```bash
explore-application-js https://anywhere-rails-app.com
https://anywhere-rails-app.com/assets/application.js
```

If not found, it is empty.

```bash
explore-application-js https://anywhere-not-rails-app.com

```
