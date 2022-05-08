const rabbitMQ = require("../utils/RabbitMQ");

async function postQueue(req, res) {
  try {
    const {
      body: payload,
      params: { queue_name },
    } = req;

    await rabbitMQ.sendMessage(queue_name, payload);

    res.send("Done");
  } catch (error) {
    console.error("errorrr 1 ", error);
    res.status(500).json(error);
  }
}

module.exports = postQueue;
