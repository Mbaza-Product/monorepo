/**
 * 
 */
package com.digital.umuganda.mbazaussd.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.*;
/**
 * @author Stanley
 *
 * @date 2020-Nov-04 3:59:00 PM
 *
 */
@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Table(name = "questions")
public class Question  {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "question_rw")
	private String questionRw;

	@Column(name = "question_en")
	private String questionEn;

	@Column(name = "question_fr")
	private String questionFr;

	private int titleIdEn;

	private int titleIdFr;

	private int titleIdRw;

	@Column(name = "answer_type")
	private String answerType;

	@Column(name = "end_question")
	private int endQuestion;

	@Column(name = "position")
	private int position;

}
