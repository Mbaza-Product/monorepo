/**
 * 
 */
package com.digital.umuganda.mbazaussd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.digital.umuganda.mbazaussd.domain.KnowledgeBase;
/**
 * @author Stanley
 *
 * @date 2020-Oct-31 11:34:21 AM 
 *
 */
@Repository
public interface KnowledgeBaseRepository extends JpaRepository<KnowledgeBase, Long> {

	List<KnowledgeBase> findAllByParentIsNullOrderByPositionAsc();

	/**
	 * @param parent
	 * @return
	 */
	List<KnowledgeBase> findAllByParentOrderByPositionAsc(KnowledgeBase parent);
	
	/**
	 * 
	 * @param id
	 * @return parent
	 */
	KnowledgeBase findById (long id);


}
