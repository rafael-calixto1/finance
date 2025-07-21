package com.dsenvolvendosistemas.finance_simulator.controller;

import com.dsenvolvendosistemas.finance_simulator.dto.SimulationRequest;
import com.dsenvolvendosistemas.finance_simulator.dto.SimulationResult;
import com.dsenvolvendosistemas.finance_simulator.service.IncomeSimulatorService;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/simulation")
@CrossOrigin(origins = "http://localhost:3000")
public class IncomeSimulatorController {

    @Autowired
    private IncomeSimulatorService incomeSimulatorService;

    @PostMapping
    public ResponseEntity<?> simulateIncome(@Valid @RequestBody SimulationRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        SimulationResult result = incomeSimulatorService.simulate(request);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
