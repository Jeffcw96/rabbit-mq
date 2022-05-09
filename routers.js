const express = require("express");
const postQueue = require("./controller/postQueue");
const postExchange = require("./controller/postExchange");

const router = express.Router();

router.post("/queue/:queueName", postQueue);
router.post("/:exchangeType/exchange/:exchange", postExchange);

module.exports = router;
