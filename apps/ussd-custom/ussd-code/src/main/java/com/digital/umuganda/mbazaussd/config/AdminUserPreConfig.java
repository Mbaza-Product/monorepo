package com.digital.umuganda.mbazaussd.config;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.digital.umuganda.mbazaussd.entity.Role;
import com.digital.umuganda.mbazaussd.entity.User;
import com.digital.umuganda.mbazaussd.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminUserPreConfig implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email:admin@mbaza.com}")
    private String adminEmail;

    @Value("${admin.password:Admin123}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        Optional<User> optionalUser = userRepository.findByEmail(adminEmail);
        if (optionalUser.isPresent()) {
            userRepository.delete(optionalUser.get());
        }

        User adminUser = new User();
        adminUser.setEmail(adminEmail);
        adminUser.setPassword(passwordEncoder.encode(adminPassword));
        adminUser.getRoles().add(Role.ADMIN);

        userRepository.save(adminUser);
        log.info("Admin user pre-configured.");
    }
}
