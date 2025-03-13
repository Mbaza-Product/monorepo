package com.digital.umuganda.mbazaussd.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.digital.umuganda.mbazaussd.entity.AlphaCode;
import com.digital.umuganda.mbazaussd.entity.Category;
import com.digital.umuganda.mbazaussd.entity.Language;
import com.digital.umuganda.mbazaussd.entity.Ticket;
import com.digital.umuganda.mbazaussd.entity.UssdFlag;
import com.digital.umuganda.mbazaussd.entity.ZammadDistrict;
import com.digital.umuganda.mbazaussd.entity.ZammadUser;
import com.digital.umuganda.mbazaussd.entity.address.Province;
import com.digital.umuganda.mbazaussd.helpers.USSD;
import com.digital.umuganda.mbazaussd.helpers.Zammad;
import com.digital.umuganda.mbazaussd.repository.CategoryRepository;
import com.digital.umuganda.mbazaussd.repository.ZammadDistrictRepository;
import com.digital.umuganda.mbazaussd.repository.LanguageRepository;
import com.digital.umuganda.mbazaussd.repository.ProvinceRepository;
import com.digital.umuganda.mbazaussd.repository.TicketRepository;
import com.digital.umuganda.mbazaussd.repository.ZammadUserRepository;
import com.digital.umuganda.mbazaussd.service.ZammadService;
import com.digital.umuganda.mbazaussd.utils.CommonHeadings;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/ussd")
@Tag(name = "USSD", description = "USSD API")
@RequiredArgsConstructor
@Slf4j
public class USSDController {

    @Value("${ussd-code:114}")
    private String ussdCode;

    private final LanguageRepository languageRepository;
    private final TicketRepository ticketRepository;
    private final ZammadUserRepository zammadUserRepository;
    private final ZammadDistrictRepository zammadDistrictRepository;
    private final ZammadService zammadService;
    private final CategoryRepository categoryRepository;
    private final ProvinceRepository provinceRepository;
    private String response = "";
    private String responseType = "FC";
    private AlphaCode languageCode = AlphaCode.RW;

    @GetMapping
    @Operation(summary = "USSD", description = "USSD")
    public ResponseEntity<String> ussd(@RequestParam(value = "msisdn") String msisdn,
            @RequestParam(value = "input") String input, @RequestParam(value = "newRequest") String isnewrequest) {

        Optional<ZammadUser> optionalZammadUser = zammadUserRepository.findByLogin(msisdn);

        if (optionalZammadUser.isPresent()) {
            ZammadUser zammadUser = optionalZammadUser.get();
            Language userLanguage = zammadUser.getLanguage();

            if (userLanguage != null) {
                languageCode = userLanguage.getCode();
            }

            int position = 100;

            try {
                position = Math.abs(Integer.parseInt(input));

                if (isnewrequest.equals("1") || input.equals(ussdCode)) {
                    zammadUser.setFlag(UssdFlag.USER_REGISTERED);
                }
            } catch (Exception e) {
                //
            }

            switch (zammadUser.getFlag()) {

                case CATEGORY_SELECTED:
                    handleCategorySelection(zammadUser, position);
                    break;
                case DISTRICT_SELECTED:
                    handleDistrictSelection(zammadUser, position);
                    break;
                case LANGUAGE_SELECTED:
                    handleLanguageSelection(zammadUser, position);
                    break;
                case TICKET_SELECTED:
                    handleTicketSelection(zammadUser, position);
                    break;
                case USER_REGISTERED:
                    handleUserRegistration(zammadUser);
                    break;
                case PROVINCE_SELECTED:
                    handleProvinceSelection(zammadUser, position);
                    break;
                default:
                    handleDefaultFlow(zammadUser);
                    break;
            }
            zammadUserRepository.save(zammadUser);

        } else {
            List<Language> languages = languageRepository.findAll();

            ZammadUser zammadUser = new ZammadUser();
            zammadUser.setLogin(msisdn);
            zammadUser.setFlag(UssdFlag.LANGUAGE_SELECTED);
            response = USSD.getLanguageSelection(languages, AlphaCode.RW);
            zammadUserRepository.save(zammadUser);
        }

        HttpHeaders headers = USSD.freeFlowHeaders(responseType);

        return ResponseEntity.ok().headers(headers).body(response);
    }

    private void handleDefaultFlow(ZammadUser zammadUser) {
        zammadUser.setFlag(UssdFlag.LANGUAGE_SELECTED);
        response = USSD.getLanguageSelection(languageRepository.findAll(), languageCode);
    }

    private void handleUserRegistration(ZammadUser zammadUser) {
        List<Language> languageList = languageRepository.findAll();
        zammadUser.setFlag(UssdFlag.LANGUAGE_SELECTED);
        response = USSD.getLanguageSelection(languageList, languageCode);
    }

