require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.static("build"));
app.use(cors());
app.use(express.json());

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/info", (req, res) => {
  Person.find({}).then((persons) => {
    const phonebookInfo = `Phonebook has info for ${persons.length} people`;
    const requestDateTime = new Date().toString();
    res.send(`<p>${phonebookInfo}<p><p>${requestDateTime}<p>`);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((person) => {
      if (person) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name) {
    res.status(400).json({ error: "name is required" });
    return;
  }
  if (!body.number) {
    res.status(400).json({ error: "number is required" });
    return;
  }
  Person.find({ name: body.name }).then((persons) => {
    if (persons.length !== 0) {
      res.status(400).json({ error: "name must be unique" });
      return;
    }

    const newPerson = new Person({
      name: body.name,
      number: body.number,
    });

    newPerson
      .save()
      .then((savedPerson) => {
        res.json(savedPerson);
      })
      .catch((error) => next(error));
  });
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  if (!body.name) {
    res.status(400).json({ error: "name is required" });
    return;
  }
  if (!body.number) {
    res.status(400).json({ error: "number is required" });
    return;
  }

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    res.status(400).send({ error: "malformed id" });
  } else {
    res.status(500).end();
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
