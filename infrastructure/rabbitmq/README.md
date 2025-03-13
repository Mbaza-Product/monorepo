# Mbaza Rabbitmq deployment

An docker deployment of the rabbitmq application to be used by the mbaza program

RabbitMQ is a message broker that enables different applications to communicate with each other by exchanging messages. It implements the Advanced Message Queuing Protocol (AMQP), which is an open standard for messaging middleware.

In RabbitMQ, messages are produced by a publisher and delivered to a message queue, which acts as a buffer for the messages until they are consumed by a consumer. Consumers can be applications that process the messages or other message queues that forward the messages to other consumers.

RabbitMQ provides several features such as message routing, message acknowledgments, message durability, and message expiration, that enable the reliable and scalable exchange of messages between applications. It also supports different messaging patterns, such as publish-subscribe, point-to-point, and request-response, to suit different messaging scenarios.

RabbitMQ is widely used in enterprise applications, cloud-based systems, and microservices architectures to decouple components, distribute workloads, and improve scalability and reliability.

# Usage
To deploy
```
$docker compose up -d
```