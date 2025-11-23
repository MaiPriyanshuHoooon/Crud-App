const express = require("express");
const app = express()
const cors = require("cors");
const morgan = require("morgan");
const path = require('path');

app.use(cors("*"));
app.use(morgan('dev'));
app.use(express.json({}));
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", require("./routes"));

app.use(express.static(path.join(__dirname, '../dist')));

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});


module.exports = app;
