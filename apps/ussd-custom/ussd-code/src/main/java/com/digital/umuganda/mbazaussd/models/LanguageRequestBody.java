package com.digital.umuganda.mbazaussd.models;

import com.digital.umuganda.mbazaussd.entity.AlphaCode;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.v3.oas.annotations.media.Schema;

@JsonIgnoreProperties(ignoreUnknown = true)
public class LanguageRequestBody {
    @Schema(description = "Language name", example = "Kinyarwanda")
    private String name;

    @Schema(description = "Language code, supported codes are: EN | RW | FR", example = "RW")
    private AlphaCode code;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AlphaCode getCode() {
        return code;
    }

    public void setCode(AlphaCode code) {
        this.code = code;
    }

}
