// package com.digital.umuganda.mbazaussd;

// import static org.assertj.core.api.Assertions.assertThat;
// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertFalse;
// import static org.junit.jupiter.api.Assertions.assertTrue;
// import static org.mockito.Mockito.mock;
// import static org.mockito.Mockito.times;
// import static org.mockito.Mockito.verify;
// import com.digital.umuganda.mbazaussd.repository.KnowledgeBaseRepository;
// import com.digital.umuganda.mbazaussd.repository.USSDTempLogRepository;
// import com.digital.umuganda.mbazaussd.domain.AuditDomain;
// import com.digital.umuganda.mbazaussd.domain.GlobalProperty;
// import com.digital.umuganda.mbazaussd.domain.GlobalUrls;
// import com.digital.umuganda.mbazaussd.domain.KnowledgeBase;
// import com.digital.umuganda.mbazaussd.domain.Passphrase;
// import com.digital.umuganda.mbazaussd.domain.Question;
// import com.digital.umuganda.mbazaussd.domain.USSDLogging;
// import com.digital.umuganda.mbazaussd.domain.USSDTempLog;

// import org.junit.jupiter.api.AfterAll;
// import org.junit.jupiter.api.Order;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.context.annotation.PropertySource;
// import org.springframework.test.context.event.annotation.AfterTestClass;

// import java.lang.Math;
// import java.lang.reflect.Constructor;
// import java.lang.reflect.InvocationTargetException;
// import java.lang.reflect.Modifier;
// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.util.ArrayList;
// import java.util.Date;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.UUID;

// import com.digital.umuganda.mbazaussd.controller.*;
// import com.digital.umuganda.mbazaussd.utils.*;
// import com.digital.umuganda.mbazaussd.utils.USSDMenuDisplay;

// import lombok.Value;

// import com.digital.umuganda.mbazaussd.enumerations.ELanguage;

// @PropertySource("classpath:application.properties")
// @SpringBootTest
// class MbazaussdApplicationTests {
	
// 	@Autowired
// 	private GeneralUtils generalUtils;

// 	@Autowired
// 	private GBVController controller;

// 	@Autowired
// 	private KnowledgeBaseRepository knowledgeBaseRepository;

// 	@Autowired
// 	private USSDTempLogRepository uSSDTempLogRepository;

// 	@Autowired
// 	private USSDHelperUtils ussdHelper;

// 	USSDTempLog log = new USSDTempLog();

// 	public static final String MSISDN = "2507802893" + (int) (Math.random());
// 	public static final String OK_STATUS_CODE = "200";
// 	ELanguage language = ELanguage.KINYARWANDA;
// 	KnowledgeBase languageSelected;
// 	public static final String TEST_RESPONSE = "Murakaza neza kuri GBV Platform";
	
//     @Order(1)
// 	@Test
// 	void contextLoads() {

// 		assertThat(controller).isNotNull();
// 		String response;
// 		response =controller.ussdHandler("250788323052", "12", "0").toString();
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);

// 		response = controller.ussdHandler(MSISDN, "114", "1").toString();
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);
// 		response = controller.ussdHandler(MSISDN, "114", "1").toString();
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);
// 		response = controller.ussdHandler(MSISDN, "1", "0").toString();
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);
// 		response = controller.ussdHandler(MSISDN, "0", "0").toString();
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);
// 		response = controller.ussdHandler(MSISDN, "1", "0").toString();
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);
// 		response = controller.ussdHandler(MSISDN, "00", "0").toString();
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);
// 		response = controller.ussdHandler(MSISDN, "1", "0").toString();
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);
// 		response = controller.ussdHandler(MSISDN, "1", "0").toString();
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);
// 		response = controller.ussdHandler(MSISDN, "0", "0").toString();
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);
// 		response = controller.ussdHandler(MSISDN, "2", "0").toString();
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);
// 		response = controller.ussdHandler(MSISDN, "1", "0").getBody();
// 		assertThat(response.replaceAll("\n", "").replaceAll(" ", "")).isEqualTo("IkazekuriGBVplatform");
// 		response = controller.ussdHandler(MSISDN, "00", "0").getBody();
// 		assertThat(response.replaceAll("\n", "").replaceAll(" ", "")).isEqualTo("IkazekuriGBVplatform");
// 		response = controller.ussdHandler(MSISDN, "114", "0").getBody();
// 		assertThat(response.replaceAll("\n", "").replaceAll(" ", "")).isEqualTo("IkazekuriGBVplatform");
// 		response = controller.ussdHandler(MSISDN, "1", "0").getBody();
// 		assertThat(response.replaceAll("\n", "").replaceAll(" ", "")).isEqualTo("IkazekuriGBVplatform");
// 		response = controller.ussdHandler(MSISDN, "4", "0").getBody();
// 		assertThat(response.replaceAll("\n", "").replaceAll(" ", "")).isEqualTo("IkazekuriGBVplatform");
// 		response = controller.ussdHandler(MSISDN, "4", "1").getBody();
// 		assertThat(response.replaceAll("\n", "").replaceAll(" ", "")).isEqualTo("IkazekuriGBVplatform");
	
