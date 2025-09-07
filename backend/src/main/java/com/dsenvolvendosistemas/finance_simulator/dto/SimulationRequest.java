package com.dsenvolvendosistemas.finance_simulator.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class SimulationRequest {
    @NotNull(message = "Initial amount is required.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Initial amount must be a positive number.")
    private BigDecimal initialAmount;

    @NotNull(message = "Monthly contribution is required.")
    @DecimalMin(value = "0.0", inclusive = true, message = "Monthly contribution must be a positive number or zero.")
    private BigDecimal monthlyContribution;

    @NotNull(message = "Interest rate is required.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Interest rate must be a positive number.")
    private BigDecimal interestRate;

    @NotNull(message = "Interest rate type is required.")
    private String interestRateType;

    @NotNull(message = "Investment time is required.")
    @DecimalMin(value = "1.0", inclusive = true, message = "Investment time must be a positive number.")
    private int investmentTime;

    @NotNull(message = "Investment time unit is required.")
    private String investmentTimeUnit;

    // Getters and Setters
    public BigDecimal getInitialAmount() {
        return initialAmount;
    }

    public void setInitialAmount(BigDecimal initialAmount) {
        this.initialAmount = initialAmount;
    }

    

    public BigDecimal getMonthlyContribution() {
        return monthlyContribution;
    }

    public void setMonthlyContribution(BigDecimal monthlyContribution) {
        this.monthlyContribution = monthlyContribution;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public String getInterestRateType() {
        return interestRateType;
    }

    public void setInterestRateType(String interestRateType) {
        this.interestRateType = interestRateType;
    }

    public int getInvestmentTime() {
        return investmentTime;
    }

    public void setInvestmentTime(int investmentTime) {
        this.investmentTime = investmentTime;
    }

    public String getInvestmentTimeUnit() {
        return investmentTimeUnit;
    }

    public void setInvestmentTimeUnit(String investmentTimeUnit) {
        this.investmentTimeUnit = investmentTimeUnit;
    }
}
