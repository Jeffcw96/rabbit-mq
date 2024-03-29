## Prerequisite

Please ensure you've already installed [RabbitMQ](https://www.rabbitmq.com/download.html) in your machine.

```shell
docker run -it --rm --name rabbitmq -p 3031:5672 -p 15672:15672 rabbitmq:3.10-management
```

## How to Use

Install the necessary dependencies

```shell
npm install
```

To start the server (Publisher), port 3000

```shell
npm run dev
```

To start workers (consumer)

```shell
npm run consumer
```

To receive message with your custom `exchange`, `exchange type` and `queue` value, please add/edit new entity in `QUEUE_METADATA` variable under `exchange.js`:

```
project
│   README.md
│
└───workers
│   │
│   └───data
│       │   exchange.js

```

#### QUEUE_METADATA

| Key          | Description                                              |
| ------------ | -------------------------------------------------------- |
| queue        | Queue name                                               |
| exchange     | Exchange name                                            |
| exchangeType | direct \| fanout \| topic \| headers                     |
| routingKey   | Routing key                                              |
| handler      | Callback function when channel consume/ receive messages |
| options      | Assert queue options                                     |
| headers      | Argv/headers used in `.bindQueue()`                      |

## Endpoints:

| Description   | Url                                                          |
| ------------- | ------------------------------------------------------------ |
| Post Queue    | `http://localhost:3000/api/queue/:queue`                     |
| Post exchange | `http://localhost:3000/api/:exchangeType/exchange/:exchange` |

Please import the postman collection under `postmanCollection -> apis.json` directory to get the example of each exchange type

# Create automated cluster

### Create a docker network that used among all clusters

```shell
docker network create rabbits
```

### Create clusters

```shell
docker run -d --rm --net rabbits -v ${PWD}/config/rabbit-1/:/config/ -e RABBITMQ_CONFIG_FILE=/config/rabbitmq -e RABBITMQ_ERLANG_COOKIE=WIWVHCDTCIUAWANLMQAW --hostname rabbit-1 --name rabbit-1 -p 3031:5672 -p 8081:15672 rabbitmq:3.10-management

docker run -d --rm --net rabbits -v ${PWD}/config/rabbit-2/:/config/ -e RABBITMQ_CONFIG_FILE=/config/rabbitmq -e RABBITMQ_ERLANG_COOKIE=WIWVHCDTCIUAWANLMQAW --hostname rabbit-2 --name rabbit-2 -p 3032:5672 -p 8081:15672 rabbitmq:3.10-management

docker run -d --rm --net rabbits -v ${PWD}/config/rabbit-1/:/config/ -e RABBITMQ_CONFIG_FILE=/config/rabbitmq -e RABBITMQ_ERLANG_COOKIE=WIWVHCDTCIUAWANLMQAW --hostname rabbit-3 --name rabbit-3 -p 3033:5672 -p 8081:15672 rabbitmq:3.10-management

```

### Basic Queue Mirroring

```shell
# enable federation plugin
docker exec -it rabbit-1 rabbitmq-plugins enable rabbitmq_federation
docker exec -it rabbit-2 rabbitmq-plugins enable rabbitmq_federation
docker exec -it rabbit-3 rabbitmq-plugins enable rabbitmq_federation

docker exec -it rabbit-1 bash

# https://www.rabbitmq.com/ha.html#mirroring-arguments

rabbitmqctl set_policy ha-fed \
    ".*" '{"federation-upstream-set":"all", "ha-mode":"nodes", "ha-params":["rabbit@rabbit-1","rabbit@rabbit-2","rabbit@rabbit-3"]}' \
    --priority 1 \
    --apply-to queues
```