    public void handleTicketSelection(ZammadUser zammadUser, int position) {
        List<Ticket> ticketList = zammadUser.getOpenTickets();
        if (position == 0) {
            zammadUser.setFlag(UssdFlag.CATEGORY_SELECTED);
            response = USSD.getCategorySelection(
                    categoryRepository.findByParentIdAndLanguageId(null,
                            zammadUser.getLanguage().getId()),
                    languageCode, zammadUser);
        } else if (position > 0 && position <= ticketList.size()) {
            Ticket ticket = ticketList.get(position - 1);

            Ticket viewTicket = zammadService.viewTicket(ticket);

            response = USSD.viewTicketSelection(viewTicket, languageCode);
            if (viewTicket != null) {
                ticket.setState_id(viewTicket.getState_id());
                ticketRepository.save(ticket);
            }
            zammadUser.setFlag(UssdFlag.USER_REGISTERED);
            zammadUser.setCurrentStep(null);
            responseType = "FB";
        } else if (position == 99) {
            zammadUser.setCurrentStep(null);
            zammadUser.setFlag(UssdFlag.LANGUAGE_SELECTED);
            response = USSD.getLanguageSelection(languageRepository.findAll(),
                    languageCode);
        } else {
            zammadUser.setFlag(UssdFlag.TICKET_SELECTED);
            response = USSD.getTicketSelection(ticketList, languageCode);
        }
    }

    private void handleLanguageSelection(ZammadUser zammadUser, int position) {
        List<Language> languages = languageRepository.findAll();
        if (position > 0 && position <= languages.size()) {
            Language language = languages.get(position - 1);
            zammadUser.setLanguage(language);
            languageCode = language.getCode();
            List<Category> responseCategories = categoryRepository.findByParentIdAndLanguageId(null,
                    language.getId());
            response = USSD.getCategorySelection(responseCategories, language.getCode(), zammadUser);
            if (responseCategories.size() > 0) {
                zammadUser.setFlag(UssdFlag.CATEGORY_SELECTED);
                zammadUser.setCurrentStep(null);
            } else {
                zammadUser.setFlag(UssdFlag.LANGUAGE_SELECTED);
                response = USSD.getLanguageSelection(languages, languageCode);
            }
        } else {
            zammadUser.setFlag(UssdFlag.LANGUAGE_SELECTED);
            response = USSD.getLanguageSelection(languages, languageCode);
        }
    }

    private void handleProvinceSelection(ZammadUser zammadUser, int position) {
        List<Province> provinceList = provinceRepository.findAll();
        Category category = zammadUser.getCategory();
        if (position <= 0) {
            zammadUser.setFlag(UssdFlag.CATEGORY_SELECTED);
            Long parentId = null;
            if (category != null && category.getParent() != null) {
                parentId = category.getParent().getId();
            }
            response = USSD.getCategorySelection(
                    categoryRepository.findByParentIdAndLanguageId(parentId,
                            zammadUser.getLanguage().getId()),
                    languageCode, zammadUser);
        } else if (position <= provinceList.size()) {
            Province currentProvince = provinceList.get(position - 1);
            zammadUser.setProvince(currentProvince);
            zammadUser.setFlag(UssdFlag.DISTRICT_SELECTED);

            response = USSD.getZammadDistrictSelection(
                    zammadDistrictRepository.findByProvinceId(currentProvince.getId()),
                    languageCode);

        }

        if (response.length() <= 0) {
            response = USSD.getProvinceSelection(provinceList, languageCode);
        }
    }

    private void handleDistrictSelection(ZammadUser zammadUser, int position) {
        List<ZammadDistrict> districtList = zammadDistrictRepository.findByProvinceId(zammadUser.getProvince().getId());
        Category category = zammadUser.getCategory();
        if (position == 0) {
            zammadUser.setFlag(UssdFlag.PROVINCE_SELECTED);
            response = USSD.getProvinceSelection(provinceRepository.findAll(),
                    languageCode);
        } else if (position <= districtList.size()) {
            ZammadDistrict currentDistrict = districtList.get(position - 1);
            zammadUser.setDistrict(currentDistrict);

            String address = Zammad.formatAddress(currentDistrict,
                    languageCode);

            if (zammadUser.getCustomer_id() == null) {
                ZammadUser createdZammadUser = zammadService.createUser(zammadUser, address);
                if (createdZammadUser != null) {
                    zammadUser.setCustomer_id(createdZammadUser.getCustomer_id());
                    zammadUser.setPassword(createdZammadUser.getPassword());
                } else {
                    response = USSD.getEndingErrorSelection(languageCode);
                    return;
                }
            }

            Ticket ticket = new Ticket();
            ticket.setUser(zammadUser);
            ticket.setAddress(address);
            ticket.setPhone(zammadUser.getLogin());
            ticket.setCategory(category.getGroup());

            ticket.setComplaint(category.getName());

            Ticket newTicket = zammadService.sendTicket(zammadUser, ticket);

            if (newTicket != null) {
                response = CommonHeadings.getEndingTicketMessage(languageCode);
                responseType = "FB";
                zammadUser.setFlag(UssdFlag.USER_REGISTERED);
                zammadUser.setCurrentStep(null);
                ticket.setCustomer_id(newTicket.getCustomer_id());
                ticket.setState_id(newTicket.getState_id());
                ticket.setZammad_ticket_id(newTicket.getZammad_ticket_id());
                ticketRepository.save(ticket);
            } else {
                response = USSD.getEndingErrorSelection(languageCode);
            }

        }

        if (response.length() <= 0) {
            response = USSD.getZammadDistrictSelection(districtList, languageCode);
        }
    }

