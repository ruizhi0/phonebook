const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to database.');
  })
  .catch((error) => {
    console.log('Unable to connect to database');
    console.log('error', error);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => /^\d{2,3}-\d+$/.test(v),
      message: (props) =>
        `${props.value} does not match format '{2 or 3 digits}-{1 or more digits}'`,
    },
    required: true,
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
