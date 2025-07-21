package com.dsenvolvendosistemas.finance_simulator.controller;

import com.dsenvolvendosistemas.finance_simulator.dto.TaxSimulationRequest;
import com.dsenvolvendosistemas.finance_simulator.dto.SimulationResult;
import com.dsenvolvendosistemas.finance_simulator.service.TaxIncomeSimulatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/simulation/tax")
@CrossOrigin(origins = "http://localhost:3000")
public class TaxIncomeSimulatorController {

    @Autowired
    private TaxIncomeSimulatorService taxIncomeSimulatorService;

    @PostMapping
    public ResponseEntity<SimulationResult> simulateIncomeWithTax(@RequestBody TaxSimulationRequest request) {
        SimulationResult result = taxIncomeSimulatorService.simulate(request);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
