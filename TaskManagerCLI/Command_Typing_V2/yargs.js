const yargs = require("yargs");

const arg = yargs.argv;

console.log(arg);
//node yargs.js --name=Izzad --age=22
//{ _: [],name: 'Izzad',age: 22,'$0': 'yargs.js'}
