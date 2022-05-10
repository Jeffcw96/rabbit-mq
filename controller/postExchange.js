const rabbitMQ = require("../utils/RabbitMQ");
const uniqueId = require("../utils/uniqueId");
async function postExchange(req, res) {
  try {
    const {
      body,
      params: { exchange, exchangeType },
    } = req;

    /*
      Messages marked as 'persistent' that are delivered to 'durable' queues will be logged to disk. 
      Durable queues are recovered in the event of a crash, along with any persistent messages they stored prior to the crash.
    */
    const persistent = 2;
    const type = `${exchange}.created`;
    const headers = body.properties?.headers || {};
    const options = {
      appId: exchange,
      contentType: "application/json",
      deliveryMode: persistent,
      durable: true,
      headers,
      messageId: uniqueId(),
      priority: 5,
      timestamp: Date.now(),
      type,
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
    console.error("post exchange error", error);
    res.status(500).json(error);
  }
}

module.exports = postExchange;
