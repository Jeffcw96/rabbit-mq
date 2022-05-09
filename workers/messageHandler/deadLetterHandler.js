const processLogInfo = require("../../utils/processLogInfo");
function deadLetterHandler() {
  return function (msg, channel) {
    const logInfo = processLogInfo(msg);
    console.table(logInfo);
    if (msg.properties.headers["x-death"][0].count > 4) {
      channel.ack(msg);
    } else {
      /**
        since we assert main_exchange and it's routing key as deadLetter,
        when dead letter reject msg it will g back to it's original route
      **/
      channel.reject(msg, false);
    }
  };
}

module.exports = deadLetterHandler;
