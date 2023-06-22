# Task Manager API

This project is a simple RESTful API for a task manager application. It provides endpoints to perform various operations on tasks, such as creating, retrieving, updating, and deleting tasks.

## Endpoints

- `GET /tasks`: Retrieve all tasks.
- `GET /tasks/:id`: Retrieve a single task by its ID.
- `GET /tasks/priority/:level`: Retrieve tasks based on priority level. (Optional)
- `POST /tasks`: Create a new task.
- `PUT /tasks/:id`: Update an existing task by its ID.
- `DELETE /tasks/:id`: Delete a task by its ID.

## Tasks

Tasks are stored in an in-memory data store (e.g., an array). Each task has the following properties:

## JSON Schema

```json
{
  "id": integer,
  "title": "string",
  "description": "string",
  "completed": boolean,
  "createdAt": "Date.now()"
}
```

## cURL commands

### 1. Retrieve all tasks

```
curl --location "localhost:3000/tasks"
```

### 2. Retrieve all completed tasks in sorted manner

```
curl --location "localhost:3000/tasks?completed=true&sort=1"
```

### 3. Retrieve a single task by its ID

```

curl --location "localhost:3000/tasks/:id"

```

### 4. Retrieve tasks based on priority level

```

curl --location "localhost:3000/tasks/priority/:level"

```

### 5. Create a new task

```

curl --location 'localhost:3000/tasks' \
--header 'Content-Type: application/json' \
--data '{
    "id": 10,
    "title": "Task 10",
    "description": "Task 10 Pending",
    "completed": false,
    "priority": "low"
}'

```

### 6. Delete a task by its ID

```

curl --location --request DELETE "localhost:3000/tasks/:id"

```

### 7. Update an existing task by its ID

```

curl --location --request PUT 'localhost:3000/tasks/:id' \
--header 'Content-Type: application/json' \
--data '{
"title": "Task 2",
"description": "Task 2 ",
"completed": true,
"priority": "high"
}'

```
