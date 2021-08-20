const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { login, createUser } = require("./controllers/users");

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: "60fd6a478cefae0e605cdd0d",
  };

  next();
});

app.post("/signin", login);
app.post("/signup", createUser);
app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));

app.use("/", (req, res) => {
  res.status(404).send({ message: "Страница не найдена" });
});

app.listen(PORT);
