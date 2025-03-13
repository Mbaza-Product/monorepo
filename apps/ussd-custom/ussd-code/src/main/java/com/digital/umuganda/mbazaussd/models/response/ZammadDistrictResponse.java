package com.digital.umuganda.mbazaussd.models.response;

import com.digital.umuganda.mbazaussd.entity.ZammadDistrict;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ZammadDistrictResponse {
    @Schema(description = "District id", example = "1")
    Long id;
    @Schema(description = "District name", example = "Kicukiro")
    private String name;

    @Schema(description = "Province id", example = "1")
    private Long provinceId;

    @Schema(description = "Zammad url", example = "https://crm.dev.ln-cloud.mbaza.org")
    private String zammadUrl;

    @Schema(description = "Zammad login", example = "username")
    private String zammadLogin;

    @Schema(description = "Zammad password", example = "password")
    private String zammadPassword;

    public ZammadDistrictResponse(ZammadDistrict zammadDistrict) {
        this.id = zammadDistrict.getId();
        this.name = zammadDistrict.getName();
        this.provinceId = zammadDistrict.getProvince().getId();
        this.zammadUrl = zammadDistrict.getZammadUrl();
        this.zammadLogin = zammadDistrict.getZammadLogin();
        this.zammadPassword = zammadDistrict.getZammadPassword();
    }
}
