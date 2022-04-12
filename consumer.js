const amqp = require("amqplib");
const MessageBroker = require("./MessageBroker");
// connectQueue();
connectExchange();

async function connectQueue() {
  try {
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
    const { exchange, exchangeType, routingKey } = processScriptArgs();
    const rabbitmq = new MessageBroker();
    await rabbitmq.connect();
    await rabbitmq.assertExchange(exchange, exchangeType, { durable: true });
    const queue = await rabbitmq.bindExchangeQueue(exchange, routingKey, {
      durable: true,
      expires: 2000,
    });
    rabbitmq.consumeMessage(queue);
  } catch (error) {
    console.error("Something wrong in RabbitMQ consumer exchange", error);
  }
}

function processScriptArgs() {
  const args = process.argv.slice(2, process.argv.length);
  return args.reduce((acc, val) => {
    const [key, value] = val.split("=");
    if (key && value) {
      return { ...acc, [key]: value };
    }

    return acc;
  }, {});
}