// 	}

// 	@Test
// 	void testGenaralUtils() {
// 		assertThat(generalUtils.formatResponseText("hello world", ELanguage.ENGLISH))
// 				.isEqualTo("hello world\n\n0)Home\n00)Back");
// 		assertThat(generalUtils.formatResponseText("salut", ELanguage.FRENCH))
// 				.isEqualTo("salut\n\n0)Accueil\n00)Retour");
// 		assertThat(generalUtils.formatResponseText("muraho", ELanguage.KINYARWANDA))
// 				.isEqualTo("muraho\n\n0)Ahabanza\n00)Subira Inyuma");

// 		assertThat(generalUtils.getInvalidInput(ELanguage.ENGLISH)).isEqualTo("Invalid input.\n");
// 		assertThat(generalUtils.getInvalidInput(ELanguage.FRENCH)).isEqualTo("Entrée invalide.\n");
// 		assertThat(generalUtils.getInvalidInput(ELanguage.KINYARWANDA)).isEqualTo("Wanditse nabi.\n");
// 		assertTrue(generalUtils.isnew("114", "1"));
// 		assertFalse(generalUtils.isnew("00", "1123"));
// 		assertEquals(2, generalUtils.isnumber("2"));
// 		assertEquals(0, generalUtils.isnumber("testing"));
// 		log.setLevel(1);
// 		assertFalse(generalUtils.isRertuningFromLevel0("00", log));
// 		log.setLevel(0);
// 		assertTrue(generalUtils.isRertuningFromLevel0("00", log));
// 		log.setLevel(0);
// 		assertFalse(generalUtils.isRertuningFromLevel1("00", log));
// 		log.setLevel(1);
// 		assertTrue(generalUtils.isRertuningFromLevel1("00", log));

// 		log.setLevel(0);
// 		languageSelected = ussdHelper.getLanguageSelected(1);

// 		assertThat(generalUtils.initialMenuWhenNoParentId(log, MSISDN)).isEqualTo(
// 				CommonHeadings.WLCOME_MSG + generalUtils.formatResponseText(ussdHelper.getLanguages().toString()));
// 		log.setLanguage(ELanguage.ENGLISH);
// 		assertThat(generalUtils.checkLanguage(log)).isEqualTo(CommonHeadings.END_MENU_ENG);
// 		log.setLanguage(ELanguage.KINYARWANDA);
// 		assertThat(generalUtils.checkLanguage(log)).isEqualTo(CommonHeadings.END_MENU_KINY);
// 		log.setLanguage(ELanguage.FRENCH);
// 		assertThat(generalUtils.checkLanguage(log)).isEqualTo(CommonHeadings.END_MENU_FRENCH);
// 		log.setLanguage(ELanguage.NONE);
// 		assertThat(generalUtils.checkLanguage(log)).isEqualTo("Bye");
// 		assertThat(generalUtils.formatResponseText("{}")).isEmpty();

// 		assertThat(generalUtils.returnPreviousMenu(null, log, MSISDN)[0]).isEqualTo(
// 				CommonHeadings.WLCOME_MSG + generalUtils.formatResponseText(ussdHelper.getLanguages().toString()));
		
	
// 	}

	


// 	@Test
// 	void testGenaralUtil() {

