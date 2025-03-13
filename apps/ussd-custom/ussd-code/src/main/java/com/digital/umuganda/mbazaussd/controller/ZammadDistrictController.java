package com.digital.umuganda.mbazaussd.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.digital.umuganda.mbazaussd.entity.ZammadDistrict;
import com.digital.umuganda.mbazaussd.exception.ConflictException;
import com.digital.umuganda.mbazaussd.exception.NotFoundException;
import com.digital.umuganda.mbazaussd.models.request.ZammadDistrictRequest;
import com.digital.umuganda.mbazaussd.models.response.ZammadDistrictResponse;
import com.digital.umuganda.mbazaussd.repository.ProvinceRepository;
import com.digital.umuganda.mbazaussd.repository.ZammadDistrictRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/districts")
@PreAuthorize("hasAuthority('ADMIN')")
@Tag(name = "Districts", description = "Districts API")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class ZammadDistrictController {
    private final ZammadDistrictRepository zammadDistrictRepository;
    private final ProvinceRepository provinceRepository;

    @GetMapping
    @Operation(summary = "Get all districts", description = "Get all districts")
    public List<ZammadDistrictResponse> getDistricts() {
        return zammadDistrictRepository.findAll().stream().map(ZammadDistrictResponse::new)
                .collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get district by id", description = "Get district by id")
    public ZammadDistrict getDistrict(@PathVariable Long id) {
        return zammadDistrictRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("District not found"));
    }

    @PostMapping
    @Operation(summary = "Create district", description = "Create district")
    public ResponseEntity<ZammadDistrictResponse> createDistrict(
            @Valid @RequestBody ZammadDistrictRequest districtRequest) {
        ZammadDistrict exisDistrict = zammadDistrictRepository.findByName(districtRequest.getName());
        if (exisDistrict != null) {
            throw new ConflictException("District already exists");
        }
        ZammadDistrict district = districtRequest
                .toZammadDistrict(provinceRepository.findById(districtRequest.getProvinceId()).get());

        return new ResponseEntity<>(new ZammadDistrictResponse(zammadDistrictRepository.save(district)),
                HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update district", description = "Update district")
    public ResponseEntity<ZammadDistrictResponse> updateDistrict(@PathVariable Long id,
            @Valid @RequestBody ZammadDistrictRequest districtRequest) {

        ZammadDistrict district = zammadDistrictRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("District not found"));

        ZammadDistrict updatedDistrict = districtRequest.updateZammadDistrict(district,
                provinceRepository.findById(districtRequest.getProvinceId()).get());
        return ResponseEntity.ok(new ZammadDistrictResponse(zammadDistrictRepository.save(updatedDistrict)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete district by id", description = "Delete district by id")
    public ResponseEntity<Void> deleteDistrict(@PathVariable Long id) {
        ZammadDistrict district = zammadDistrictRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("District not found"));
        zammadDistrictRepository.delete(district);
        return ResponseEntity.noContent().build();
    }
}
