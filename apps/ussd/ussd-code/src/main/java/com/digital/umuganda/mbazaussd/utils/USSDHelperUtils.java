package com.digital.umuganda.mbazaussd.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.digital.umuganda.mbazaussd.domain.KnowledgeBase;
import com.digital.umuganda.mbazaussd.repository.KnowledgeBaseRepository;

@Component
public class USSDHelperUtils {

	

	private final Logger logger = LoggerFactory.getLogger(USSDHelperUtils.class);

	@Autowired
	private KnowledgeBaseRepository knowledgeRepository;

	

	public Map<Integer, String> getLanguages() {

		Map<Integer, String> map = new HashMap<>();

		int count = 0;

		for (KnowledgeBase language : knowledgeRepository.findAllByParentIsNullOrderByPositionAsc()) {
			count++;
			map.put(count, " " + language.getContent().trim());

		}
		return map;
	}



	public KnowledgeBase getLanguageSelected(int selectedChoice) {

		KnowledgeBase item = new KnowledgeBase();

		List<KnowledgeBase> itemList ;
		
			itemList = knowledgeRepository.findAllByParentIsNullOrderByPositionAsc();
		
		int count = 0;
		if (!itemList.isEmpty()) {
			for (KnowledgeBase knowledgeBase : itemList) {
				
				count++;
				if (count == selectedChoice) {
					item = knowledgeBase;
				}

			}
		}

		return item;
	}

	public USSDMenuDisplay getContentByParent(KnowledgeBase parent) {

		USSDMenuDisplay menu = new USSDMenuDisplay();

		Map<Integer, String> map = new HashMap<>();

		List<KnowledgeBase> itemList = new ArrayList<>();
	
			itemList = findAllByParent(parent, itemList);
		int count = 0;

		getContent(menu, map, itemList, count);

		return menu;		
	}

	public Integer getContent(USSDMenuDisplay menu, Map<Integer, String> map, List<KnowledgeBase> itemList, int count) {
		

		if (!itemList.isEmpty()) {
			
			if (itemList.size() == 1) {
				isItemMenu(menu, map, itemList, count);

			} else {
				for (KnowledgeBase itemEntity : itemList) {
					count++;
					map.put(count, " " + itemEntity.getContent());

				}
				menu.setContentMap(map);
				menu.setFinalMenu(false);
			}

		} else {

			map.put(0, ResponseUtils.NO_DATA_FOUND_KINY);
			
			menu.setContentDisplay(ResponseUtils.NO_DATA_FOUND_KINY);
			menu.setFinalMenu(true);

		}
		return 1;
	}

	public Integer isItemMenu(USSDMenuDisplay menu, Map<Integer, String> map, List<KnowledgeBase> itemList, int count) {
		
		if (itemList.get(0).isMenu()) {
		
			for (KnowledgeBase itemEntity : itemList) {
				count++;
				map.put(count, " " + itemEntity.getContent());
				
			}
			menu.setContentMap(map);
			menu.setFinalMenu(false);
		} else {
		
			menu.setContentDisplay(itemList.get(0).getContent());
			menu.setFinalMenu(true);
		}
		return count;
	}

	List<KnowledgeBase> findAllByParent(KnowledgeBase parent, List<KnowledgeBase> itemList) {
		try {
			itemList = knowledgeRepository.findAllByParentOrderByPositionAsc(parent);
		} catch (Exception e) {

			logger.debug("error occured");
		}
		return itemList;
	}

	public KnowledgeBase getContentByParentSelected(KnowledgeBase parent, int selectedChoice) {

		KnowledgeBase province = new KnowledgeBase();

		List<KnowledgeBase> itemList ;
	
			itemList = knowledgeRepository.findAllByParentOrderByPositionAsc(parent);
	
		int count = 0;
		if (!itemList.isEmpty()) {
			for (KnowledgeBase client : itemList) {

				count++;
				if (count == selectedChoice) {
					province = client;
				}

			}
		}

		return province;
	}


	
	

}
