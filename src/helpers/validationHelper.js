class validationHelper {
  static validateUniqueId(taskPassed, taskData) {
    let taskFound = taskData.airtribe.some((task) => taskPassed.id == task.id);
    if (taskFound) {
      return false;
    }
    return true;
  }
}

module.exports = validationHelper;
