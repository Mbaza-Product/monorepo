package com.digital.umuganda.mbazaussd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.digital.umuganda.mbazaussd.entity.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUserIdAndComplaint(Long userId, String complaint);
}
