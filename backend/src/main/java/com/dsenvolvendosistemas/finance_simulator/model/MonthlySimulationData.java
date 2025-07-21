package com.dsenvolvendosistemas.finance_simulator.model;

import java.math.BigDecimal;

public class MonthlySimulationData {
    private int month;
    private BigDecimal interest;
    private BigDecimal cumulativeInvested;
    private BigDecimal cumulativeInterest;
    private BigDecimal totalAccumulated;

    public MonthlySimulationData(int month, BigDecimal interest, BigDecimal cumulativeInvested, BigDecimal cumulativeInterest, BigDecimal totalAccumulated) {
        this.month = month;
        this.interest = interest;
        this.cumulativeInvested = cumulativeInvested;
        this.cumulativeInterest = cumulativeInterest;
        this.totalAccumulated = totalAccumulated;
    }

    // Getters
    public int getMonth() {
        return month;
    }

    public BigDecimal getInterest() {
        return interest;
    }

    public BigDecimal getCumulativeInvested() {
        return cumulativeInvested;
    }

    public BigDecimal getCumulativeInterest() {
        return cumulativeInterest;
    }

    public BigDecimal getTotalAccumulated() {
        return totalAccumulated;
    }
}
