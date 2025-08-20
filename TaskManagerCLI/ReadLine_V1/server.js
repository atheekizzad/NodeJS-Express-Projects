//section 1
const fs = require("fs");
const readLine = require("readline");
const chalk = require("chalk");
const path = require("path");
const TASK_FILE = path.join(__dirname, "TaskStore", "tasks.json");

//section 2- Load the Tasks

const loadTasks = () => {
  if (!fs.existsSync(TASK_FILE)) {
    console.log("File not found");
    return [];
  }

  try {
    const data = fs.readFileSync(TASK_FILE, "utf-8");
    const taskInsideData = JSON.parse(data);
    if (taskInsideData.length === 0) {
      console.log("No Tasks Have Been Added");
    } else {
      return taskInsideData;
    }
  } catch (err) {
    console.error("Error in Reading or Parsing taskfile :", err);
    return [];
  }
};

//section 3 - Save Tasks as file

const saveTask = (tasks) => {
  fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2), "utf-8");
};

//section 4 run

const run = () => {
  const tasks = loadTasks();
  const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  mainMenue(tasks, rl);
};

//section 5-main menu

const mainMenue = (tasks, rl) => {
  console.log(chalk.red("\n Task manager CLI"));
  console.log("1. List Tasks");
  console.log("2. Add Task");
  console.log("3. Mark Task as Done");
  console.log("4. Delete task");
  console.log("5. Edit Existing Task");
  console.log("6. Show Filtered List");
  console.log("7. Exit");

  rl.question("Choose an Option :  ", (input) => {
    switch (input.trim()) {
      case "1":
        listTask(tasks);
        mainMenue(tasks, rl);
        break;
      case "2":
        addTask(tasks, rl);
        break;
      case "3":
        markTaskdone(tasks, rl);
        break;
      case "4":
        deleteTask(tasks, rl);
        break;
      case "5":
        editTask(tasks, rl);
        break;
      case "6":
        filtered(tasks, rl);
        break;
      case "7":
        saveTask(tasks);
        console.log("Good bye! Your tasks are saved.");
        rl.close();
        break;
      default:
        console.log("invalid Option");
        mainMenue(tasks, rl);
    }
  });
};
//section 6- List of All Tasks

const listTask = (tasks) => {
  if (tasks.length === 0) return console.log("No tasks in the File");
  tasks.forEach((task, index) => {
    const status = task.done ? chalk.green("✅") : chalk.red("⏳");
    console.log(`${index + 1}.${chalk.yellow(task.name)}-${status}`);
  });
};

//section 7 - Add a task

const addTask = (tasks, rl) => {
  rl.question("Enter Task :  ", (input) => {
    tasks.push({ name: input, done: false });
    console.log(`Added task is ${input}`);
    saveTask(tasks);
    listTask(tasks);
    mainMenue(tasks, rl);
  });
};

//section 8 - Mark Task as completed

const markTaskdone = (tasks, rl) => {
  listTask(tasks);
  rl.question("Enter the task Number to be mark as done :  ", (input) => {
    const index = parseInt(input) - 1;
    if (tasks[index]) {
      tasks[index].done = true;
      console.log("task marked as done");
      saveTask(tasks);
      listTask(tasks);
    } else {
      console.log("Invalid Index");
    }
    mainMenue(tasks, rl);
  });
};

//section 9 - Delete Task

const deleteTask = (tasks, rl) => {
  listTask(tasks);

  rl.question("Enter the Task Number to Delete : ", (input) => {
    const index = parseInt(input) - 1;
    if (tasks[index]) {
      const removed = tasks.splice(index, 1);
      saveTask(tasks);
      console.log(`Deleted : ${removed[0].name}`);
    } else {
      console.log("Invalid Task Number");
    }
    mainMenue(tasks, rl);
  });
};

//section 10:Modification

const editTask = (tasks, rl) => {
  listTask(tasks);
  rl.question("Enter the Task Number to be Edited : ", (input) => {
    const index = parseInt(input) - 1;
    if (tasks[index]) {
      rl.question("Enter the task New Name :  ", (newName) => {
        tasks[index].name = newName;
        console.log("Task updated");
        saveTask(tasks);
        mainMenue(tasks, rl);
      });
    } else {
      console.log("invalid task number");
      mainMenue(tasks, rl);
    }
  });
};

//section 11- filter

const filtered = (tasks, rl) => {
  rl.question(
    "Enter 1 for Completed tasks and  2 for Pending tasks :  ",
    (choice) => {
      const filtered = tasks.filter((task) =>
        choice === "1" ? task.done : !task.done
      );
      listTask(filtered);
      mainMenue(tasks, rl);
    }
  );
};

run();
