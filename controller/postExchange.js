const rabbitMQ = require("../utils/RabbitMQ");
async function postExchange(req, res) {
  try {
    const {
      body,
      params: { exchange, exchangeType },
    } = req;

    const headers = body.properties?.headers || {};
    const options = {
      durable: true,
      headers,
    };

    const isValidExchangeType = rabbitMQ.isValidExchangeType(exchangeType);

    if (!isValidExchangeType) {
      throw new Error("Invalid exchange type");
    }

    await rabbitMQ.publishExchange({
      exchange,
      exchangeType,
      body,
      options,
    });
    res.send("Done");
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}

module.exports = postExchange;
