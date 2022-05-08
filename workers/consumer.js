const processScriptArgs = require("../processScriptArgs");
const queueWorker = require("./QueueWorker");
const { process } = processScriptArgs();

(async () => {
  await queueWorker.connect();
  await deadLetterExchange();
  // switch (process) {
  //   case "exchange":
  //     connectExchange();
  //     break;
  //   case "queue":
  //     connectQueue();
  //     break;
  //   case "dl-exchange":
  //     deadLetterExchange();
  //     break;
  //   case "testing":
  //     testing();
  //     break;
  // }
})();

async function connectQueue() {
  try {
    console.log("connectQueue function");
    const { queue } = processScriptArgs();
    await queueWorker.assertQueue(queue, { durable: true, expires: 2000 });
    queueWorker.consumeMessage(queue);
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
    await queueWorker.assertExchange(exchange, exchangeType, {
      durable: true,
    });
    const queue = await queueWorker.bindExchangeQueue(exchange, routingKey, {
      durable: true,
      expires: 2000,
      headers,
    });
    queueWorker.consumeMessage(queue);
  } catch (error) {
    console.error("Something wrong in RabbitMQ consumer exchange", error);
  }
}

async function deadLetterExchange() {
  try {
    console.log("deadLetterExchange");
    // await Promise.all([
    //   queueWorker.assertExchange("main_exchange", "direct"),
    //   queueWorker.assertExchange("dlx_exchange", "direct"),
    // ]);

    await queueWorker.subscribeToQueues();
  } catch (error) {
    console.error("Something wrong in dead letter exchange consumer", error);
  }
}

async function testing() {
  try {
    console.log("testing function");
    const { queue } = processScriptArgs();
    await msgBroker.assertQueue(queue, { durable: true, expires: 2000 });
    msgBroker.consumeMessage(queue);

    console.log("");
  } catch (error) {
    console.error("testing error", error);
  }
}
