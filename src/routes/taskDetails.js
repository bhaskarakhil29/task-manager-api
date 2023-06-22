const taskRoutes = require("express").Router();
const taskData = require("../tasks.json");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

taskRoutes.use(bodyParser.urlencoded({ extended: false }));
taskRoutes.use(bodyParser.json());

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

module.exports = taskRoutes;
