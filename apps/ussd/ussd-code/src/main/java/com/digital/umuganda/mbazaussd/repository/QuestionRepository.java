/**
 * 
 */
package com.digital.umuganda.mbazaussd.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.digital.umuganda.mbazaussd.domain.Question;
/**
 * @author Stanley
 *
 * @date 2020-Oct-31 11:34:21 AM 
 *
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

	/**
	 * @param itemSelected
	 * @param i
	 * @return
	 */
	Optional<Question> findByTitleIdEnAndPosition(int itemSelected, int i);

	/**
	 * @param itemSelected
	 * @param i
	 * @return
	 */
	Optional<Question> findByTitleIdFrAndPosition(int itemSelected, int i);

	/**
	 * @param itemSelected
	 * @param i
	 * @return
	 */
	Optional<Question> findByTitleIdRwAndPosition(int itemSelected, int i);
	
	Question findByQuestionEn(String name);
	
	Question findByQuestionFr(String name);
	
	Question findByQuestionRw(String name);
	
	
	Optional<Question> findByTitleIdEn(int itemSelected);

	Optional<Question> findByTitleIdFr(int itemSelected);

	Optional<Question> findByTitleIdRw(int itemSelected);

}