// 		log.setLevel(0);
// 		languageSelected = ussdHelper.getLanguageSelected(1);
// 		languageSelected.setAskMenu(false);
// 		languageSelected.setContent("hello test");
// 		languageSelected.setPosition(0);
// 		languageSelected.setMenu(true);
// 		languageSelected.setId(Long.valueOf(1));
// 		log.setLevel(0);
// 		log.setMsisdn(MSISDN);
// 		log.setParentMenu(null);
// 		log.setParentId(null);
// 		log.setAnswerLevel(0);
// 		log.setUniqSessionId(UUID.randomUUID().toString());
// 		knowledgeBaseRepository.save(languageSelected);
// 		uSSDTempLogRepository.save(log);
// 		assertThat(generalUtils.returnPreviousMenu(languageSelected, log, MSISDN)[0].replaceAll("\n", "")
// 				.replaceAll(" ", "")).isEqualTo("IkazekuriGBVplatform1)hellotest");

// 		assertThat(generalUtils.goBackToRootMenu(MSISDN, log)).isEqualTo(
// 				CommonHeadings.WLCOME_MSG + generalUtils.formatResponseText(ussdHelper.getLanguages().toString()));
// 		uSSDTempLogRepository.deleteAll();
// 		knowledgeBaseRepository.deleteAll();
// 		assertThat(generalUtils.handler("114", "1", MSISDN)[1]).isEqualTo("FC");
// 		assertThat(generalUtils.handler("114", "1", MSISDN)[0].trim()).isEqualTo("Ikaze kuri GBV platform");
// 		log.setLanguage(ELanguage.ENGLISH);
// 		assertThat(generalUtils.responseByLanguage(TEST_RESPONSE, log).replaceAll("\n", "").replaceAll(" ", ""))
// 				.isEqualTo("MurakazanezakuriGBVPlatform0)Home00)Back");
// 		log.setLanguage(ELanguage.KINYARWANDA);

// 		assertThat(generalUtils.responseByLanguage(TEST_RESPONSE, log).replaceAll("\n", "").replaceAll(" ", ""))
// 				.isEqualTo("MurakazanezakuriGBVPlatform0)Ahabanza00)SubiraInyuma");
// 		log.setLanguage(ELanguage.FRENCH);

// 		assertThat(generalUtils.responseByLanguage(TEST_RESPONSE, log).replaceAll("\n", "").replaceAll(" ", ""))
// 				.isEqualTo("MurakazanezakuriGBVPlatform0)Accueil00)Retour");

		
// 		assertThat(generalUtils.nextLevelHandler("1", log)[1]).isEqualTo("FC");
// 		log.setLevel(1);
// 		assertThat(generalUtils.nextLevelHandler("1", log)[1]).isEqualTo("FC");
// 		assertThat(generalUtils.firstMenuFunction(log, 1).trim()).isEqualTo("Ikaze kuri GBV platform");

// 		assertThat(generalUtils.firstMenuFunction(log, 1).trim()).isEqualTo("Ikaze kuri GBV platform");

// 		languageSelected.setAskMenu(false);
// 		languageSelected.setContent("hello test");
// 		languageSelected.setPosition(0);
// 		languageSelected.setMenu(true);
// 		languageSelected.setId(Long.valueOf(1));
// 		log.setLanguage(ELanguage.KINYARWANDA);
// 		knowledgeBaseRepository.save(languageSelected);

// 		log.setLevel(0);
// 		log.setMsisdn(MSISDN);
// 		log.setParentMenu(null);
// 		log.setParentId(null);
// 		log.setAnswerLevel(0);
// 		log.setUniqSessionId(UUID.randomUUID().toString());

// 		uSSDTempLogRepository.save(log);

// 		languageSelected.setAskMenu(true);
// 		languageSelected.setContent("hello test");
// 		languageSelected.setPosition(0);
// 		languageSelected.setMenu(true);
// 		languageSelected.setId(Long.valueOf(1));
// 		log.setLanguage(ELanguage.KINYARWANDA);
// 		knowledgeBaseRepository.save(languageSelected);

