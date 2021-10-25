# ChatterBox
ChatterBox is a secure chatting application using [Socket.io](https://socket.io/). The app is secured using [Node.JS](https://nodejs.org/), [Express](https://expressjs.com/), with [MongoDB](https://www.mongodb.com/) as database support.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.10.
For displaying coordinates on a map widget, in chat, [OpenLayers](https://openlayers.org/) is used.

##### This application is deployed [here](https://chatterbox-o.herokuapp.com).

App can be accessed by signing up using **Email**, **Password** and **Name**. Or using these credentials: `Email: 'random@example.com'` and `Password: 'password'`.

## Production

### Build

Run `npm run build` to build the project. The build artifacts will be generated in production configuration and stored in the `dist/` directory.

### Server

Run `npm run start` for a node server. Navigate to application. Defaults to `http://localhost:8080`.


## Development

## Build

Run `npm run watch` to build the project and watch for changes in the source files. The build artifacts will be generated in development configuration and stored in the `dist/` directory.

### Server

Run `npm run start:dev` for a node server, in dev mode using `Nodemon`. Navigate to application. Defaults to `http://localhost:8080`.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io) and generate code coverage.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.
