package com.digital.umuganda.mbazaussd.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import com.digital.umuganda.mbazaussd.entity.address.Province;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Data;

@Entity
@Table(name = "zammad_users")
@Data
public class ZammadUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(nullable = true)
    private String password;

    // Many-to-one relationship with district
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id")
    private ZammadDistrict district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "province_id")
    private Province province;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "language_id")
    private Language language;

    @Column(name = "current_step")
    private Long currentStep;

    @Column(name = "current_step_name")
    private String currentStepName;

    @Column(name = "currentPosition")
    private int currentPosition;

    @Enumerated(EnumType.STRING)
    @Column(name = "flag")
    private UssdFlag flag;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_flag")
    private UssdFlag previousFlag;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Ticket> tickets = new ArrayList<>();

    private Long customer_id;

    public ZammadUser() {
    }

    public ZammadUser(String login, String password) {
        this.login = login;
        this.password = password;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public List<Ticket> getOpenTickets() {
        List<Ticket> openTickets = new ArrayList<>();
        for (Ticket ticket : tickets) {
            if (ticket.getState_id() != 4 && ticket.getZammad_ticket_id() != null) {
                openTickets.add(ticket);
            }
        }
        return openTickets;
    }

}
