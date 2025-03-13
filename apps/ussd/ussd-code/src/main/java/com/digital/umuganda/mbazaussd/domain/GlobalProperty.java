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
@Table(name = "GlobalProperts")
public class GlobalProperty extends AuditDomain  {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long propertyId;
	
	@Column(name="Propert_name")
	private String propertyName;

	@Column (name="Property_value")
	private String propertyValue;

          }
