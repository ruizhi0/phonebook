const mongoose = require("mongoose");

const totalArgv = process.argv.length;

const isGetPeopleOperation = totalArgv === 3;
const isCreateNewPersonOperation = totalArgv === 5;

if (!isGetPeopleOperation && !isCreateNewPersonOperation) {
  console.log("usage: node mongo.js password [name] [number]");
  process.exit(1);
}

const password = process.argv[2];
const databaseName = "phonebook";

const connectionString = `mongodb+srv://admin:${password}@cluster0.vutdep2.mongodb.net/${databaseName}?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(connectionString);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (isCreateNewPersonOperation) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({ name, number });
  person.save().then((res) => {
    console.log(`added ${name} number ${number} to ${databaseName}`);
    mongoose.connection.close();
  });
}

if (isGetPeopleOperation) {
  console.log(`${databaseName}:`);
  Person.find({}).then((people) => {
    people.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