// 		log.setLevel(0);
// 		log.setMsisdn(MSISDN);
// 		log.setParentMenu(null);
// 		log.setParentId(null);
// 		log.setAnswerLevel(0);
// 		log.setUniqSessionId(UUID.randomUUID().toString());
// 		uSSDTempLogRepository.save(log);

// 		knowledgeBaseRepository.deleteAll();

// 		KnowledgeBase kb = new KnowledgeBase();
// 		kb.setAskMenu(true);
// 		kb.setContent("KINYARWANDA");
// 		kb.setId(Long.valueOf(1));
// 		kb.setMenu(true);
// 		kb.setPosition(0);
// 		kb.setParent(null);
// 		knowledgeBaseRepository.save(kb);
// 		assertThat(generalUtils.firstMenuFunction(log, 1).replaceAll("\n", "").replaceAll(" ", ""))
// 				.isEmpty();
// 		knowledgeBaseRepository.deleteAll();
// 		kb.setContent("ENGLISH");
// 		knowledgeBaseRepository.save(kb);
// 		assertThat(generalUtils.firstMenuFunction(log, 1).replaceAll("\n", "").replaceAll(" ", ""))
// 				.isEmpty();
// 		knowledgeBaseRepository.deleteAll();
// 		kb.setContent("FRENCH");
// 		knowledgeBaseRepository.save(kb);
// 		assertThat(generalUtils.firstMenuFunction(log, 1).replaceAll("\n", "").replaceAll(" ", ""))
// 				.isEmpty();
// 		// knowledgeBaseRepository.deleteAll();

// 		// test handleNextMenu function from general util
// 		KnowledgeBase languageSelected = new KnowledgeBase();
// 		KnowledgeBase parentkb = new KnowledgeBase();
// 		knowledgeBaseRepository.deleteAll();
// 		parentkb.setAskMenu(true);
// 		parentkb.setContent("testcontent");
// 		parentkb.setPosition(2);
// 		parentkb.setMenu(true);

// 		kb.setAskMenu(true);
// 		kb.setContent("KINYARWANDA");
// 		kb.setId(Long.valueOf(1));
// 		kb.setMenu(true);
// 		kb.setPosition(0);
// 		kb.setParent(parentkb);
// 		knowledgeBaseRepository.save(parentkb);
// 		knowledgeBaseRepository.save(kb);
// 		languageSelected.setAskMenu(true);
// 		languageSelected.setMenu(true);
// 		languageSelected.setParent(parentkb);

// 		log.setLevel(0);
// 		log.setMsisdn(MSISDN);
// 		log.setParentMenu(null);
// 		log.setParentId(null);
// 		log.setAnswerLevel(0);
// 		log.setUniqSessionId(UUID.randomUUID().toString());
// 		uSSDTempLogRepository.save(log);
// 		languageSelected.setParent(parentkb);
// 		assertThat(generalUtils.handleNextMenu(parentkb, log, "FB")).isEqualTo("FB");

// 	}

// 	@Test
// 	void testhandleNewComer() {
// 		GeneralUtils generalUtils = mock(GeneralUtils.class);
// 		generalUtils.handleNewComer("114", "1", "078875785", "Ikaze kuri GBV platform");
// 		verify(generalUtils, times(1)).handleNewComer("114", "1", "078875785", "Ikaze kuri GBV platform");

// 	}

// 	@Test
// 	void testUssdLogging() {
// 		GeneralUtils generalUtils = mock(GeneralUtils.class);
// 		generalUtils.ussdLogging("1", log, "testscontent", "1");

// 		verify(generalUtils, times(1)).ussdLogging("1", log, "testscontent", "1");
// 	}

// 	@Test
// 	void testUssdLoggingtrue() {
// 		GeneralUtils generalUtils = mock(GeneralUtils.class);
// 		generalUtils.ussdLogging("1", log, "testscontent", "1");

// 		verify(generalUtils, times(1)).ussdLogging("1", log, "testscontent", "1");
// 	}
// 	@Test
// 	void testisItemMenu() {
// 		KnowledgeBase languageSelected = new KnowledgeBase();

// 		USSDMenuDisplay menu = new USSDMenuDisplay();
// 		menu.setAskMenu(true);

