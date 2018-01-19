# Bug with Realm which causes `.objects` method to return numbers instead of a collection

## How to reproduce.

1. Clone this repo.
2. `npm install`
3. `npm start && npm run android`
4. Open the app.
5. Select "Debug JS Remotely" and wait a dozen of seconds to code to execute and react redbox with "realm.objects(...).filtered is not a function" error to emerge!
