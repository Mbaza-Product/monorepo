package com.digital.umuganda.mbazaussd.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.v3.oas.annotations.media.Schema;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UssdRequest {
    @Schema(description = "User msisdn", example = "0788000000")
    private String msisdn;

    @Schema(description = "User input", example = "114")
    private String input;

    @Schema(description = "New request", example = "1")
    private String newRequest;

    public String getMsisdn() {
        return msisdn;
    }

    public void setMsisdn(String msisdn) {
        this.msisdn = msisdn;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getNewRequest() {
        return newRequest;
    }

    public void setNewRequest(String newRequest) {
        this.newRequest = newRequest;
    }

}
