package com.digital.umuganda.mbazaussd.models.request;

import com.digital.umuganda.mbazaussd.entity.address.Province;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProvinceRequest {
    @Schema(description = "Province name", example = "Kigali")
    private String nameEn;

    @Schema(description = "Province name", example = "Kigali")
    private String nameFr;

    @Schema(description = "Province name", example = "Kigali")
    private String nameRw;

    public Province toProvince() {
        Province province = new Province();
        province.setNameEn(nameEn);
        province.setNameFr(nameFr);
        province.setNameRw(nameRw);
        return province;
    }

    public Province updateProvince(Province province) {
        province.setNameEn(nameEn);
        province.setNameFr(nameFr);
        province.setNameRw(nameRw);
        return province;
    }
}
