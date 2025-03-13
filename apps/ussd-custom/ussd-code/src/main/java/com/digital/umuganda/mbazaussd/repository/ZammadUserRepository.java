package com.digital.umuganda.mbazaussd.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.digital.umuganda.mbazaussd.entity.ZammadUser;

public interface ZammadUserRepository extends JpaRepository<ZammadUser, Long> {
    Optional<ZammadUser> findByLogin(String login);
}
