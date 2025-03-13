package com.digital.umuganda.mbazaussd.constants;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@ConfigurationProperties
@Data
public class Properties {
    private String zammadUrl;
    private String zammadUsername;
    private String zammadPassword;
    private String zammadCustomerPassword;
    private String zammadSecretKey;

    private String startLoc;
    private String EXCHANGE_NAME;
    private String QUEUE_NAME;
    private String RABBITMQ_URL;
}
