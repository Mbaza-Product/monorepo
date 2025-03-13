package com.digital.umuganda.mbazaussd.utils;

import com.digital.umuganda.mbazaussd.entity.AlphaCode;

public class CommonHeadings {

	private CommonHeadings() {

	}

	public static final String WELCOME_MESSAGE_ENG = "Welcome to Mbaza\n";
	public static final String WELCOME_MESSAGE_FREN = "Bienvenue à Mbaza\n";
	public static final String WELCOME_MESSAGE_KINY = "Ikaze Kuri Mbaza\n";

	public static String URL_STRING;
	public static final String WLCOME_MSG = "Hitamo ururimo \n\n";

	public static final String BACK_MENU_ENG = "\n\n0)Home";
	public static final String BACK_MENU_FREN = "\n\n0)Accueil";
	public static final String BACK_MENU_KINY = "\n\n0)Ahabanza";

	public static final String PARTIAL_BACK_MENU_ENG = "\n00)Back";
	public static final String PARTIAL_BACK_MENU_FREN = "\n00)Retour";
	public static final String PARTIAL_BACK_MENU_KINY = "\n00)Subira Inyuma";

	public static final int MIN_AMOUNT = 100;
	public static final int MAX_AMOUNT = 2000000;
	public static final String USSD_START_NUMBER = "114";

	public static final String ANSWER_MENU_ENG = "\n1)Yes\n2)No";
	public static final String ANSWER_MENU_FRENCH = "\n1)Oui\n2)Non";
	public static final String ANSWER_MENU_KINY = "\n1)Yego\n2)Oya";

	public static final String END_MENU_TICKET_ENG = "Thank you, your request is well recieved!";
	public static final String END_MENU_TICKET_FRENCH = "Merci, votre demande est bien reçue!";
	public static final String END_MENU_TICKET_KINY = "Murakoze gusura urubuga rwacu rwa Mbaza, ikibazo  cyanyu cyakiriwe neza!";

	public static final String END_MENU_INFO_ENG = "Thank you for using Mbaza! Have a great day!";
	public static final String END_MENU_INFO_FRENCH = "Merci d'utiliser Mbaza! Passe une bonne journée!";
	public static final String END_MENU_INFO_KINY = "Urakoze gukoresha Mbaza! Mugire umunsi mwiza!";

	public static final String START_CATEGORY_MENU_ENG = "Select Category\n";
	public static final String START_CATEGORY_MENU_FRENCH = "Choisir une catégorie\n";
	public static final String START_CATEGORY_MENU_KINY = "Hitamo Icyiciro\n";

	public static final String START_DISTRICT_MENU_ENG = "Select District\n";
	public static final String START_DISTRICT_MENU_FRENCH = "Sélectionnez le district\n";
	public static final String START_DISTRICT_MENU_KINY = "Hitamo Akarere\n";

	public static final String START_PROVINCE_MENU_ENG = "Select Province\n";
	public static final String START_PROVINCE_MENU_FRENCH = "Sélectionnez une province\n";
	public static final String START_PROVINCE_MENU_KINY = "Hitamo Intara\n";

	public static final String START_SECTOR_MENU_ENG = "Select Sector\n";
	public static final String START_SECTOR_MENU_FRENCH = "Sélectionnez le secteur\n";
	public static final String START_SECTOR_MENU_KINY = "Hitamo Umurenge\n";

	public static final String START_CELL_MENU_ENG = "Select Cell\n";
	public static final String START_CELL_MENU_FRENCH = "Sélectionner une cellule\n";
	public static final String START_CELL_MENU_KINY = "Hitamo Akagari\n";

	public static final String START_VILLAGE_MENU_ENG = "Select Village\n";
	public static final String START_VILLAGE_MENU_FRENCH = "Sélectionnez Village\n";
	public static final String START_VILLAGE_MENU_KINY = "Hitamo Umudugudu\n";

	public static final String START_COMPLAINT_MENU_ENG = "Select Complaint\n";
	public static final String START_COMPLAINT_MENU_FRENCH = "Sélectionnez la plainte\n";
	public static final String START_COMPLAINT_MENU_KINY = "Hitamo Ikirego\n";

