const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

const PORT = process.env.PORT;

const dbConnect = require("./dbConnection");
dbConnect();

app.use(express.json());
app.use(cors());

const loanRouter = require("./routes/loan.route");

const userRouter = require("./routes/user.route");

app.use("/loan", loanRouter);
app.use("/user", userRouter);

app.get("/hello", (req, res) => {
  res.send("Welcome to Mini-Loan App Server...");
});

app.listen(PORT, () => {
  console.log(`Server Started at http://localhost: ${PORT}`);
});
