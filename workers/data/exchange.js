const deadLetterHandler = require("../messageHandler/deadLetterHandler");
const exchangeHandler = require("../messageHandler/exchangeHandler");

const QUEUE_METADATA = [
  {
    queue: "email-queue",
    exchange: "mail_exchange",
    exchangeType: "direct",
    routingKey: "email-queue-key",
    handler: exchangeHandler(true),
    options: {
      deadLetterExchange: "dlx_exchange",
      deadLetterRoutingKey: "dlx_key",
      durable: true,
    },
  },
  {
    queue: "dead-letter-queue",
    exchange: "dlx_exchange",
    exchangeType: "direct",
    handler: deadLetterHandler(),
    options: {
      deadLetterExchange: "main_exchange",
      deadLetterRoutingKey: "email-queue-key",
      durable: true,
    },
  },
];

module.exports = QUEUE_METADATA;