	public static final String INVALID_INPUT_EN = "Invalid input\n";
	public static final String INVALID_INPUT_FR = "Entrée invalide\n";
	public static final String INVALID_INPUT_RW = "Icyinjijwe kitemewe\n";

	public static final String BACK_EN = "Go back";
	public static final String BACK_FR = "Retourner";
	public static final String BACK_RW = "Subira inyuma";

	public static final String BACK_MAIN_EN = "Main Menu";
	public static final String BACK_MAIN_FR = "Menu principal";
	public static final String BACK_MAIN_RW = "Ibikuru bikuru";

	public static final String NO_DATA_EN = "No data";
	public static final String NO_DATA_FR = "Pas de données";
	public static final String NO_DATA_RW = "Nta makuru";

	public static final String END_MENU_ERROR_ENG = "Sorry, an error occured!";
	public static final String END_MENU_ERROR_FRENCH = "Désolé, une erreur s'est produite!";
	public static final String END_MENU_ERROR_KINY = "Ntibyakunze, habayemo ikibazo!";

	public static final String MY_TICKETS_ENG = "My Tickets";
	public static final String MY_TICKETS_FRENCH = "Mes billets";
	public static final String MY_TICKETS_KINY = "Amatike yanjye";

	public static String getWelcomeMessage(AlphaCode code) {
		switch (code) {
			case EN:
				return WELCOME_MESSAGE_ENG;
			case FR:
				return WELCOME_MESSAGE_FREN;
			default:
				return WELCOME_MESSAGE_KINY;
		}
	}

	public static String getEndingInfoMessage(AlphaCode code) {
		switch (code) {
			case EN:
				return END_MENU_INFO_ENG;
			case FR:
				return END_MENU_INFO_FRENCH;
			default:
				return END_MENU_INFO_KINY;
		}
	}

	public static String getEndingTicketMessage(AlphaCode code) {
		switch (code) {
			case EN:
				return END_MENU_TICKET_ENG;
			case FR:
				return END_MENU_TICKET_FRENCH;
			default:
				return END_MENU_TICKET_KINY;
		}
	}

	public static String getStartCategoryMenu(AlphaCode code) {
		switch (code) {
			case EN:
				return START_CATEGORY_MENU_ENG;
			case FR:
				return START_CATEGORY_MENU_FRENCH;
			default:
				return START_CATEGORY_MENU_KINY;
		}
	}

	public static String getStartDistrictMenu(AlphaCode code) {
		switch (code) {
			case EN:
				return START_DISTRICT_MENU_ENG;
			case FR:
				return START_DISTRICT_MENU_FRENCH;
			default:
				return START_DISTRICT_MENU_KINY;
		}
	}

	public static String getStartProvinceMenu(AlphaCode code) {
		switch (code) {
			case EN:
				return START_PROVINCE_MENU_ENG;
			case FR:
				return START_PROVINCE_MENU_FRENCH;
			default:
				return START_PROVINCE_MENU_KINY;
		}
	}

	public static String getStartSectorMenu(AlphaCode code) {
		switch (code) {
			case EN:
				return START_SECTOR_MENU_ENG;
			case FR:
				return START_SECTOR_MENU_FRENCH;
			default:
				return START_SECTOR_MENU_KINY;
		}
	}

	public static String getStartCellMenu(AlphaCode code) {
		switch (code) {
			case EN:
				return START_CELL_MENU_ENG;
			case FR:
				return START_CELL_MENU_FRENCH;
			default:
				return START_CELL_MENU_KINY;
		}
	}

	public static String getStartVillageMenu(AlphaCode code) {
		switch (code) {
			case EN:
				return START_VILLAGE_MENU_ENG;
			case FR:
				return START_VILLAGE_MENU_FRENCH;
			default:
				return START_VILLAGE_MENU_KINY;
		}
	}

