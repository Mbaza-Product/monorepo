package com.digital.umuganda.mbazaussd.domain;

import lombok.*;
import javax.persistence.*;



import com.digital.umuganda.mbazaussd.enumerations.ELanguage;

/**
 * The persistent class for the ussd_temp_log database table.
 * 
 */
@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Table(name = "ussd_temp_log", indexes = {@Index(name="FAST",columnList = "ID,MSISDN,LANGUAGE,secondLevel,answerLevel,UniqSessionId")})
public class USSDTempLog   {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = true)
	private String msisdn;

	private Integer level;

	private String title;
	
	private Integer secondLevel;

	@Enumerated(EnumType.STRING)
	private ELanguage language;

	private Integer numberOfCodeRegistered;



	private Integer userChoice;

	private String phoneNumber;

	
	private String telephone;
	
	private String uniqSessionId;


	@ManyToOne
	private KnowledgeBase parentMenu;
	
	@Column(nullable = true)
	private Long parentId;

	@ManyToOne
	private KnowledgeBase childMenu;

	@ManyToOne
	private Question question;
	
	private Integer answerLevel;
	


	
}
