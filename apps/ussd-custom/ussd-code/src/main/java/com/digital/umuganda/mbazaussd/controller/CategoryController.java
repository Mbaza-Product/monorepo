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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.digital.umuganda.mbazaussd.entity.Category;
import com.digital.umuganda.mbazaussd.entity.Language;
import com.digital.umuganda.mbazaussd.exception.NotFoundException;
import com.digital.umuganda.mbazaussd.models.CategoryRequestBody;
import com.digital.umuganda.mbazaussd.repository.CategoryRepository;
import com.digital.umuganda.mbazaussd.repository.LanguageRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/categories")
@PreAuthorize("hasAuthority('ADMIN')")
@Tag(name = "Knowledgebase", description = "Knowledgebase API")
@SecurityRequirement(name = "bearerAuth")
public class CategoryController {
    private final CategoryRepository categoryRepository;
    private final LanguageRepository languageRepository;

    public CategoryController(CategoryRepository categoryRepository, LanguageRepository languageRepository) {
        this.categoryRepository = categoryRepository;
        this.languageRepository = languageRepository;
    }

    @GetMapping
    @Operation(summary = "Get all categories", description = "Get all categories")
    public List<Category> getCategories(@RequestParam Long languageId) {
        return categoryRepository.findByParentIdAndLanguageId(null, languageId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by id", description = "Get category by id")
    public Category getCategory(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found"));
    }

    @PostMapping
    @Operation(summary = "Create category", description = "Create category")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody CategoryRequestBody categoryBody) {
        Language language = languageRepository.findById(categoryBody.getLanguageId())
                .orElseThrow(() -> new NotFoundException("Language not found"));
        Category category = new Category();
        Long parentId = categoryBody.getParentId();

        if (parentId != null) {
            Category parent = categoryRepository.findById(parentId)
                    .orElseThrow(() -> new NotFoundException("Parent Category not found"));
            category.setParent(parent);
            category.setIsTicket(parent.getIsTicket());
        } else {
            category.setIsTicket(categoryBody.isTicket());
        }
        category.setName(categoryBody.getName());
        category.setLanguage(language);
        category.setGroup(categoryBody.getGroup());

        Category newCategory = categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update category", description = "Update category")
    public Category updateCategory(@Valid @RequestBody CategoryRequestBody categoryBody, @PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found"));
        // Language language = languageRepository.findById(categoryBody.getLanguageId())
        // .orElseThrow(() -> new NotFoundException("Language not found"));

        Long parentId = categoryBody.getParentId();

        if (parentId != null) {
            Category parent = categoryRepository.findById(parentId)
                    .orElseThrow(() -> new NotFoundException("Parent Category not found"));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        category.setName(categoryBody.getName());
        category.setGroup(categoryBody.getGroup());
        return categoryRepository.save(category);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete category", description = "Delete category")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found"));
        categoryRepository.delete(category);
        return ResponseEntity.noContent().build();
    }
}
