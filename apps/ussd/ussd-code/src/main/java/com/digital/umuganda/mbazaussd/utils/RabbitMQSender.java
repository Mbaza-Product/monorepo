package com.digital.umuganda.mbazaussd.utils;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import com.digital.umuganda.mbazaussd.domain.USSDLogging;
import com.fasterxml.jackson.databind.ObjectMapper;

public class RabbitMQSender {


   

    public void sendUSSDLogging(USSDLogging ussdLogging,String EXCHANGE_NAME,String QUEUE_NAME ,String RABBITMQ_URL ) throws Exception {

        ConnectionFactory factory = new ConnectionFactory();
        factory.setUri(RABBITMQ_URL);
        Connection connection = factory.newConnection();

        Channel channel = connection.createChannel();

        channel.exchangeDeclare(EXCHANGE_NAME, "fanout", true);
        channel.queueDeclare(QUEUE_NAME, true, false, false, null);
        channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "");
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(ussdLogging);
        channel.basicPublish(EXCHANGE_NAME, "", null, json.getBytes("UTF-8"));
        channel.close();
        connection.close();
    }
}
