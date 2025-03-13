package com.digital.umuganda.mbazaussd.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.digital.umuganda.mbazaussd.repository.USSDLoggingRepository;
import com.digital.umuganda.mbazaussd.domain.KnowledgeBase;
import com.digital.umuganda.mbazaussd.domain.USSDLogging;
import com.digital.umuganda.mbazaussd.domain.USSDTempLog;
import com.digital.umuganda.mbazaussd.enumerations.ELanguage;
import com.digital.umuganda.mbazaussd.repository.USSDTempLogRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class GeneralUtils {
	private final Logger logger = LoggerFactory.getLogger(GeneralUtils.class);

	@Autowired
	private HttpServletRequest request;
	@Autowired
	private USSDHelperUtils ussdHelper;

	@Autowired
	private USSDTempLogRepository ussdLogRepository;

	@Autowired
	private USSDLoggingRepository ussdLoggingRepository;

	public String formatErrorResponseText(ELanguage language) {
		if (language == null) {
			language = ELanguage.ENGLISH;
		}
		if (language.equals(ELanguage.ENGLISH)) {
			return "Something went wrong.\n\n0)Go back to main menu\n00)Go back to previous menu";
		} else if (language.equals(ELanguage.FRENCH)) {
			return "Quelque chose s'est mal passé.\n\n0)Retourner au menu principal\n00)Retourner au menu précédent";
		} else {
			return "Hari ibitagenze neza.\n\n0)Subira ahabanza\n00)Subira Inyuma";
		}
	}

	public String formatResponseText(String txtContent, ELanguage language) {

		/*
		 * Function to format the final return results
		 * 
		 */
		String textResponse = formatResponseText(txtContent);
		String finalresponse;
		if (language.equals(ELanguage.KINYARWANDA)) {

			finalresponse = textResponse + CommonHeadings.BACK_MENU_KINY + CommonHeadings.PARTIAL_BACK_MENU_KINY;
		} else {
			finalresponse = (language.equals(ELanguage.ENGLISH))
					? textResponse + CommonHeadings.BACK_MENU_ENG + CommonHeadings.PARTIAL_BACK_MENU_ENG
					: textResponse + CommonHeadings.BACK_MENU_FREN + CommonHeadings.PARTIAL_BACK_MENU_FREN;
		}
		return finalresponse;
	}

	@Value("${EXCHANGE_NAME}")
	String EXCHANGE_NAME;
	@Value("${QUEUE_NAME}")
	String QUEUE_NAME;
	@Value("${RABBITMQ_URL}")
	String RABBITMQ_URL;

	public void ussdLogging(String choice, USSDTempLog log, String content, String isNewRequest) {

		USSDLogging logging = new USSDLogging();

		logging.setDateTime(LocalDateTime.now());
		logging.setLanguage(log.getLanguage());
		logging.setMsisdn(log.getMsisdn());
		logging.setUniqSessionId(log.getUniqSessionId());
		logging.setContent(content);
		logging.setInputChoice(choice);
		logging.setIpAddress(request.getRemoteAddr());
		logging.setHttpMethod("GET");
		logging.setHttpResponse("200");
		logging.setStatus(isNewRequest);

		try {
			// send the USSDLogging object to RabbitMQ
			RabbitMQSender rb = new RabbitMQSender();
			rb.sendUSSDLogging(logging, EXCHANGE_NAME, QUEUE_NAME, RABBITMQ_URL);
			// RabbitMQSender.sendUSSDLogging(logging);
			System.out.println("message sent **************************");

		} catch (Exception e) {
			// e.printStackTrace();
		}
		ussdLoggingRepository.save(logging);

	}

	public String formatResponseText(String txtContent) {
		String textResponse;

		textResponse = txtContent.replace("{", "").replace("}", "").replace("=", ")").replace(", ",
				"\n").trim();

		return textResponse;

	}

	public String getInvalidInput(ELanguage language) {
		/*
		 * Function to return invalid option
		 * 
		 */
		String invalidText = "";
		if (language.equals(ELanguage.ENGLISH)) {

			invalidText = "Invalid input.\n";
		} else if (language.equals(ELanguage.FRENCH)) {

			invalidText = "Entrée invalide.\n";
		} else {
			invalidText = "Wanditse nabi.\n";
		}
		return invalidText;
	}

	public String[] returnPreviousMenu(KnowledgeBase parentId, USSDTempLog log, String msisdn) {
		/*
		 * Function to return to previous menu
		 * 
		 */

		String textResponse = "";
		String action = "FC";
		String[] result = new String[2];
		if (parentId != null) {

			action = handleNextMenu(parentId, log, action);
			USSDMenuDisplay contentByParent = ussdHelper.getContentByParent(parentId);
			textResponse = formatResponseText(
					contentByParent.getContentMap().toString(),
					log.getLanguage());

			log.setMsisdn(msisdn);

			log.setParentMenu(parentId);
			log.setParentId(parentId.getId());

			ussdLogRepository.save(log);

		} else {
			textResponse = initialMenuWhenNoParentId(log, msisdn);

		}
		result[0] = textResponse;
		result[1] = action;

		return result;

	}

	// handleOtherLevels
	public String handleNextMenu(KnowledgeBase parentId, USSDTempLog log, String action) {
		String textResponse;
		USSDMenuDisplay contentByParent = ussdHelper.getContentByParent(parentId);
		if (contentByParent.isFinalMenu()) {
			textResponse = contentByParent.getContentDisplay();
			if (textResponse.contains(ResponseUtils.NO_DATA_FOUND_KINY)
					|| textResponse.contains(ResponseUtils.NO_DATA_FOUND_FR)
					|| textResponse.contains(ResponseUtils.NO_DATA_FOUND_EN)) {
				action = "FB";

			} else {
				textResponse = responseByLanguage(textResponse, log);
				action = "FC";
				logger.debug(textResponse);
			}
		} else {

			textResponse = formatResponseText(contentByParent.getContentMap().toString(),
					log.getLanguage());

		}
		log.setParentMenu(parentId);
		log.setParentId(parentId.getId());
		logger.debug(textResponse);
		ussdLogRepository.save(log);
		return action;
	}

	public String initialMenuWhenNoParentId(USSDTempLog log, String msisdn) {
		String textResponse;
		String languages = formatResponseText(ussdHelper.getLanguages().toString());

		log.setLevel(0);
		log.setMsisdn(msisdn);
		log.setParentId(null);
		log.setAnswerLevel(0);
		ussdLogRepository.save(log);
		textResponse = CommonHeadings.WLCOME_MSG + languages;
		return textResponse;
	}

	public String[] handler(String input, String isnewrequest, String msisdn) {
		USSDTempLog log = ussdLogRepository.findByMsisdn(msisdn);

		ELanguage language = ELanguage.KINYARWANDA;

		if (log != null) {
			language = log.getLanguage();
		}

		String textResponse = formatErrorResponseText(language);
		String action = "FC";
		String[] reponse = { textResponse, action, "0", "0" };

		boolean isNew = isnew(input, isnewrequest);
		Map<Integer, String> languagesMap = ussdHelper.getLanguages();
		String languages = formatResponseText(languagesMap.toString());
		if (isNew || (log == null)) {
			textResponse = CommonHeadings.WLCOME_MSG + languages;
			handleNewComer(input, isnewrequest, msisdn, textResponse);
		} else {
			if (input.equals("0")) {
				textResponse = goBackToRootMenu(msisdn, log);
			} else if (input.equals("00")) {
				System.out.println("returning to previous");

				try {
					KnowledgeBase parentId = log.getParentMenu().getParent();

					String[] result = returnPreviousMenu(parentId, log, msisdn);
					textResponse = result[0];
					action = result[1];

				} catch (Exception e) {
					// textResponse = initialMenuWhenNoParentId(log, msisdn);
					logger.error("error during return to previous", e);
				}
			} else {

				KnowledgeBase parent = log.getParentMenu();

				Map<Integer, String> parentMap = ussdHelper.getContentByParent(parent).getContentMap();

				if (parentMap != null && parentMap.size() < Integer.parseInt(input)) {
					String[] previous = returnPreviousMenu(parent, log, msisdn);
					textResponse = previous[0];
					action = previous[1];
				} else {
					String[] resultresponse = nextLevelHandler(input, log);
					textResponse = resultresponse[0];
					action = resultresponse[1];
				}

			}
			ussdLogging(input, log, textResponse, isnewrequest);

		}

		reponse[0] = textResponse;
		reponse[1] = action;
		reponse[2] = isNew ? "1" : "0";
		reponse[3] = languagesMap.size() == 1 ? "1" : "0";

		return reponse;
	}

	public String goBackToRootMenu(String msisdn, USSDTempLog log) {
		String textResponse;
		String languages = formatResponseText(ussdHelper.getLanguages().toString());
		log.setLevel(0);
		log.setMsisdn(msisdn);
		log.setParentId(null);
		log.setAnswerLevel(0);
		logger.debug(msisdn);
		ussdLogRepository.save(log);
		textResponse = CommonHeadings.WLCOME_MSG + languages;
		return textResponse;
	}

	public void handleNewComer(String input, String isnewrequest, String msisdn, String textResponse) {

		List<USSDTempLog> ussdList = ussdLogRepository.findAllByMsisdn(msisdn);
		if (!ussdList.isEmpty()) {
			for (USSDTempLog item : ussdList) {
				ussdLogRepository.delete(item);
			}
		}
		USSDTempLog log = new USSDTempLog();
		log.setLevel(0);
		log.setMsisdn(msisdn);
		log.setParentMenu(null);
		log.setParentId(null);
		log.setAnswerLevel(0);
		log.setUniqSessionId(UUID.randomUUID().toString());
		ussdLogRepository.save(log);
		ussdLogging(input, log, textResponse, isnewrequest);
	}

	public String responseByLanguage(String textResponse, USSDTempLog log) {
		if (log.getLanguage().equals(ELanguage.ENGLISH)) {
			textResponse = textResponse + CommonHeadings.BACK_MENU_ENG
					+ CommonHeadings.PARTIAL_BACK_MENU_ENG;
		} else if (log.getLanguage().equals(ELanguage.FRENCH)) {
			textResponse = textResponse + CommonHeadings.BACK_MENU_FREN
					+ CommonHeadings.PARTIAL_BACK_MENU_FREN;
		} else if (log.getLanguage().equals(ELanguage.KINYARWANDA)) {
			textResponse = textResponse + CommonHeadings.BACK_MENU_KINY
					+ CommonHeadings.PARTIAL_BACK_MENU_KINY;
		}

		return textResponse;
	}

	public String checkLanguage(USSDTempLog log) {
		String textResponse;
		if (log.getLanguage().equals(ELanguage.ENGLISH)) {
			textResponse = CommonHeadings.END_MENU_ENG;
		} else if (log.getLanguage().equals(ELanguage.FRENCH)) {
			textResponse = CommonHeadings.END_MENU_FRENCH;
		} else if (log.getLanguage().equals(ELanguage.KINYARWANDA)) {
			textResponse = CommonHeadings.END_MENU_KINY;
		} else {
			textResponse = "Bye";
		}
		return textResponse;
	}

	public String firstMenuFunction(USSDTempLog log, int choice) {
		String textResponse = "";
		ELanguage language;
		KnowledgeBase languageSelected;
		try {
			languageSelected = ussdHelper.getLanguageSelected(choice);

			if (languageSelected.getContent().equalsIgnoreCase("KINYARWANDA")) {

				language = ELanguage.KINYARWANDA;

			} else if (languageSelected.getContent().equalsIgnoreCase("ENGLISH")) {
				language = ELanguage.ENGLISH;
			} else {

				language = ELanguage.FRENCH;
			}
			textResponse = formatResponseText(
					ussdHelper.getContentByParent(languageSelected).getContentMap().toString(), language);
			log.setLevel(1);
			log.setParentMenu(languageSelected);
			log.setLanguage(language);
			log.setParentId(languageSelected.getId());
			log.setAnswerLevel(0);
			ussdLogRepository.save(log);
		} catch (Exception e) {
			String languages = formatResponseText(ussdHelper.getLanguages().toString());
			textResponse = CommonHeadings.WLCOME_MSG + languages;
		}

		return textResponse;
	}

	public int isnumber(String input) {
		int choice = 0;
		try {
			choice = Integer.parseInt(input);
		} catch (NumberFormatException e) {
			logger.debug("The input is not a string, loglevel ==1");

		}
		return choice;
	}

	/**
	 * @param choice
	 * @param log
	 * @return
	 */
	public String[] handleOtherLevels(int choice, USSDTempLog log) {

		ELanguage language = ELanguage.KINYARWANDA;

		if (log != null) {
			language = log.getLanguage();
		}

		String textResponse = formatErrorResponseText(language);
		String action = "FC";
		String[] responsearray = { textResponse, action };
		try {

			KnowledgeBase userselection;
			userselection = ussdHelper.getContentByParentSelected(log.getParentMenu(), choice);

			USSDMenuDisplay contentByParent = ussdHelper.getContentByParent(userselection);

			if (contentByParent.isFinalMenu()) {
				textResponse = contentByParent.getContentDisplay();
			} else {
				textResponse = contentByParent.getContentMap().toString();
			}

			if (textResponse.contains(ResponseUtils.NO_DATA_FOUND_KINY)
					|| textResponse.contains(ResponseUtils.NO_DATA_FOUND_FR)
					|| textResponse.contains(ResponseUtils.NO_DATA_FOUND_EN)) {
				action = "FB";

			} else {
				textResponse = formatResponseText(
						textResponse,
						log.getLanguage());
			}

			log.setParentMenu(userselection);
			log.setParentId(userselection.getId());
			log.setAnswerLevel(0);
			ussdLogRepository.save(log);
			responsearray[0] = textResponse;
			responsearray[1] = action;
			return responsearray;
		} catch (Exception e) {
			logger.debug("Something went wrong" + e.getStackTrace());
			return responsearray;
		}

	}

	public boolean isnew(String input, String isnewrequest) {
		return (input.startsWith(CommonHeadings.USSD_START_NUMBER) && isnewrequest.equals("1"));

	}

	public boolean isRertuningFromLevel0(String input, USSDTempLog log) {
		return (input.equals("00") && (log.getLevel() == 0));
	}

	public boolean isRertuningFromLevel1(String input, USSDTempLog log) {
		return (input.equals("00") && log.getLevel() == 1);
	}

	public String[] nextLevelHandler(String input, USSDTempLog log) {
		ELanguage language = ELanguage.KINYARWANDA;
		String textResponse = formatErrorResponseText(language);
		String action = "FC";
		String[] resultrresponse = { textResponse, action };

		if (log.getLevel() == 0) {
			int choice = isnumber(input);
			resultrresponse[0] = firstMenuFunction(log, choice);
		} else {
			int choice = isnumber(input);
			String[] resultarray = handleOtherLevels(choice, log);
			resultrresponse[0] = resultarray[0];
			resultrresponse[1] = resultarray[1];

		}
		return resultrresponse;
	}

	public String mssidnHashing(String mssidn) {
		try {
			MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");

			messageDigest.update(mssidn.getBytes());

			byte[] resultByteArray = messageDigest.digest();

			StringBuilder sb = new StringBuilder();

			for (byte b : resultByteArray) {
				sb.append(String.format("%02x", b));
			}
			if (mssidn.startsWith("078") || mssidn.startsWith("079") ||
					mssidn.startsWith("25078") || mssidn.startsWith("25079")) {
				return "MTN#" + sb.toString();
			} else if (mssidn.startsWith("072") || mssidn.startsWith("073") ||
					mssidn.startsWith("25072") || mssidn.startsWith("25073")) {
				return "AIRTEL#" + sb.toString();
			} else {
				return "UNK#" + sb.toString();
			}

		} catch (NoSuchAlgorithmException e) {
			logger.error("error occured", e);
		}

		return "";
	}
}