package com.digital.umuganda.mbazaussd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.digital.umuganda.mbazaussd.domain.USSDTempLog;

@Repository
public interface USSDTempLogRepository extends JpaRepository<USSDTempLog, Long> {

	List<USSDTempLog> findAllByMsisdn(String msisdn);

	USSDTempLog findByMsisdn(String msisdn);

}
