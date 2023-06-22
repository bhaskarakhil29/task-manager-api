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
  const { completed, sort } = req.query;
  let isCompleted =
    completed === undefined || completed.toLowerCase() === "false"
      ? false
      : true;
  let taskDataFiltered = taskData;
  taskDataFiltered = taskDataFiltered.airtribe.filter(
    (task) => task.completed == isCompleted
  );
  if (sort !== undefined) {
    taskDataFiltered.sort(
      (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
    );
  }
  res.status(200).send(taskDataFiltered);
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
    taskPassed.createdOn = Date.now();
    tasksModified.airtribe.push(taskPassed);
    writePathWrapper(writePath, JSON.stringify(tasksModified));
    res.status(201).send(`Task Created Successfully`);
  } else {
    res.status(400).send(`Invalid data`);
  }
});

//Update an existing task by its ID
taskRoutes.put("/:id", (req, res) => {
  const taskIdPassed = req.params.id;
  const taskPassed = req.body;
  const writePath = path.join(__dirname, "..", "tasks.json");
  const taskDataModified = taskData;
  const taskIndex = taskDataModified.airtribe.findIndex(
    (task) => task.id == taskIdPassed
  );
  if (taskIndex !== -1 && validate(taskPassed)) {
    taskPassed.createdOn = taskDataModified.airtribe[taskIndex].createdOn;
    taskDataModified.airtribe[taskIndex] = taskPassed;
    writePathWrapper(writePath, JSON.stringify(taskDataModified));
    res.status(202).json({ message: `Task Updated Successfully` });
  } else {
    res.status(400).send(`Invalid data`);
  }
});

// Delete a task by its ID
taskRoutes.delete("/:id", (req, res) => {
  const taskIdPassed = req.params.id;
  const writePath = path.join(__dirname, "..", "tasks.json");
  const taskDataModified = taskData;
  const taskIndex = taskDataModified.airtribe.findIndex(
    (task) => task.id == taskIdPassed
  );
  if (taskIndex !== -1) {
    taskDataModified.airtribe.splice(taskIndex, 1);
    writePathWrapper(writePath, JSON.stringify(taskDataModified));
    res.status(202).json({ message: `Task Deleted Successfully` });
  } else {
    res.status(400).send(`Given Id is not found`);
  }
});

module.exports = taskRoutes;
