package com.digital.umuganda.mbazaussd.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.data.domain.Sort;
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

import com.digital.umuganda.mbazaussd.entity.address.Province;
import com.digital.umuganda.mbazaussd.exception.NotFoundException;
import com.digital.umuganda.mbazaussd.models.request.ProvinceRequest;
import com.digital.umuganda.mbazaussd.repository.ProvinceRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/provinces")
@PreAuthorize("hasAuthority('ADMIN')")
@Tag(name = "Provinces", description = "Provinces API")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class ProvinceController {
    private final ProvinceRepository provinceRepository;

    @GetMapping
    @Operation(summary = "Get all provinces", description = "Get all provinces")
    public List<Province> getProvinces() {
        return provinceRepository.findAll(Sort.by("nameEn"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get province by id", description = "Get province by id")
    public Province getProvince(@PathVariable Long id) {
        return provinceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Province not found"));
    }

    @PostMapping
    @Operation(summary = "Create province", description = "Create province")
    public ResponseEntity<Province> createProvince(@Valid @RequestBody ProvinceRequest provinceRequest) {
        Province province = provinceRequest.toProvince();
        return new ResponseEntity<>(provinceRepository.save(province), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update province", description = "Update province")
    public ResponseEntity<Province> updateProvince(@PathVariable Long id,
            @Valid @RequestBody ProvinceRequest provinceRequest) {
        Province province = provinceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Province not found"));
        Province updateProvince = provinceRequest.updateProvince(province);
        return ResponseEntity.ok(provinceRepository.save(updateProvince));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete province by id", description = "Delete province by id")
    public ResponseEntity<Void> deleteProvince(@PathVariable Long id) {
        Province province = provinceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Province not found"));
        provinceRepository.delete(province);
        return ResponseEntity.noContent().build();
    }
}
