package com.digital.umuganda.mbazaussd.models.request;

import com.digital.umuganda.mbazaussd.entity.ZammadDistrict;
import com.digital.umuganda.mbazaussd.entity.address.Province;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ZammadDistrictRequest {
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

    public ZammadDistrict toZammadDistrict(Province province) {
        ZammadDistrict zammadDistrict = new ZammadDistrict();
        zammadDistrict.setName(name);
        zammadDistrict.setProvince(province);
        zammadDistrict.setZammadUrl(zammadUrl);
        zammadDistrict.setZammadLogin(zammadLogin);
        zammadDistrict.setZammadPassword(zammadPassword);
        return zammadDistrict;
    }

    public ZammadDistrict updateZammadDistrict(ZammadDistrict zammadDistrict, Province province) {
        zammadDistrict.setName(name);
        zammadDistrict.setProvince(province);
        zammadDistrict.setZammadUrl(zammadUrl);
        zammadDistrict.setZammadLogin(zammadLogin);
        zammadDistrict.setZammadPassword(zammadPassword);
        return zammadDistrict;
    }
}
