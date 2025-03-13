/**
 * 
 */
package com.digital.umuganda.mbazaussd.domain;


import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.validation.constraints.Size;
import lombok.*;
import com.digital.umuganda.mbazaussd.enumerations.ELanguage;

/**
 * @author Stanley
 *
 * @date 2020-Oct-31 11:32:32 AM 
 *
 */
@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Table(name = "ussdlogging", indexes = {@Index(name="FASTLOGGING",columnList = "ID,MSISDN,LANGUAGE,content,inputChoice,UniqSessionId")})
public class USSDLogging  {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String msisdn;
	
	@Enumerated(EnumType.STRING)
	private ELanguage language;
	
	private LocalDateTime dateTime;
	
	@Size(max = 2400)
	@Column
	private String content;
	
	private String inputChoice;
	
	private String uniqSessionId;
	
	private String status;
	
	private String ipAddress;
	
	private String httpMethod;
	
	private String httpResponse;
	
	private String typeOfContent;


	
}
