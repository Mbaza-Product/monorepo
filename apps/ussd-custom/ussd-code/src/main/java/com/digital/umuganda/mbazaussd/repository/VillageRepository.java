package com.digital.umuganda.mbazaussd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.digital.umuganda.mbazaussd.entity.address.Village;

public interface VillageRepository extends JpaRepository<Village, Long> {

    List<Village> findByCell(String cell);

}
