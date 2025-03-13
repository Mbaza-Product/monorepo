package com.digital.umuganda.mbazaussd.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.digital.umuganda.mbazaussd.entity.address.Province;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Entity
@Table(name = "zammad_districts")
@Data
public class ZammadDistrict {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "province_id")
    @JsonIgnore
    private Province province;

    @Column(name = "zammad_url")
    private String zammadUrl;

    @Column(name = "zammad_login")
    private String zammadLogin;

    @Column(name = "zammad_password")
    private String zammadPassword;
}