// 		menu.setContentDisplay("");
// 		menu.setFinalMenu(false);
// 		Map<Integer, String> map = new HashMap<>();
// 		map.put(1, "testcontent");
// 		List<KnowledgeBase> itemList = new ArrayList<>();
// 		languageSelected.setMenu(true);
// 		languageSelected.setAskMenu(true);
// 		itemList.add(languageSelected);
// 		KnowledgeBase kb = new KnowledgeBase();
// 		kb.setAskMenu(true);
// 		kb.setContent("KINYARWANDA");
// 		kb.setId(Long.valueOf(1));
// 		kb.setMenu(true);
// 		kb.setPosition(0);
// 		kb.setParent(null);
// 		itemList.add(kb);

// 		assertThat(ussdHelper.isItemMenu(menu, map, itemList, 1)).isEqualTo(3);

// 	}

// 	@Test
// 	void testisItemMenuTrue() {
// 		KnowledgeBase languageSelected = new KnowledgeBase();

// 		USSDMenuDisplay menu = new USSDMenuDisplay();
// 		menu.setAskMenu(false);
// 		menu.setContentDisplay("");
// 		menu.setFinalMenu(false);
// 		Map<Integer, String> map = new HashMap<>();
// 		map.put(1, "testcontent");

// 		List<KnowledgeBase> itemList = new ArrayList<>();
// 		languageSelected.setMenu(false);

// 		itemList.add(languageSelected);

// 		assertThat(ussdHelper.isItemMenu(menu, map, itemList, 1)).isEqualTo(1);
// 		String response = controller.ussdHandler(MSISDN, "114", "1").toString();
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);
// 		response=controller.ussdHandler(MSISDN, "1", "0").toString();
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);
// 		response=controller.ussdHandler(MSISDN, "1", "0").toString();
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);
// 		response=controller.ussdHandler(MSISDN, "00", "0").toString();
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);

		
// 	}

// 	@Test
// 	void testisGetContent() {
// 		KnowledgeBase languageSelected = new KnowledgeBase();
// 		KnowledgeBase knowledgebase = new KnowledgeBase();

// 		USSDMenuDisplay menu = new USSDMenuDisplay();
// 		menu.setAskMenu(true);
// 		menu.setContentDisplay("");
// 		menu.setFinalMenu(false);
// 		Map<Integer, String> map = new HashMap<>();
// 		map.put(1, "testcontent");

// 		List<KnowledgeBase> itemList = new ArrayList<KnowledgeBase>();
// 		languageSelected.setMenu(true);
// 		languageSelected.setPosition(1);
// 		languageSelected.setAskMenu(true);
// 		languageSelected.setContent("");

// 		knowledgebase.setMenu(true);
// 		knowledgebase.setPosition(1);
// 		knowledgebase.setAskMenu(true);
// 		knowledgebase.setContent("");
// 		itemList.add(languageSelected);
// 		itemList.add(knowledgebase);
// 		assertThat(ussdHelper.getContent(menu, map, itemList, 2)).isEqualTo(1);
// 		List<KnowledgeBase> itemList2 = new ArrayList<KnowledgeBase>();
// 		itemList2.add(languageSelected);
// 		assertThat(ussdHelper.getContent(menu, map, itemList2, 2)).isEqualTo(1);

// 	}

// 	@Test
// 	void testmodels() {
// 		USSDTempLog ussdtemp = new USSDTempLog();
// 		KnowledgeBase languageSelected = new KnowledgeBase();
// 		ussdtemp.setAnswerLevel(1);
// 		ussdtemp.setTitle("testtitle");
// 		ussdtemp.setSecondLevel(2);
// 		ussdtemp.setNumberOfCodeRegistered(3);
// 		ussdtemp.setUserChoice(2);
// 		ussdtemp.setTelephone("0788683");
// 		languageSelected.setAskMenu(true);
// 		languageSelected.setPosition(1);
// 		ussdtemp.setChildMenu(languageSelected);
// 		ussdtemp.setPhoneNumber(MSISDN);
// 		ussdtemp.setParentId(Long.valueOf(1));
// 		Question qn = new Question();

// 		qn.setEndQuestion(1);
// 		qn.setPosition(0);
// 		ussdtemp.setQuestion(qn);

