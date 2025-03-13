/**
 * 
 */
package com.digital.umuganda.mbazaussd.utils;

import java.util.Map;

import lombok.*;

/**
 * @author Stanley
 *
 * @date 2020-Nov-01 11:11:37 PM 
 *
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class USSDMenuDisplay {

	private Map<Integer, String> contentMap;
	
	private String contentDisplay;
	
	private boolean finalMenu;

	private boolean askMenu;
	
	
}
