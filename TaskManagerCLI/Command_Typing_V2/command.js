//section 1

const fs = require("fs");
const yargs = require("yargs");
const taskfile = "Objects.json";
const chalk = require("chalk");

//section 2 - Read task from file

const readFile = () => {
  if (!fs.existsSync(taskfile)) {
    console.log("No file Found");
    return [];
  }
  const data = fs.readFileSync(taskfile, "utf-8");
  return JSON.parse(data);
};

//section 3 - save Tasks

const saveFile = (tasks) => {
  const dataJSON = JSON.stringify(tasks, null, 2);
  fs.writeFileSync(taskfile, dataJSON, "utf-8");
};

//section 4 - List Tasks

yargs.command({
  command: "list",
  describe: "List of all tasks",
  handler() {
    const tasks = readFile();
    if (tasks.length === 0) {
      console.log("No tasks Found");
      return;
    } else {
      console.log("\nTask List");
      tasks.forEach((task) => {
        const status = task.completed ? "✅" : "⏳";
        console.log(chalk.yellow(`${task.id}.${task.description}-${status}`));
      });
    }
  },
});

//section 5- add a task

yargs.command({
  command: "add",
  describe: "add a new task to the file",
  builder: {
    description: {
      describe: "adding Task Description",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    // argv //{node command add --description="Touring"}
    //argv.description="Touring"
    const tasks = readFile();
    const newTask = {
      id: tasks.length + 1,
      description: argv.description,
      completed: false,
    };
    tasks.push(newTask);
    saveFile(tasks);
    console.log(`task added : ${argv.description}`);
  },
});

//section 6 : Completed taks

yargs.command({
  command: "completed",
  describe: "mark a task as completed",
  builder: {
    id: {
      describe: "task id to be marked",
      demandOption: true,
      type: "number",
    },
  },
  handler(argv) {
    const tasks = readFile();
    const taskToMarkAsCompleted = tasks.find((task) => task.id === argv.id);
    if (!taskToMarkAsCompleted) {
      console.log("task not found");

      return;
    } else {
      taskToMarkAsCompleted.completed = true;
      saveFile(tasks);
      console.log(` task ${argv.id} marked as completed`);
    }
  },
});

//section 7 - Remove tasks

yargs.command({
  command: "remove",
  describe: "select a task to be removed",
  builder: {
    id: {
      describe: "Task id to be remove",
      demandOption: true,
      type: "number",
    },
  },
  handler(argv) {
    const tasks = readFile();
    const updatedtasks = tasks.filter((task) => task.id !== argv.id);
    if (tasks.length === updatedtasks.length) {
      console.log("Invalid Choice to Delete a Task");
      return;
    } else {
      saveFile(updatedtasks);
      console.log(`removed task is ${argv.id}`);
    }
  },
});

//section 9 - edit task
yargs.command({
  command: "edit",
  describe: "edit existing task",
  builder: {
    id: {
      describe: "id of the exsisting task has to be edit",
      demandOption: true,
      type: "number",
    },
    description: {
      describe: "new task that is replacing old one",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    const tasks = readFile();
    const tasktoEdit = tasks.find((task) => task.id == argv.id);
    if (!tasktoEdit) {
      console.log(chalk.red("task not found"));
      return;
    } else {
      tasktoEdit.description = argv.description;
      saveFile(tasks);
      console.log(chalk.red(`ID ${argv.id} updated to ${argv.description}`));
    }
  },
});

//section 10 - filter task
yargs.command({
  command: "filter",
  describe: "filter task by Pending",
  builder: {
    status: {
      describe: "fileter by status Complete or Pending",
      demandOption: true,
      type: "string",
      choices: ["completed", "pending"], // // restricts valid inputs
    },
  },
  handler(argv) {
    const tasks = readFile();
    const isCompleted = argv.status === "completed";
    const filtered = tasks.filter((task) => task.completed === isCompleted);
    if (!filtered.length) {
      console.log("no matching tasks");
      return;
    } else {
      filtered.forEach((t) => {
        console.log(`${t.id}.${t.description}`);
      });
    }
  },
});
//section 8
yargs.parse();