    private void handleCategorySelection(ZammadUser zammadUser, int position) {
        Long categoryStepId = zammadUser.getCurrentStep();
        Long categoryLanguageId = zammadUser.getLanguage().getId();
        List<Category> categoryList = categoryRepository.findByParentIdAndLanguageId(
                categoryStepId,
                categoryLanguageId);

        if (position > 0 && position <= categoryList.size()) {
            Category currentCategory = categoryList.get(position - 1);
            zammadUser.setFlag(UssdFlag.CATEGORY_SELECTED);
            categoryList = currentCategory.getChildren();
            zammadUser.setCurrentStep(currentCategory.getId());
            zammadUser.setCurrentStepName(currentCategory.getName());
        }

        if (position > 0 && categoryList.isEmpty() && zammadUser.getCurrentStep() != null) {
            response = CommonHeadings.getEndingInfoMessage(languageCode);
            Optional<Category> optionalCurrentCategory = categoryRepository
                    .findById(zammadUser.getCurrentStep());
            if (optionalCurrentCategory.isPresent()) {
                Category complaint = optionalCurrentCategory.get();

                if (complaint.getIsTicket()) {
                    Ticket existingTicket = null;

                    for (Ticket existTicket : zammadUser.getOpenTickets()) {
                        if (existTicket.getComplaint().equals(complaint.getName())) {
                            existingTicket = existTicket;
                            break;
                        }
                    }

                    if (existingTicket != null) {
                        Ticket viewTicket = zammadService.viewTicket(existingTicket);
                        if (viewTicket != null) {
                            response = USSD.viewExistTicketStatusSelection(viewTicket, languageCode);
                            zammadUser.setFlag(UssdFlag.USER_REGISTERED);
                            zammadUser.setCurrentStep(null);
                            responseType = "FB";
                            existingTicket.setState_id(viewTicket.getState_id());
                            ticketRepository.save(existingTicket);
                            return;
                        }
                    }
                    zammadUser.setFlag(UssdFlag.PROVINCE_SELECTED);
                    zammadUser.setCategory(complaint);
                    response = USSD.getProvinceSelection(provinceRepository.findAll(),
                            languageCode);
                } else {
                    responseType = "FB";
                    zammadUser.setFlag(UssdFlag.USER_REGISTERED);
                    zammadUser.setCurrentStep(null);
                }

            }

        } else if (position == 99) {
            zammadUser.setCurrentStep(null);
            zammadUser.setFlag(UssdFlag.LANGUAGE_SELECTED);
            response = USSD.getLanguageSelection(languageRepository.findAll(),
                    languageCode);
        } else if (position == 0 && categoryStepId != null) {
            Optional<Category> optionalCategory = categoryRepository.findById(categoryStepId);
            if (optionalCategory.isPresent()) {
                Category parentCategory = optionalCategory.get().getParent();
                if (parentCategory != null) {
                    categoryList = categoryRepository.findByParentIdAndLanguageId(
                            parentCategory.getId(),
                            categoryLanguageId);
                    zammadUser.setCurrentStep(parentCategory.getId());
                } else {
                    categoryList = categoryRepository.findByParentIdAndLanguageId(
                            null,
                            categoryLanguageId);
                    zammadUser.setCurrentStep(null);
                }

            }
            response = USSD.getCategorySelection(categoryList,
                    languageCode, zammadUser);
        } else if (position == 0) {
            zammadUser.setFlag(UssdFlag.LANGUAGE_SELECTED);
            response = USSD.getLanguageSelection(languageRepository.findAll(),
                    languageCode);
        } else {
            response = USSD.getCategorySelection(categoryList,
                    languageCode, zammadUser);
        }

        if (categoryStepId == null && (position == categoryList.size() + 1) && zammadUser.getOpenTickets().size() > 0) {
            zammadUser.setFlag(UssdFlag.TICKET_SELECTED);
            response = USSD.getTicketSelection(zammadUser.getOpenTickets(),
                    languageCode);
        }
    }
}
