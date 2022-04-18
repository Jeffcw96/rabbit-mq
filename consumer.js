const processScriptArgs = require("./processScriptArgs");
const MessageBroker = require("./MessageBroker");
const { process } = processScriptArgs();

switch (process) {
  case "exchange":
    connectExchange();
    break;
  case "queue":
    connectQueue();
    break;
}

async function connectQueue() {
  try {
    console.log("connectQueue function");
    const { queue } = processScriptArgs();
    const rabbitmq = new MessageBroker();
    await rabbitmq.connect();
    await rabbitmq.assertQueue(queue, { durable: true, expires: 2000 });
    rabbitmq.consumeMessage(queue);
  } catch (error) {
    console.error("Something wrong in RabbitMQ consumer queue", error);
  }
}

async function connectExchange() {
  try {
    console.log("connectExchange function");
    const {
      exchange,
      exchangeType,
      routingKey,
      headers = {},
    } = processScriptArgs();
    console.log("headers", headers);
    const rabbitmq = new MessageBroker();
    await rabbitmq.connect();
    await rabbitmq.assertExchange(exchange, exchangeType, {
      durable: true,
    });
    const queue = await rabbitmq.bindExchangeQueue(exchange, routingKey, {
      durable: true,
      expires: 2000,
      headers: { transport: "car", a: "asd", "x-match": "any" }, //change all to any to see effect
    });
    rabbitmq.consumeMessage(queue);
  } catch (error) {
    console.error("Something wrong in RabbitMQ consumer exchange", error);
  }
}
