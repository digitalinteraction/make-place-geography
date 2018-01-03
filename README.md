# Make Place Geo Api

A geographical api for Make Place, responsible for the creation, storage and retrieval of geographical data. See `/docs` for usage.

## Features

- See the docs at `/docs` for detailed info about requests
- List geometries that you have access to with `GET: /geo`
- Get a specific geometry with `GET: /geo/:id`
- Create a geometry with `POST: /geo`
- Requests are validated with an `api_key` which have levels of permissions

## Structure

- Geometries are stored under a Deployment and reference a DataType
- A Deployment can have DataTypes records to define the type of data, but this is optional
- A Deployment has Api Keys, which are uses to access/create geometries, keys have different permissions

## Permissions

What you can do with the api is passed on what `api_key` you pass. All geo requests required a valid `api_key` to be passed in the query string. Apikeys are sql records associated to a deployment with a specific permission, defined below.

| Code    | Description |
| ------- | ----------- |
| `READ`  | You can **only** read from the deployment |
| `WRITE` | You can **only** create data for the deployment |
| `ALL`   | You can read **and** write on the deployment |

Api Keys must be created manually right now, ask your nearest administrator!

## API Sample Bodies

### 'POINT' creation

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

### 'LINESTRING' creation

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

| Variable   | Description |
| ---------- | ----------- |
| `SQL_URL`  | An sql url to specify the database connection |
| `SQL_USER` | The sql user, if not using `SQL_URL` |
| `SQL_PASS` | The sql user's password, if not using `SQL_URL` |
| `SQL_HOST` | The sql host, if not using `SQL_URL` |
| `SQL_NAME` | The sql database name, if not using `SQL_URL` |
| `API_PORT` | The port the api runs on, default: 3000 |