// 		assertThat(ussdtemp).isNotNull();
// 		assertThat(qn).isNotNull();
// 		assertThat(ussdtemp.getPhoneNumber()).isEqualTo(MSISDN);
// 		assertThat(ussdtemp.getAnswerLevel()).isEqualTo(1);
// 		assertThat(ussdtemp.getTitle()).isEqualTo("testtitle");
// 		assertThat(ussdtemp.getSecondLevel()).isEqualTo(2);
// 		assertThat(ussdtemp.getNumberOfCodeRegistered()).isEqualTo(3);
// 		assertThat(ussdtemp.getUserChoice()).isEqualTo(2);
// 		assertThat(ussdtemp.getTelephone()).isEqualTo("0788683");
// 		assertThat(ussdtemp.getChildMenu().getPosition()).isEqualTo(1);
// 		assertThat(ussdtemp.getQuestion().getEndQuestion()).isEqualTo(1);
// 		assertThat(ussdtemp.getQuestion().getPosition()).isZero();
// 		assertThat(ussdtemp.getParentId()).isEqualTo(Long.valueOf(1));
// 		USSDLogging ussdLogging = new USSDLogging();
// 		ussdLogging.setContent("testcontent");
// 		ussdLogging.setInputChoice("2");
// 	}

// 	@Test
// 	void testUssdLogModel() {
// 		ELanguage language = ELanguage.KINYARWANDA;
// 		USSDLogging ussdLog = new USSDLogging();
// 		ussdLog.setContent("testcontent");
// 		ussdLog.setInputChoice("2");
// 		ussdLog.setMsisdn(MSISDN);
// 		ussdLog.setLanguage(language);
// 		LocalDateTime lc = LocalDateTime.now();
// 		ussdLog.setDateTime(lc);
// 		ussdLog.setStatus(OK_STATUS_CODE);
// 		ussdLog.setUniqSessionId("12345");
// 		ussdLog.setIpAddress("192.168.1.0");
// 		ussdLog.setHttpMethod("GET");
// 		ussdLog.setHttpResponse(TEST_RESPONSE);
// 		ussdLog.setTypeOfContent("information");
// 		assertThat(ussdLog.getContent()).isEqualTo("testcontent");
// 		assertThat(ussdLog.getInputChoice()).isEqualTo("2");
// 		assertThat(ussdLog.getMsisdn()).isEqualTo(MSISDN);
// 		assertThat(ussdLog.getLanguage()).isEqualTo(ELanguage.KINYARWANDA);
// 		assertThat(ussdLog.getStatus()).isEqualTo(OK_STATUS_CODE);
// 		assertThat(ussdLog.getUniqSessionId()).isEqualTo("12345");
// 		assertThat(ussdLog.getIpAddress()).isEqualTo("192.168.1.0");
// 		assertThat(ussdLog.getHttpMethod()).isEqualTo("GET");
// 		assertThat(ussdLog.getHttpResponse()).isEqualTo(TEST_RESPONSE);
// 		assertThat(ussdLog.getTypeOfContent()).isEqualTo("information");
// 		assertThat(ussdLog.getDateTime()).isEqualTo(lc);
// 	}

// 	@Test
// 	void testQuestionModel() {
// 		Question qn = new Question();

// 		qn.setEndQuestion(1);
// 		qn.setPosition(0);
// 		qn.setAnswerType("info");
// 		qn.setQuestionEn("hello?");
// 		qn.setQuestionFr("bonjour?");
// 		qn.setQuestionRw("muraho?");
// 		qn.setTitleIdEn(1);
// 		qn.setTitleIdFr(0);
// 		qn.setTitleIdRw(2);
// 		qn.setId(Long.valueOf(1));
// 		assertThat(qn.getEndQuestion()).isEqualTo(1);
// 		assertThat(qn.getPosition()).isZero();
// 		assertThat(qn.getAnswerType()).isEqualTo("info");
// 		assertThat(qn.getQuestionEn()).isEqualTo("hello?");
// 		assertThat(qn.getQuestionFr()).isEqualTo("bonjour?");
// 		assertThat(qn.getQuestionRw()).isEqualTo("muraho?");
// 		assertThat(qn.getTitleIdEn()).isEqualTo(1);
// 		assertThat(qn.getTitleIdFr()).isZero();
// 		assertThat(qn.getTitleIdRw()).isEqualTo(2);
// 		assertThat(qn.getId()).isEqualTo(Long.valueOf(1));

