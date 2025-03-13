/**
 * 
 */
package com.digital.umuganda.mbazaussd.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.*;
/**
 * @author Stanley
 *
 * @date 2020-Oct-31 11:32:32 AM 
 *
 */
@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Table(name = "knowledge_base")
public class KnowledgeBase {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="content",length=1000)
	private String content;
	
	 @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "parent_id")
	private KnowledgeBase parent;
	 
	 @Column(name="is_menu",nullable = true)
	private boolean isMenu;
	
	@Column(name="ask_menu",nullable = true)
	private boolean askMenu;

	@Column(name = "position",nullable = true)
	private int position;	
}
