# 3 Peas API v.1.0


## Installation
Before you do that, you’ll need a recent version of Node.js.
You'll also need mysql-server installed.
Clone the repository and execute the scripts from package.json:

```sh
$ git clone git@bitbucket.org:clockwisesoftware/grocer-backend.git
$ cd grocer-backend
$ npm install
```

## Configuration

Set settings for the BD connection and specify Amazon S3 credentials in the ./config/default.json
```json
{"db": {
    "driver": "mysql",
    "user": "USER_NAME",
    "password": "PASSWORD",
    "host": "localhost",
    "database": "DB_NAME"
    },
"s3config": {
    "accessKeyId": "",
    "secretAccessKey": ""
  }
}
```
By default the server listens port 3000. You can set up another port in
the configuration file.

## Start API
$ npm start

## Start API in Production mode
$ export NODE_ENV=prod
$ npm run build
$ pm2 start grocer.js


## Developers

* **Anatoliy Vesnin** - *Development* - [Clockwise Software](https://clockwise.software)
