package com.digital.umuganda.mbazaussd.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(name = "CategoryRequestBody", description = "Category request body")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CategoryRequestBody {
    @Schema(description = "Category name", example = "Information")
    private String name;

    @Schema(description = "It will raise ticket on zammand once isTicket is true otherwise it is considered as information", example = "false")
    private boolean isTicket;

    @Schema(description = "Language id", example = "1")
    private Long languageId;

    @Schema(description = "Parent ID (Optional)", example = "1")
    private Long parentId;

    @Schema(description = "group", example = "NIDA")
    private String group;
}
