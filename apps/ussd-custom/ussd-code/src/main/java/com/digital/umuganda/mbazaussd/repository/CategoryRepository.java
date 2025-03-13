package com.digital.umuganda.mbazaussd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.digital.umuganda.mbazaussd.entity.AlphaCode;
import com.digital.umuganda.mbazaussd.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByParentIdAndLanguageId(Long parentId, Long languageId);

    List<Category> findByLanguageCode(AlphaCode code);
}
