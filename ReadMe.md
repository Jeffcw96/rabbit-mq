## Current findings for exchange:

- If we want to use `fanout` exchange, we need to put `queue_name` (first parameter of `assertQueue` method) as empty string so that it will create random queue_name
- This is because when you have 2 consumer with same queue_name and `fanout` exchange. only 1 of the consumer will receive the message
- **Current findings**
  - Most cases, we will put queue_name as empty string when we wanted to use exchange

## How to test Direct exchange

- Direct exchange allow us to have more deeper layer.
  - when multiple queue is connected to the same exchange but we only wanted to publish the message with certain condition/ value
  - we could utilize the `routing_key` field to let RabbitMQ know which queue it should go to.
- Currently the exchange and routing_key from consumer are hardcoded. So we need they only recognize specific endpoint (to get these info from route param)
- endpoint: http://localhost:3000/api/direct_exchange/jobs_direct/software_engineer
  - routing_key param , `software_engineer` can be changed to `project_manager` to trigger another function which has the same exchange but diff routing key
- npm run dev
- npm run consumer
  - npm run consumer:2
  - Or clone multiple `connectDirectExchange` function with same exchange but different `routing_key`

## How to pass variable in package.json script:

- npm run consumer exchange=jobExchange exchangeType=direct routingKey=software_engineer
- npm run consumer queue=job
