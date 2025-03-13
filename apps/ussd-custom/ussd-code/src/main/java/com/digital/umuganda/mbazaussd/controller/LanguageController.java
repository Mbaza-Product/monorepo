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

import com.digital.umuganda.mbazaussd.entity.Language;
import com.digital.umuganda.mbazaussd.exception.NotFoundException;
import com.digital.umuganda.mbazaussd.models.LanguageRequestBody;
import com.digital.umuganda.mbazaussd.repository.LanguageRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/languages")
@PreAuthorize("hasAuthority('ADMIN')")
@Tag(name = "Languages", description = "Languages API")
@SecurityRequirement(name = "bearerAuth")
public class LanguageController {
    private final LanguageRepository languageRepository;

    public LanguageController(LanguageRepository languageRepository) {
        this.languageRepository = languageRepository;
    }

    @GetMapping
    @Operation(summary = "Get all languages", description = "Get all languages")
    public List<Language> getLanguages() {
        Sort sortByName = Sort.by("name");
        return languageRepository.findAll(sortByName);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get language by id", description = "Get language by id")
    public Language getLanguage(@PathVariable Long id) {
        return languageRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Language not found"));
    }

    @PostMapping
    @Operation(summary = "Create language", description = "Create language")
    public ResponseEntity<Language> createLanguage(@Valid @RequestBody LanguageRequestBody languageBody) {
        Language language = new Language();
        language.setName(languageBody.getName());
        language.setCode(languageBody.getCode());
        Language newLanguage = languageRepository.save(language);
        return ResponseEntity.status(HttpStatus.CREATED).body(newLanguage);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update language", description = "Update language")
    public Language updateLanguage(@Valid @RequestBody LanguageRequestBody languageBody, @PathVariable Long id) {
        Language language = languageRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Language not found"));
        language.setName(languageBody.getName());
        language.setCode(languageBody.getCode());
        return languageRepository.save(language);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete language", description = "Delete language")
    public ResponseEntity<Void> deleteLanguage(@PathVariable Long id) {
        Language language = languageRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Language not found"));
        languageRepository.delete(language);
        return ResponseEntity.noContent().build();
    }
}
