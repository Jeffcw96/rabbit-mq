const rabbitMQ = require("../utils/RabbitMQ");

async function postQueue(req, res) {
  try {
    const {
      body: payload,
      params: { queueName },
    } = req;

    await rabbitMQ.sendMessage(queueName, payload);

    res.send("Done");
  } catch (error) {
    console.error("post queue error", error);
    res.status(500).json(error);
  }
}

module.exports = postQueue;
