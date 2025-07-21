package com.dsenvolvendosistemas.finance_simulator.dto;

import com.dsenvolvendosistemas.finance_simulator.model.MonthlySimulationData;

import java.math.BigDecimal;
import java.util.List;

public class SimulationResult {
    private BigDecimal finalTotalAmount;
    private BigDecimal totalInvestedAmount;
    private BigDecimal totalInterestEarned;
    private List<MonthlySimulationData> monthlyData;

    public SimulationResult(BigDecimal finalTotalAmount, BigDecimal totalInvestedAmount, BigDecimal totalInterestEarned, List<MonthlySimulationData> monthlyData) {
        this.finalTotalAmount = finalTotalAmount;
        this.totalInvestedAmount = totalInvestedAmount;
        this.totalInterestEarned = totalInterestEarned;
        this.monthlyData = monthlyData;
    }

    // Getters
    public BigDecimal getFinalTotalAmount() {
        return finalTotalAmount;
    }

    public BigDecimal getTotalInvestedAmount() {
        return totalInvestedAmount;
    }

    public BigDecimal getTotalInterestEarned() {
        return totalInterestEarned;
    }

    public List<MonthlySimulationData> getMonthlyData() {
        return monthlyData;
    }
}
