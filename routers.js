const express = require("express");
const MessageBroker = require("./MessageBroker");
const sendToQueue = require("./publisher");

const router = express.Router();

router.post("/publish/:queue_name", async (req, res) => {
  try {
    const {
      body: payload,
      params: { queue_name },
    } = req;

    const url = "amqp://localhost:5672";
    const rabbitmq = new MessageBroker(url);
    await rabbitmq.connect();
    await rabbitmq.sendMessage(queue_name, payload);
    res.send("Done");
    await rabbitmq.close();
  } catch (error) {
    console.error("errorrr", error);
    res.status(500).json(error);
  }
});

router.post("/exchange/:exchange_name", async (req, res) => {
  try {
    const {
      body: payload,
      params: { exchange_name },
    } = req;

    const exchangeType = "fanout";
    const url = "amqp://localhost:5672";
    const rabbitmq = new MessageBroker(url);
    await rabbitmq.connect();
    await rabbitmq.publishExchange(exchange_name, exchangeType, payload);
    res.send("Done publish exchange");
    await rabbitmq.close();
  } catch (error) {
    console.error("errorrr", error);
    res.status(500).json(error);
  }
});

router.post(
  "/direct_exchange/:exchange_name/:routing_key",
  async (req, res) => {
    try {
      const {
        body: payload,
        params: { exchange_name, routing_key = "" },
      } = req;

      const exchangeType = "direct";
      const url = "amqp://localhost:5672";
      const rabbitmq = new MessageBroker(url);
      await rabbitmq.connect();
      await rabbitmq.publishExchange(
        exchange_name,
        exchangeType,
        payload,
        routing_key
      );
      res.send("Done publish direct exchange");
      await rabbitmq.close();
    } catch (error) {
      console.error("errorrr", error);
      res.status(500).json(error);
    }
  }
);

module.exports = router;
