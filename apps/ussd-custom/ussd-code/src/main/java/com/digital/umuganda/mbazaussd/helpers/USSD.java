package com.digital.umuganda.mbazaussd.helpers;

import java.util.List;

import org.springframework.http.HttpHeaders;

import com.digital.umuganda.mbazaussd.entity.AlphaCode;
import com.digital.umuganda.mbazaussd.entity.Category;
import com.digital.umuganda.mbazaussd.entity.Language;
import com.digital.umuganda.mbazaussd.entity.Ticket;
import com.digital.umuganda.mbazaussd.entity.ZammadDistrict;
import com.digital.umuganda.mbazaussd.entity.ZammadUser;
import com.digital.umuganda.mbazaussd.entity.address.Cell;
import com.digital.umuganda.mbazaussd.entity.address.District;
import com.digital.umuganda.mbazaussd.entity.address.Province;
import com.digital.umuganda.mbazaussd.entity.address.Sector;
import com.digital.umuganda.mbazaussd.entity.address.Village;
import com.digital.umuganda.mbazaussd.utils.CommonHeadings;

public class USSD {
    public static HttpHeaders freeFlowHeaders(String type) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Freeflow", type);
        headers.add("Cache-Control", "max-age=0");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "-1");
        headers.add("Expires", "-1");
        headers.add("Content-Type", "text/plain;charset=UTF-8");
        return headers;
    }

    public static String getLanguageSelection(List<Language> languageList, AlphaCode code) {
        StringBuilder sb = new StringBuilder();
        sb.append(CommonHeadings.getWelcomeMessage(code));

        for (int i = 0; i < languageList.size(); i++) {
            sb.append((i + 1) + ". " + languageList.get(i).getName() + "\n");
        }

        String response = sb.toString();

        return response;
    }

    public static String getProvinceSelection(List<Province> privinceList, AlphaCode code) {
        StringBuilder sb = new StringBuilder();
        sb.append(CommonHeadings.getStartProvinceMenu(code));

        for (int i = 0; i < privinceList.size(); i++) {
            switch (code) {
                case EN:
                    sb.append((i + 1) + ". " + privinceList.get(i).getNameEn() + "\n");
                    break;
                case FR:
                    sb.append(
                            (i + 1) + ". " + privinceList.get(i).getNameFr() + "\n");
                    break;
                default:
                    sb.append((i + 1) + ". " + privinceList.get(i).getNameRw() + "\n");
                    break;
            }
        }

        sb.append("0. " + CommonHeadings.getBackMessage(code) + "\n");

        String response = sb.toString();

        return response;
    }

    public static String getDistrictSelection(List<District> districtList, AlphaCode code) {
        StringBuilder sb = new StringBuilder();
        sb.append(CommonHeadings.getStartDistrictMenu(code));

        for (int i = 0; i < districtList.size(); i++) {
            sb.append((i + 1) + ". " + districtList.get(i).getName() + "\n");
        }

        sb.append("0. " + CommonHeadings.getBackMessage(code) + "\n");
        sb.append("99. " + CommonHeadings.getBackMainMessage(code) + "\n");

        String response = sb.toString();

        return response;

    }

    public static String getZammadDistrictSelection(List<ZammadDistrict> districtList, AlphaCode code) {
        StringBuilder sb = new StringBuilder();
        sb.append(CommonHeadings.getStartDistrictMenu(code));

        for (int i = 0; i < districtList.size(); i++) {
            sb.append((i + 1) + ". " + districtList.get(i).getName() + "\n");
        }

        sb.append("0. " + CommonHeadings.getBackMessage(code) + "\n");
        // sb.append("99. " + CommonHeadings.getBackMainMessage(code) + "\n");

        String response = sb.toString();

        return response;

    }

    public static String getSectorSelection(List<Sector> sectorList, AlphaCode code) {
        StringBuilder sb = new StringBuilder();
        sb.append(CommonHeadings.getStartSectorMenu(code));

        for (int i = 0; i < sectorList.size(); i++) {
            sb.append((i + 1) + ". " + sectorList.get(i).getName() + "\n");
        }

        String response = sb.toString();

        return response;

    }

    public static String getCellSelection(List<Cell> cellList, AlphaCode code) {
        StringBuilder sb = new StringBuilder();
        sb.append(CommonHeadings.getStartCellMenu(code));

        for (int i = 0; i < cellList.size(); i++) {
            sb.append((i + 1) + ". " + cellList.get(i).getName() + "\n");
        }

        String response = sb.toString();

        return response;

    }

    public static String getVillageSelection(List<Village> villageList, AlphaCode code) {
        StringBuilder sb = new StringBuilder();
        sb.append(CommonHeadings.getStartVillageMenu(code));

        for (int i = 0; i < villageList.size(); i++) {
            sb.append((i + 1) + ". " + villageList.get(i).getName() + "\n");
        }

        String response = sb.toString();

        return response;

    }

    public static String getTicketSelection(List<Ticket> ticketList, AlphaCode code) {
        StringBuilder sb = new StringBuilder();
        sb.append("Select the ticket to view status:\n\n");

        for (int i = 0; i < ticketList.size(); i++) {
            sb.append((i + 1) + ". " + ticketList.get(i).getComplaint() + "\n");
        }

        sb.append("0. " + CommonHeadings.getBackMessage(code) + "\n");
        sb.append("99. " + CommonHeadings.getBackMainMessage(code) + "\n");

        String response = sb.toString();

        return response;

    }

    public static String getCategorySelection(List<Category> categoryList, AlphaCode code, ZammadUser zammadUser) {
        StringBuilder sb = new StringBuilder();
        sb.append(CommonHeadings.getStartCategoryMenu(code));

        for (int i = 0; i < categoryList.size(); i++) {
            sb.append((i + 1) + ". " + categoryList.get(i).getName() + "\n");
        }

        if (categoryList.size() < 1) {
            sb.append(CommonHeadings.getNoDataMessage(code) + "\n");
        } else if (categoryList.get(0).getParent() == null && zammadUser.getOpenTickets().size() > 0) {
            sb.append(categoryList.size() + 1 + ". " + CommonHeadings.getMyTicketMenu(code) + "\n");
        }

        sb.append("0. " + CommonHeadings.getBackMessage(code) + "\n");
        sb.append("99. " + CommonHeadings.getBackMainMessage(code) + "\n");

        String response = sb.toString();

        return response;

    }

    public static String getInvalidInputSelection(AlphaCode code) {
        StringBuilder sb = new StringBuilder();
        sb.append(CommonHeadings.getInvalidInputMessage(code));

        sb.append("0. " + CommonHeadings.getBackMessage(code) + "\n");

        String response = sb.toString();

        return response;

    }

    public static String getEndingErrorSelection(AlphaCode code) {
        StringBuilder sb = new StringBuilder();
        sb.append(CommonHeadings.getEndingErrorMessage(code) + "\n\n");

        sb.append("0. " + CommonHeadings.getBackMessage(code) + "\n");

        String response = sb.toString();

        return response;

    }

    public static String viewTicketSelection(Ticket ticket, AlphaCode code) {
        StringBuilder sb = new StringBuilder();

        if (ticket == null) {
            sb.append(CommonHeadings.getNoDataMessage(code) + "\n");
        } else {
            sb.append(CommonHeadings.getTicketViewMessage(code));

            sb.append(CommonHeadings.translateTicketID(code) + ": " + ticket.getZammad_ticket_id() + "\n");
            sb.append(CommonHeadings.translateTicket(code) + ": " + ticket.getComplaint() + "\n");
            sb.append(CommonHeadings.translateStatus(code) + ": " + CommonHeadings.getStatus(ticket.getState_id(), code)
                    + "\n");
        }

        sb.append("\n" + CommonHeadings.getEndingInfoMessage(code));

        String response = sb.toString();

        return response;

    }

    public static String viewExistTicketStatusSelection(Ticket ticket, AlphaCode code) {
        StringBuilder sb = new StringBuilder();

        sb.append(CommonHeadings.translateAlreadyHaveTicket(code));

        sb.append(CommonHeadings.translateTicketID(code) + ": " + ticket.getZammad_ticket_id() + "\n");
        sb.append(CommonHeadings.translateTicket(code) + ": " + ticket.getComplaint() + "\n");
        sb.append(CommonHeadings.translateStatus(code) + ": " + CommonHeadings.getStatus(ticket.getState_id(), code)
                + "\n");
        sb.append("\n" + CommonHeadings.getEndingInfoMessage(code));

        String response = sb.toString();

        return response;

    }

}
