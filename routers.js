const express = require("express");
const postQueue = require("./controller/postQueue");
const postExchange = require("./controller/postExchange");

const router = express.Router();

router.post("/queue/:queue_name", postQueue);
router.post("/:exchange/exchange/:exchangeType", postExchange);

module.exports = router;
