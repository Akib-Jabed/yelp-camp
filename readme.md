# Security Best Practice:

#### \* Don't use deprecated or vulnerable versions of express

#### \* Use TLS(Transport Layer Security) for secure data transmission. Recommended way: use Nginx

#### \* Always check/validate user input. Sanitize user input and use ORM/ODM or parameterized query

#### \* Use Helmet. Helmet will set security-related HTTP response header to protect application from some well-known web vulnerabilities

```
const helmet = require('helmet')
app.use(helmet())
```

#### \* Leaking server inforamtion. example: X-Powered-By:Express. disable the header

```
app.disable('x-powered-by')
```

Also try to use custom error handler. For production use static message instead of displaying error stack.

```
app.use((req, res, next) => {
   res.status(404).send("Sorry can't find that!")
})

app.use((err, req, res, next) => {
   console.error(err.stack)
   res.status(500).send("Something went wrong!")
})
```

#### \* Use cookies securely.

-> use session storage to store session data and saves only the id in the cookie (express-session) <br>
-> cookie-backed storage where the entire session is serialized in the cookie (cookie-session)

#### \* Don't use default session cookie name

```
const session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
   secret: 's3Cur3',
   name: 'sessionId'
}))
```

#### \* Set cookie security options

-> secure <br>
-> httpOnly <br>
-> domain <br>
-> path <br>
-> expires <br>

```
const session = require('cookie-session')
const express = require('express')
const app = express()

const expiryDate = new Date(Date.now() + 60 _ 60 _ 1000) // 1 hour
app.use(session({
   name: 'session',
   keys: ['key1', 'key2'],
   cookie: {
      secure: true,
      httpOnly: true,
      domain: 'example.com',
      path: 'foo/bar',
      expires: expiryDate
   }
}))
```

#### \* Prevent brute-force attacks against authorization (rate limit). If Nginx is used then use rate limiting in Nginx instead of express app

#### \* Prevent brute-force attacks by limiting body payload size. use body-parser

#### \* Authentication limits. block ip address after certain number of login attempts or use two-way authentication

#### \* Block JWT token after logout or if user ensure this is not he/she

#### \* Encrypt password instead of store in pain text

#### \* Ensure dependencies are secure. Check critical security vulnerabilities that could affect application by auditing or use `synk`

```
npm audit
npm audit fix
```

#### \* Using escape function in a template engine ensure that data is displayed safely

```
const templateEngine = require('template-engine');
const escape = require('escape-html');

app.get('/page', (req, res) => {
const userGeneratedContent = getUserGeneratedContent();

// Escaping user-generated content before rendering
const escapedContent = escape(userGeneratedContent);

res.render('page', { content: escapedContent });
});
```

#### \* Run Node.js as a non-root user

#### \* use eslint-plugin-security to identify potential security hotspots

#### \* Maintain secure logging and monitoring
