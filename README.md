# Make Place Geography

A restful JSON api for Make Place, responsible for the creation, storage and retrieval of geographical data. See `/docs` for usage.

## Features

* List geometries that you have access to with `GET: /geo`
* Get a specific geometry with `GET: /geo/:id`
* Create a geometry with `POST: /geo`
* All requests are validated with an `api_key`

## Data Structure

* Geometries are stored under a `Deployment` and reference a `DataType`
* A `Deployment` has `DataType` records to describe the type of data
* A `Deployment` has `ApiKey` records which have different permissions

## Permissions

What you can do with the api is based on what `api_key` you pass.
All geo requests require a valid `api_key` to be passed in the query string.
Api keys are sql records associated to a deployment with a specific permission, defined below.

> Keys must be created manually, add them to the `api_key` table.

| Code    | Description |
| ------- | ----------- |
| `READ`  | You can **only** read from the deployment |
| `WRITE` | You can **only** create data for the deployment |
| `ALL`   | You can read **and** write on the deployment |

## Sample Deployment

Below is an example of how to deploy this docker image using a docker-compose.

**docker-compose.yml**

```yml
version: '3'

services:
  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: geography
    ports:
      - 3306:3306
  geo:
    image: openlab.ncl.ac.uk:4567/make-place/geo:1.1.1
    links:
      - mysql
    environment:
      SQL_URL: mysql://root:secret@mysql/geography
    ports:
      - 3000:3000
```

With the above setup, run `docker-compose up -d` to start up your containers.
You then need to run the database migrations by executing `db_init.sql` inside your database.
To finish the setup add your `deployment`, `data_type` and `api_key` records.

## API Sample Bodies

Here are some sample request bodies, showing how you create each type of geometry.

e.g. `POST: http://localhost:3000/geo?api_key=YOUR_API_KEY`

**Creating a POINT**

```json
{
  "data_type": 1,
  "geom": {
    "type": "POINT",
    "x": 54.973877,
    "y": -1.613101
  }
}
```

**Creating a LINESTRING**

```json
{
  "data_type": 2,
  "geom": {
    "type": "LINESTRING",
    "points": [
      { "x": 54.973877, "y": -1.613101 },
      { "x": 54.973877, "y": -1.613101 }
    ]
  }
}
```

## Docker Environment Variables

These are the variables you set on your container and what they are for

Variable   | Description
---------- | -----------
`SQL_URL`  | An sql url to specify the database connection
`API_PORT` | The port the api runs on, default: 3000

> You can use `SQL_USER`, `SQL_PASS`, `SQL_HOST` & `SQL_NAME` if you cannot use `SQL_URL` for some reason (i.e. dokku)

## Dev Notes

All you need to develop locally is to have [docker](https://www.docker.com/) installed.

**Setup**

```bash
cd into/this/repo

# Start up docker containers
# It will watch for .js file changes and restart automatically
docker-compose up -d
```

> The first time, you'll need to manually run the database migrations.
> Connect with the details below and run the SQL statements in [db_init.sql](/db_init.sql)
>
> Credentials: `user:secret@127.0.0.1/geo-api`

## Deployment

This repo uses a [GitLab pipeline](https://about.gitlab.com/features/gitlab-ci-cd/) to build a docker image on git push.
It creates a image with the `latest` tag on each commit.
A versioned image can be built using the manual `build-version` CI job which uses the `package.json` version.
