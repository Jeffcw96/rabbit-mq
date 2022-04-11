const amqp = require("amqplib");
const MessageBroker = require("./MessageBroker");
// connectQueue();
connectExchange();
// connectDirectExchange();
// connectDirectExchange2();

async function connectQueue() {
  try {
    const queueName = "jobs";
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.prefetch(1); //ensure the queue doesn't keep dispatch message to consumer until they've ack the job
    channel.consume(queueName, (data) => {
      const secs = data.content.toString().split(".").length - 1;

      setTimeout(() => {
        console.log("Received", JSON.parse(data.content.toString()));
        channel.nack(data, false, true);
      }, secs * 1000);
    });
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

async function connectDirectExchange() {
  try {
    const routingKey = "software_engineer";
    const exchange = "jobs_direct";
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, "direct", {
      durable: true,
    });

    const q = await channel.assertQueue("", {
      durable: true,
      expires: 2000,
    });

    await channel.bindQueue(q.queue, exchange, routingKey);

    channel.consume(q.queue, (data) => {
      console.log("data fields", data.fields);
      const secs = data.content.toString().split(".").length - 1;

      setTimeout(() => {
        console.log(
          `Received ${exchange} >> ${routingKey}`,
          JSON.parse(data.content.toString())
        );
        channel.ack(data, false, true);
      }, secs * 1000);
    });
  } catch (error) {
    console.error("Something wrong in consumer direct exchange");
  }
}

async function connectDirectExchange2() {
  try {
    const routingKey = "project_manager";
    const exchange = "jobs_direct";
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, "direct", {
      durable: true,
    });

    const q = await channel.assertQueue("", {
      durable: true,
      expires: 2000,
    });

    await channel.bindQueue(q.queue, exchange, routingKey);

    channel.consume(q.queue, (data) => {
      const secs = data.content.toString().split(".").length - 1;

      setTimeout(() => {
        console.log(
          `Received ${exchange} >> ${routingKey}`,
          JSON.parse(data.content.toString())
        );
        channel.ack(data);
      }, secs * 1000);
    });
  } catch (error) {
    console.error("Something wrong in consumer direct exchange");
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
