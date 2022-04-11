const express = require("express");
const MessageBroker = require("./MessageBroker");

const router = express.Router();

router.post("/publish/:queue_name", async (req, res) => {
  try {
    const {
      body: payload,
      params: { queue_name },
    } = req;
    console.log("normal queue operation");

    const rabbitmq = new MessageBroker();
    await rabbitmq.connect();
    await rabbitmq.sendMessage(queue_name, payload);
    res.send("Done");
    await rabbitmq.close();
  } catch (error) {
    console.error("errorrr 1 ", error);
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

router.post("/:exchange/exchange/:exchangeType", async (req, res) => {
  try {
    const {
      body,
      params: { exchange, exchangeType },
    } = req;
    const options = { durable: true };
    const rabbitmq = new MessageBroker();
    const isValidExchangeType = rabbitmq.isValidExchangeType(exchangeType);

    if (!isValidExchangeType) {
      throw new Error("Invalid exchange type");
    }

    await rabbitmq.connect();
    await rabbitmq.publishExchangeVersionTwo({
      exchange,
      exchangeType,
      body,
      options,
    });
    res.send("Done");
    await rabbitmq.close();
  } catch (error) {
    console.error(error);
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