// 	}

// 	@Test
// 	void testKnowledgeBaseModel() {

// 		KnowledgeBase kb = new KnowledgeBase();
// 		kb.setAskMenu(true);
// 		kb.setContent("testcontent");
// 		kb.setId(Long.valueOf(1));
// 		kb.setMenu(true);
// 		kb.setPosition(0);
// 		kb.setParent(kb);
// 		assertTrue(kb.isAskMenu());
// 		assertTrue(kb.isMenu());
// 		assertThat(kb.getContent()).isEqualTo("testcontent");
// 		assertThat(kb.getId()).isEqualTo(1);
// 		assertThat(kb.getPosition()).isZero();
// 		assertThat(kb.getParent().getPosition()).isZero();

// 	}

// 	@Test
// 	void testGlobalPropertyModel() {

// 		GlobalProperty gb = new GlobalProperty();
// 		gb.setPropertyId(Long.valueOf(1));
// 		gb.setPropertyName("test name");
// 		gb.setPropertyValue("test value");
// 		assertThat(gb.getPropertyId()).isEqualTo(Long.valueOf(1));
// 		assertThat(gb.getPropertyName()).isEqualTo("test name");
// 		assertThat(gb.getPropertyValue()).isEqualTo("test value");

// 	}

// 	@Test
// 	void testGlobalUrlsModel() {
// 		GlobalUrls gu = new GlobalUrls();
// 		gu.setPropertyId(Long.valueOf(1));
// 		gu.setUrlName("mbaza");
// 		gu.setUrlValue("www.mbaza.com");
// 		assertThat(gu.getPropertyId()).isEqualTo(Long.valueOf(1));
// 		assertThat(gu.getUrlName()).isEqualTo("mbaza");
// 		assertThat(gu.getUrlValue()).isEqualTo("www.mbaza.com");

// 	}
// 	// USSDMenuDisplay

// 	@Test
// 	void testUSSDMenuDisplayModel() {
// 		USSDMenuDisplay ud = new USSDMenuDisplay();
// 		ud.setAskMenu(true);
// 		ud.setContentDisplay("test content");
// 		ud.setFinalMenu(true);
// 		Map<Integer, String> map = new HashMap<>();
// 		map.put(1, "testcontent");
// 		ud.setContentMap(map);
// 		assertTrue(ud.isAskMenu());
// 		assertTrue(ud.isFinalMenu());
// 		assertThat(ud.getContentDisplay()).isEqualTo("test content");
// 		assertThat(ud.getContentMap()).isEqualTo(map);

// 	}

// 	// Passphrase
// 	@Test
// 	void testPassphraseModel() {
// 		Passphrase ph = new Passphrase();
// 		LocalDate lc = LocalDate.now();

// 		ph.setId(Long.valueOf(1));
// 		ph.setPPhrase("test pass");
// 		ph.setInputedDate(lc);
// 		assertThat(ph.getId()).isEqualTo(Long.valueOf(1));
// 		assertThat(ph.getPPhrase()).isEqualTo("test pass");
// 		assertThat(ph.getInputedDate()).isEqualTo(lc);

// 	}
// 	// AuditDomain

// 	@Test
// 	void testAuditDomainModel()
// 			throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {

// 		Date dt = new Date();
// 		AuditDomain ad = new AuditDomain() {
// 		};
// 		ad.setCreatedAt(dt);
// 		ad.setUpdatedAt(dt);
// 		assertEquals(ad.getCreatedAt(), dt);
// 		assertEquals(ad.getUpdatedAt(), dt);
// 		Constructor[] ctors = ResponseUtils.class.getDeclaredConstructors();
// 		Constructor ctor = ctors[0];
// 		assertFalse(ctor.isAccessible(), "Utility class constructor should be inaccessible");
// 		assertEquals(1, ctors.length, "Utility class should only have one constructor");
// 		assertTrue(Modifier.isPrivate(ctor.getModifiers()));
// 		// ctor.setAccessible(true);
// 		// ctor.newInstance();
// 	}

