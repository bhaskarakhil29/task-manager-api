// imports
const taskRoutes = require("express").Router();
const taskData = require("../tasks.json");
const bodyParser = require("body-parser");
const path = require("path");
const AJV = require("ajv");
const fs = require("fs");
const validateHelper = require("../helpers/validationHelper");

// uses
taskRoutes.use(bodyParser.urlencoded({ extended: false }));
taskRoutes.use(bodyParser.json());

const ajv = new AJV();

// create schema for validating incoming data
const taskSchema = {
  type: "object",
  properties: {
    id: { type: "integer", minimum: 1 },
    title: { type: "string", minLength: 1 },
    description: { type: "string", minLength: 1 },
    completed: { type: "boolean" },
  },
  required: ["title", "description", "completed"],
};
const validate = ajv.compile(taskSchema);

function writePathWrapper(writePath, writedata) {
  try {
    fs.writeFileSync(writePath, writedata, { encoding: "utf8", flag: "w" });
  } catch (err) {
    console.error(`Writing to file failed ` + err);
  }
}

// get all tasks
taskRoutes.get("/", (req, res) => {
  res.status(200).send(taskData);
});

// get a single task by its ID
taskRoutes.get("/:id", (req, res) => {
  const idPassed = req.params.id;
  const tasksList = taskData.airtribe;
  const taskRetrieved = tasksList.filter((task) => task.id == idPassed);
  if (taskRetrieved.length > 0) {
    res.status(200).send(taskRetrieved);
  } else {
    res.status(404).send(`Data Not Found`);
  }
});

// Create a new task
taskRoutes.post("/", (req, res) => {
  const taskPassed = req.body;
  const writePath = path.join(__dirname, "..", "tasks.json");
  const validateBody = validate(taskPassed);
  if (validateBody && validateHelper.validateUniqueId(taskPassed, taskData)) {
    const tasksModified = taskData;
    tasksModified.airtribe.push(taskPassed);
    writePathWrapper(writePath, JSON.stringify(tasksModified));
    res.status(201).send(`Task created Successfully`);
  } else {
    res.status(400).send(`Invalid data`);
  }
});

module.exports = taskRoutes;
