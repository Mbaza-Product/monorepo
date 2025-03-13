package com.digital.umuganda.mbazaussd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.digital.umuganda.mbazaussd.entity.address.Sector;

public interface SectorRepository extends JpaRepository<Sector, Long> {

    List<Sector> findByDistrict(String district);

}
