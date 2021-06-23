# Verida messaging prototype
This is a prototype to test permission feature of Verida datastore.

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
3. Navigate to [localhost:8080](http://localhost:8080) in your browser. 
4. Tap connect to get your DID
5. Give database a name
6. Tap create to create new database

## Expected behaviour
Permission of newly created database reflect permission configuration

## Actual
Permission of the new database is set to ```{ read: 'owner', write: 'owner' }```