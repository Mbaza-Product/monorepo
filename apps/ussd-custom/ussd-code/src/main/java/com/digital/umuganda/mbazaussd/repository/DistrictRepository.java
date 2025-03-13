package com.digital.umuganda.mbazaussd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.digital.umuganda.mbazaussd.entity.address.District;

public interface DistrictRepository extends JpaRepository<District, Long> {
    List<District> findByProvinceId(Long provinceId);
}
