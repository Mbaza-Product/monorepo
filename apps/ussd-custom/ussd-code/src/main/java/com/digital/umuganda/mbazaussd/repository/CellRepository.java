package com.digital.umuganda.mbazaussd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.digital.umuganda.mbazaussd.entity.address.Cell;

public interface CellRepository extends JpaRepository<Cell, Long> {

    List<Cell> findBySector(String sector);

}
