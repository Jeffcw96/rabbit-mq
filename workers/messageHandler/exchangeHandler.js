const processLogInfo = require("../../utils/processLogInfo");
function exchangeHandler(rejectFlag = false) {
  return function (msg, channel) {
    try {
      if (rejectFlag) {
        console.log("rejected msg", JSON.parse(msg.content.toString()));
        channel.reject(msg, false);
      } else {
        const logInfo = processLogInfo(msg);
        console.table(logInfo);
        channel.ack(msg, false);
      }
    } catch (error) {
      console.error("exchange handler error", error);
    }
  };
}

module.exports = exchangeHandler;
