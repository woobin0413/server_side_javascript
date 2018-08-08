# Server Side Javascript
Used Node.js, server side javascript, framework, module management, development of network application

## Description app_mysql
Login, Logout, Register, Facebook Strategy, Local Strategy, session-passport, cookie

Handling of deserializeUser and serializeUser.

## Serialization and deserialization
Serialization and deserialization are important concept. To serialize an object means to convert its state to a byte stream so way that the byte stream can be reverted back into a copy of the object.

In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request. If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.

Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.

In the code that you have written, only the user ID is serialized to the session. When subsequent requests are received, this ID is used to find the user, which will be restored to req.user.

In order to give developers freedom to user whichever database they want, whatever data they want to serialize, they can do it in their own way, the serialization and deserialization logic is left to us to implement.
https://stackoverflow.com/questions/28691215/when-is-the-serialize-and-deserialize-passport-method-called-what-does-it-exact

## Use of Passport
Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application. A comprehensive set of strategies support authentication using a username and password, 
Facebook, Twitter, and more.

For More Info About Passport
<br>
http://www.passportjs.org/

## Installation

git/clone/https://github.com/woobin0413/server_side_javascript.git

## Usage 

Nowadays it is possible to write both front-end and back-end of web applications in Javascript, making app deployment much easier and more efficient.

Simple Node web Application using Facebook Authentication (Passport)

## Development setup

```sh
git clone this module
cd to the folder
npm init
npm install
node app_mysql.js or supervisor app_mysql.js
```

## Release History

* 0.2.1
    * CHANGE: Update docs (module code remains unchanged)
* 0.2.0
    * EDIT: Encrpytion Tool (Hash && Salt)
    * ADD: Facebook Authentication
* 0.1.1
    * FIX: Crash when redirecting `logout`
* 0.1.0
    * The first proper release
* 0.0.1
    * Work in progress

## Meta

Name : SpaceBoy

See ``LICENSE`` for more information.

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki
