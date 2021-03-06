# Patient Lists Demo App
## 2020-Sep Connectathon
This app will be used by Patient Lists connectathon participants to test their servers against a simple app.  Non-server participants (who are client-focused) can use the provided server against their apps, too.

## Demo App
This app has been published as a static page here: <https://microsoft-healthcare-madison.github.io/patient-lists-demo/>

### Publishing Changes
New versions of the app can be published by running:
```shell
npm run deploy
```

## Local Test Data
To run this app locally - you can run a local hapi server populated with Synthea-generated data, all of which is provided in the root-level `data` directory.

The script that populates the local server runs in `python3` and has a few dependencies which are recorded in `requirements.txt`.  To install them:
```shell
pip3 install requirements.txt
```

To launch a local hapi server, populated with the example data, run the provided script in a terminal and leave it running:
```shell
$ ./data/bin/run-hapi.sh
Waiting for server to start...
  ... still starting
  ... still starting
HAPI IS UP
Loading example data...
LOADING BUNDLE...
...
LOADING BUNDLE...
DONE!
Press Ctrl-C to close the server process...

docker run -p $PORT:$PORT hapiproject/hapi:latest >&/dev/null
```

To interrupt the server, press `Ctrl-C` to stop it.

*Below is the default create-react-app documentation...*

# This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
