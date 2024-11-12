# Notesite
App url: https://notesite-five.vercel.app/
## Running client locally.

Clone repository.
```console
$ git clone https://github.com/danpaxton/notesite.git
$ cd notesite
```

Install client dependencies and run.
```console
$ cd client
$ npm install
$ npm run start
```
The client should now be running on localhost port 3000.

## Usage

### Notes
The compose note button at the bottom right of the page can be used to create a new note. On click, the note editor will be displayed and any input will be autosaved. To return to the note list click the back arrow at the top left of the screen. If the note has no data it will automatically be deleted when the back arrow is clicked. To access a previously made note simply click on the note. Once a note is opened the icon at the top right of the page will expand options to bookmark or delete the note.

## Frontend
The frontend was built using React.js and makes requests to the backend using Axios. The app is styled with Tailwind CSS using fixed positioning and flex layouts. After login, a token is stored in local storage to authenticate updates and prevent logout on refresh.

## Backend
The backend was built using an express api and connects to a MongoDB database. User authentication was implemented using the jsonwebtoken library. The api supports user login, refresh authenticaiton, and CRUD operations.
