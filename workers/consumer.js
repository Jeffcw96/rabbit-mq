const queueWorker = require("./QueueWorker");

(async () => {
  await queueWorker.connect();
  consumerConnection();
})();

async function consumerConnection() {
  try {
    console.log("consumerConnection");
    await queueWorker.subscribeToQueues();
  } catch (error) {
    console.error("consumerConnection error", error);
  }
}