	public static String getStartComlaintMenu(AlphaCode code) {
		switch (code) {
			case EN:
				return START_COMPLAINT_MENU_ENG;
			case FR:
				return START_COMPLAINT_MENU_FRENCH;
			default:
				return START_COMPLAINT_MENU_KINY;
		}
	}

	public static String getMyTicketMenu(AlphaCode code) {
		switch (code) {
			case EN:
				return MY_TICKETS_ENG;
			case FR:
				return MY_TICKETS_FRENCH;
			default:
				return MY_TICKETS_KINY;
		}
	}

	public static String getInvalidInputMessage(AlphaCode code) {
		switch (code) {
			case EN:
				return INVALID_INPUT_EN;
			case FR:
				return INVALID_INPUT_FR;
			default:
				return INVALID_INPUT_RW;
		}
	}

	public static String getBackMessage(AlphaCode code) {
		switch (code) {
			case EN:
				return BACK_EN;
			case FR:
				return BACK_FR;
			default:
				return BACK_RW;
		}
	}

	public static String getBackMainMessage(AlphaCode code) {
		switch (code) {
			case EN:
				return BACK_MAIN_EN;
			case FR:
				return BACK_MAIN_FR;
			default:
				return BACK_MAIN_RW;
		}
	}

	public static String getNoDataMessage(AlphaCode code) {
		switch (code) {
			case EN:
				return NO_DATA_EN;
			case FR:
				return NO_DATA_FR;
			default:
				return NO_DATA_RW;
		}
	}

	public static String getEndingErrorMessage(AlphaCode code) {
		switch (code) {
			case EN:
				return END_MENU_ERROR_ENG;
			case FR:
				return END_MENU_ERROR_FRENCH;
			default:
				return END_MENU_ERROR_KINY;
		}
	}

	public static String getTicketViewMessage(AlphaCode code) {
		StringBuilder sb = new StringBuilder();

		switch (code) {
			case EN:
				sb.append("Ticket Details\n\n");
				break;
			case FR:
				sb.append("Détails du ticket\n\n");
				break;
			default:
				sb.append("Ikibazo cyawe\n\n");
				break;
		}

		String response = sb.toString();

		return response;

	}

	public static String translateTicketID(AlphaCode code) {
		switch (code) {
			case EN:
				return "Ticket ID";
			case FR:
				return "ID du ticket";
			default:
				return "Nimero y'itike";
		}
	}

	public static String translateStatus(AlphaCode code) {
		switch (code) {
			case EN:
				return "Status";
			case FR:
				return "Statut";
			default:
				return "Imiterere";
		}
	}

	public static String translateTicket(AlphaCode code) {
		switch (code) {
			case EN:
				return "Ticket";
			case FR:
				return "Ticket";
			default:
				return "Itike";
		}
	}

	public static String translateClosed(AlphaCode code) {
		switch (code) {
			case EN:
				return "Closed";
			case FR:
				return "Fermé";
			default:
				return "Cyakemuwe";
		}
	}

	public static String translateOpen(AlphaCode code) {

		switch (code) {
			case EN:
				return "Open";
			case FR:
				return "Ouvrir";
			default:
				return "Iri gukorwa";
		}
	}

	public static String translatePending(AlphaCode code) {
		switch (code) {
			case EN:
				return "Pending";
			case FR:
				return "En attente";
			default:
				return "Iragegereje";
		}
	}

	public static String getStatus(int statusId, AlphaCode code) {
		switch (statusId) {
			case 2:
				return translateOpen(code);
			case 4:
				return translateClosed(code);
			default:
				return translatePending(code);
		}
	}

	public static String translateNotFound(AlphaCode code) {
		switch (code) {
			case EN:
				return "Not Found";
			case FR:
				return "Pas trouvé";
			default:
				return "Ntabwo ibonetse";
		}
	}

	public static String translateAlreadyHaveTicket(AlphaCode code) {
		switch (code) {
			case EN:
				return "Already have a ticket with details\n\n";
			case FR:
				return "Vous avez d\u00E9j\u00E0 un ticket avec les d\u00E9tails\n\n";
			default:
				return "Usanzwe ufite itike\n\n";
		}
	}

}
