const express = require("express");
const app = express();
const routers = require("./routers");
const port = 3000;

app.use(express.urlencoded());
app.use(express.json());

app.use("/api", routers);

app.listen(port, () => {
  console.log(`App is running in ${port}`);
});
