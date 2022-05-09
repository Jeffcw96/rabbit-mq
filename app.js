const express = require("express");
const routers = require("./routers");
const rabbitMQ = require("./utils/RabbitMQ");
const app = express();
const port = 3000;

rabbitMQ.connect();
app.use(express.urlencoded());
app.use(express.json());

app.use("/api", routers);

app.listen(port, () => {
  console.log(`App is running in ${port}`);
});
