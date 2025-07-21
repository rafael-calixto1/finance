package com.dsenvolvendosistemas.finance_simulator.dto;

import java.math.BigDecimal;

public class TaxSimulationRequest {
    private BigDecimal initialAmount;
    private BigDecimal monthlyContribution;
    private BigDecimal interestRate;
    private String interestRateType;
    private int investmentTime;
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
