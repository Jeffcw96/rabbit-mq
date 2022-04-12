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
    await rabbitmq.publishExchange({
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

module.exports = router;
