package com.dsenvolvendosistemas.finance_simulator.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class SimulationRequest {
    @NotNull(message = "Valor Inicial é obrigatório.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Valor Inicial deve ser um número positivo.")
    private BigDecimal initialAmount;

    

    @NotNull(message = "Valor de Aporte Mensal é obrigatório.")
    @DecimalMin(value = "0.0", inclusive = true, message = "Valor de Aporte Mensal deve ser um número positivo ou zero.")
    private BigDecimal monthlyContribution;

    @NotNull(message = "Taxa de Juros é obrigatória.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Taxa de Juros deve ser um número positivo.")
    private BigDecimal interestRate;

    @NotNull(message = "Tipo de Taxa de Juros é obrigatório.")
    private String interestRateType;

    @NotNull(message = "Tempo de Investimento é obrigatório.")
    @DecimalMin(value = "1.0", inclusive = true, message = "Tempo de Investimento deve ser um número positivo.")
    private int investmentTime;

    @NotNull(message = "Unidade de Tempo de Investimento é obrigatória.")
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
