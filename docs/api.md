# Tasks API

## Version: 0.0.1

### /chat/start

#### POST

##### Description:

Start a chat

##### Responses

| Code | Description             |
| ---- | ----------------------- |
| 201  | Created chat            |
| 400  | Bad request             |
| 401  | Unauthorized            |
| 422  | The validation error(s) |

### /chat/send

#### POST

##### Description:

Send a message in a chat

##### Responses

| Code | Description             |
| ---- | ----------------------- |
| 201  | Success                 |
| 400  | Bad request             |
| 401  | Unauthorized            |
| 422  | The validation error(s) |

### /chat/history/{id}

#### GET

##### Description:

Get chat history by chat id

##### Parameters

| Name | Located in | Description | Required | Schema        |
| ---- | ---------- | ----------- | -------- | ------------- |
| id   | path       |             | Yes      | string (uuid) |

##### Responses

| Code | Description  |
| ---- | ------------ |
| 200  | Success      |
| 401  | Unauthorized |

### /chat/message/{id}/status

#### PATCH

##### Description:

Update message status

##### Parameters

| Name | Located in | Description | Required | Schema        |
| ---- | ---------- | ----------- | -------- | ------------- |
| id   | path       |             | Yes      | string (uuid) |

##### Responses

| Code | Description             |
| ---- | ----------------------- |
| 200  | Success                 |
| 400  | Bad request             |
| 401  | Unauthorized            |
| 422  | The validation error(s) |

### /chats/user/{id}

#### GET

##### Description:

Get chats by user id

##### Parameters

| Name | Located in | Description | Required | Schema        |
| ---- | ---------- | ----------- | -------- | ------------- |
| id   | path       |             | Yes      | string (uuid) |

##### Responses

| Code | Description  |
| ---- | ------------ |
| 200  | Success      |
| 400  | Bad request  |
| 401  | Unauthorized |

### /chat/metadata/{id}

#### GET

##### Description:

Get chat metadata by chat id

##### Parameters

| Name | Located in | Description | Required | Schema        |
| ---- | ---------- | ----------- | -------- | ------------- |
| id   | path       |             | Yes      | string (uuid) |

##### Responses

| Code | Description  |
| ---- | ------------ |
| 200  | Success      |
| 400  | Bad request  |
| 401  | Unauthorized |

### /users/{id}

#### GET

##### Parameters

| Name | Located in | Description | Required | Schema        |
| ---- | ---------- | ----------- | -------- | ------------- |
| id   | path       |             | Yes      | string (uuid) |

##### Responses

| Code | Description  |
| ---- | ------------ |
| 200  | User details |
| 404  | Not found    |

### /users/register

#### POST

##### Responses

| Code | Description          |
| ---- | -------------------- |
| 201  | User details         |
| 400  | Bad request          |
| 422  | Unprocessable entity |

### /users/login

#### POST

##### Responses

| Code | Description          |
| ---- | -------------------- |
| 200  | User details         |
| 400  | Bad request          |
| 422  | Unprocessable entity |

### /

#### GET

##### Responses

| Code | Description    |
| ---- | -------------- |
| 200  | Chat API Index |
