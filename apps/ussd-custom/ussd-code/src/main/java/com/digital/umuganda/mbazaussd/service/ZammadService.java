package com.digital.umuganda.mbazaussd.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import com.digital.umuganda.mbazaussd.constants.Properties;
import com.digital.umuganda.mbazaussd.entity.Ticket;
import com.digital.umuganda.mbazaussd.entity.ZammadUser;
import com.digital.umuganda.mbazaussd.helpers.Zammad;
import com.digital.umuganda.mbazaussd.models.ZammadUserRequestBody;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class ZammadService {
    private final Properties properties;
    private final RestTemplate restTemplate;

    @Transactional
    public ZammadUser createUser(ZammadUser zammadUser, String address) {
        try {
            ZammadUserRequestBody body = new ZammadUserRequestBody(zammadUser);
            body.setPassword(properties.getZammadCustomerPassword());
            body.setAddress(address);

            String url = properties.getZammadUrl();
            String username = properties.getZammadUsername();
            String password = properties.getZammadPassword();
            // if (zammadUser.getDistrict() != null) {
            // url = zammadUser.getDistrict().getZammadUrl();
            // username = zammadUser.getDistrict().getZammadLogin();
            // password = zammadUser.getDistrict().getZammadPassword();
            // }
            String ZAMMAD_API_ENDPOINT = url + "/api/v1/users";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBasicAuth(username, password);

            HttpEntity<ZammadUserRequestBody> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<JsonNode> response = restTemplate.postForEntity(ZAMMAD_API_ENDPOINT,
                    requestEntity,
                    JsonNode.class);

            JsonNode zammadUserResponse = response.getBody();

            if (zammadUserResponse != null) {
                log.info("User created successfully");
                // Save the user in the database
                zammadUser.setPassword(Zammad.encrypt(body.getPassword(), properties.getZammadSecretKey()));
                zammadUser.setCustomer_id(zammadUserResponse.get("id").asLong());
            } else {
                log.error("User creation failed");
                log.error("Response status: " + response.getStatusCode()
                        + " " + response.getStatusCode().getReasonPhrase());
                return null;
            }
            return zammadUser;
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            return null;
        }
    }

    public Ticket sendTicket(ZammadUser zammadUser, Ticket ticket) {

        try {
            String url = properties.getZammadUrl();
            // if (zammadUser.getDistrict() != null) {
            // url = zammadUser.getDistrict().getZammadUrl();
            // }
            String ZAMMAD_API_TICKET_ENDPOINT = url + "/api/v1/tickets";
            String username = zammadUser.getLogin();
            String password = Zammad.decrypt(zammadUser.getPassword(), properties.getZammadSecretKey());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBasicAuth(username, password);

            RestTemplate restTemplate = new RestTemplate();
            JSONObject sub_attachement = new JSONObject();
            JSONArray attachement = new JSONArray();
            attachement.put(sub_attachement);
            JSONObject inputbody = new JSONObject();

            sub_attachement.put("filename", "portal.txt");
            sub_attachement.put("mime-type", "text/plain");

            inputbody.put("subject", "New ticket from " + username);
            inputbody.put("body", "Ticket: " + ticket.getComplaint() + "\nAddress: " + ticket.getAddress());
            inputbody.put("type", "note");
            inputbody.put("internal", false);
            inputbody.put("attachements", attachement);
            JSONObject request = new JSONObject();
            request.put("title", username);
            request.put("article", inputbody);

            request.put("customer", zammadUser.getLogin());

            if (ticket.getCategory() != null && !ticket.getCategory().isEmpty()) {
                request.put("group", ticket.getCategory());
            } else {
                request.put("group_id", "2");
            }

            HttpEntity<String> requester = new HttpEntity<>(request.toString(), headers);

            ResponseEntity<JsonNode> response = restTemplate.postForEntity(ZAMMAD_API_TICKET_ENDPOINT,
                    requester, JsonNode.class);

            JsonNode zammadTicketResponse = response.getBody();

            if (zammadTicketResponse != null) {
                log.info("Ticket sent successfully");
                ticket.setZammad_ticket_id(zammadTicketResponse.get("id").asLong());
                ticket.setCustomer_id(zammadTicketResponse.get("customer_id").asLong());
                ticket.setState_id(zammadTicketResponse.get("state_id").asInt());
            } else {
                log.error("Ticket sending failed");

                log.error("Response status: " + response.getStatusCode()
                        + " " + response.getStatusCode().getReasonPhrase());
                return null;
            }

            return ticket;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Ticket viewTicket(Ticket ticket) {
        try {
            String url = properties.getZammadUrl();
            String ZAMMAD_API_TICKET_ENDPOINT = url + "/api/v1/tickets/" + ticket.getZammad_ticket_id();
            String username = properties.getZammadUsername();
            String password = properties.getZammadPassword();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBasicAuth(username, password);

            RestTemplate restTemplate = new RestTemplate();
            HttpEntity<String> requestEntity = new HttpEntity<>(null, headers); // Pass the headers with the request

            ResponseEntity<JsonNode> response = restTemplate.exchange(ZAMMAD_API_TICKET_ENDPOINT,
                    HttpMethod.GET,
                    requestEntity,
                    JsonNode.class);

            JsonNode zammadTicketResponse = response.getBody();

            if (zammadTicketResponse != null) {
                log.info("Ticket retrieved successfully");
                ticket.setState_id(zammadTicketResponse.get("state_id").asInt());
                return ticket;
            } else {
                log.error("Ticket retrieval failed");

                log.error("Response status: " + response.getStatusCode()
                        + " " + response.getStatusCode().getReasonPhrase());
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
