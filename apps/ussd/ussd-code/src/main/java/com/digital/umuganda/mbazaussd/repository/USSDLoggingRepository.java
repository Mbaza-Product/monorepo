/**
 * 
 */
package com.digital.umuganda.mbazaussd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.digital.umuganda.mbazaussd.domain.USSDLogging;
/**
 * @author Stanley
 *
 * @date 2020-Oct-31 11:34:21 AM 
 *
 */
@Repository
public interface USSDLoggingRepository extends JpaRepository<USSDLogging, Long> {

}
