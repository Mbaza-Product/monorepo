package com.digital.umuganda.mbazaussd.controller;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.digital.umuganda.mbazaussd.entity.Ticket;
import com.digital.umuganda.mbazaussd.exception.NotFoundException;
import com.digital.umuganda.mbazaussd.repository.TicketRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tickets")
@Tag(name = "Tickets", description = "Tickets API")
@SecurityRequirement(name = "bearerAuth")
public class TicketController {
    private final TicketRepository ticketRepository;

    public TicketController(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @GetMapping
    @Operation(summary = "Get all tickets", description = "Get all tickets")
    public List<Ticket> getTickets() {
        return ticketRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get ticket by id", description = "Get ticket by id")
    public Ticket getTicket(@PathVariable Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete ticket by id", description = "Delete ticket by id")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));
        ticketRepository.delete(ticket);
        return ResponseEntity.noContent().build();
    }
}
