package com.digital.umuganda.mbazaussd.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "languages")
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "code", unique = true, nullable = false)
    private AlphaCode code;

    @OneToMany(mappedBy = "language", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Category> categories = new ArrayList<>();

    @OneToMany(mappedBy = "language", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ZammadUser> users = new ArrayList<>();

    @OneToMany(mappedBy = "language", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JsonIgnore
    private List<ZammadUser> zammadUsers = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AlphaCode getCode() {
        return code;
    }

    public void setCode(AlphaCode code) {
        this.code = code;
    }

}