// 	@Test
// 	void testContentByParentSelected() {

// 		KnowledgeBase languageSelected = new KnowledgeBase();
// 		KnowledgeBase parentkb = new KnowledgeBase();

// 		parentkb.setAskMenu(true);
// 		parentkb.setContent("testcontent");
// 		parentkb.setId(Long.valueOf(1));
// 		parentkb.setPosition(1);
// 		parentkb.setMenu(true);

// 		KnowledgeBase kb = new KnowledgeBase();
// 		kb.setAskMenu(true);
// 		kb.setContent("KINYARWANDA");
// 		kb.setId(Long.valueOf(1));
// 		kb.setMenu(true);
// 		kb.setPosition(0);
// 		kb.setParent(parentkb);
// 		knowledgeBaseRepository.save(parentkb);
// 		knowledgeBaseRepository.save(kb);
// 		languageSelected.setAskMenu(true);
// 		languageSelected.setMenu(true);
// 		languageSelected.setParent(parentkb);
// 		assertTrue(ussdHelper.getContentByParentSelected(parentkb, 1).isMenu());
// 		assertFalse(ussdHelper.getContentByParentSelected(parentkb, 2).isMenu());
// 		// System.out.println("*************************************************
// 		// "+ussdHelper.getContentByParentSelected(languageSelected, 1).isMenu());
// 	}

// 	@AfterTestClass
// 	void teshandleOtherLevels() {
// 		KnowledgeBase parent = new KnowledgeBase();
// 		// knowledgeBaseRepository.deleteAll();
	
// 		parent.setAskMenu(true);
// 		parent.setContent("testcontent");
// 		parent.setPosition(1);
// 		parent.setMenu(true);
// 		KnowledgeBase kb = new KnowledgeBase();
// 		kb.setAskMenu(false);
// 		kb.setContent("KINYARWANDA");
// 		kb.setMenu(false);
// 		kb.setPosition(2);
// 		kb.setParent(parent);
// 		knowledgeBaseRepository.save(parent);
// 		knowledgeBaseRepository.save(kb);
// 		log.setParentMenu(parent);
// 		log.setUserChoice(1);
		

// 		assertThat(generalUtils.handleOtherLevels(2, log)[0].trim()).isEqualTo("Error occured try again.");
// 		assertThat(generalUtils.handleOtherLevels(1, log)[1].trim()).isEqualTo("FC");
// 		kb.setMenu(false);
// 		knowledgeBaseRepository.save(kb);
// 		assertThat(generalUtils.handleOtherLevels(1, log)[0].trim()).isEqualTo("Error occured try again.");
// 		assertThat(generalUtils.handleOtherLevels(1, log)[1].trim()).isEqualTo("FC");


// 		KnowledgeBase parentkb = new KnowledgeBase();
// 		knowledgeBaseRepository.deleteAll();
// 		parentkb.setAskMenu(true);
// 		parentkb.setContent("testcontent");
// 		parentkb.setPosition(2);
// 		parentkb.setMenu(true);
// 		parentkb.setParent(parentkb);
// 		knowledgeBaseRepository.save(parentkb);
// 		USSDTempLog templog = new USSDTempLog();
// 		templog.setLevel(1);
// 		templog.setMsisdn("078888");
// 		templog.setParentId(null);
// 		templog.setAnswerLevel(0);
// 		templog.setParentMenu(parentkb);
// 		// templog.setParentMenu(parentkb);
		
// 		uSSDTempLogRepository.save(templog);
// 	 String response = generalUtils.handler("078888", "00", "0").toString();
	 
// 		assertThat(testUtils.getStatusCode(response)).isEqualTo(OK_STATUS_CODE);
	
// 	}


// 	@Test
// 	void teshashing() {
// 	assertTrue(generalUtils.mssidnHashing("078846374").startsWith("MTN"));
// 	assertTrue(generalUtils.mssidnHashing("079846374").startsWith("MTN"));
// 	assertTrue(generalUtils.mssidnHashing("07346374").startsWith("AIRTEL"));
// 	assertTrue(generalUtils.mssidnHashing("072846374").startsWith("AIRTEL"));
// 	}
// }
