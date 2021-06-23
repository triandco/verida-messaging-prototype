# Verida messaging prototype
This is a prototype to test messaging feature of Verida. We are using NEAR as the provider.

## Environment
* Node v15.2.0

## Reproduction

1. Install the dependencies.
  ```bash
  npm install
  ```
2. Start webpack:
  ```bash
  npm run dev
  ```
3. Navigate to [localhost:8080](http://localhost:8080) in your browser. Tap connect to see your DID displayed.
4. In a different browser, navigate to [localhost:8080](http://localhost:8080). Connect with a different account. In this new window, use your DID from the first browser to send a message.

## Expected behaviour
Message sent

## Actual
Message not sent. Received error message in console:
```
Uncaught (in promise) Error: Invalid private key format. Expecting 32 bytes, but got 64
    at W (index.js:1)
    at Object.exports.SimpleSigner (index.js:1)
    at Outbox._callee$ (outbox.js:148)
    at tryCatch (runtime.js:63)
    at Generator.invoke [as _invoke] (runtime.js:293)
    at Generator.next (runtime.js:118)
    at asyncGeneratorStep (outbox.js:24)
    at _next (outbox.js:26)
```