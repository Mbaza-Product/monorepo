package com.digital.umuganda.mbazaussd.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.*;


@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Table(name = "GlobalUrls")
public class GlobalUrls extends AuditDomain  {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long propertyId;
	
	@Column(name="Url_name")
	private String urlName;

    
	@Column (name="Url_value")
	private String urlValue;

          }