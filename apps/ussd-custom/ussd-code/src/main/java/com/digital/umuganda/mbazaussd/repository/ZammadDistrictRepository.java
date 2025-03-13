package com.digital.umuganda.mbazaussd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.digital.umuganda.mbazaussd.entity.ZammadDistrict;

public interface ZammadDistrictRepository extends JpaRepository<ZammadDistrict, Long> {
    ZammadDistrict findByName(String name);
    List<ZammadDistrict> findByProvinceId(Long provinceId);
}
