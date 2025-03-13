package com.digital.umuganda.mbazaussd.models;

import com.digital.umuganda.mbazaussd.entity.ZammadUser;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ZammadUserRequestBody {
    private String login;
    private String password;
    private String[] roles;
    private String address;
    private String phone;
    private String mobile;
    private String firstname;
    private String lastname;

    public ZammadUserRequestBody() {
    }

    public ZammadUserRequestBody(String email, String login, String password, String address) {
        this.login = login;
        this.password = password;
        this.roles = new String[] { "Customer" };
        this.address = address;
    }

    public ZammadUserRequestBody(ZammadUser user) {
        this.login = user.getLogin();
        this.password = user.getPassword();
        this.roles = new String[] { "Customer" };
        this.phone = user.getLogin();
        this.mobile = user.getLogin();
        this.firstname = "User to be identified by phonenumber";
        this.lastname = user.getLogin();
    }

}
