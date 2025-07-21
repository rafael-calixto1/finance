package com.dsenvolvendosistemas.finance_simulator.service;

import com.dsenvolvendosistemas.finance_simulator.dto.TaxSimulationRequest;
import com.dsenvolvendosistemas.finance_simulator.dto.SimulationResult;
import com.dsenvolvendosistemas.finance_simulator.model.MonthlySimulationData;
import com.dsenvolvendosistemas.finance_simulator.util.FinancialCalculator;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class TaxIncomeSimulatorService {

    public SimulationResult simulate(TaxSimulationRequest request) {

        BigDecimal initialAmount = request.getInitialAmount() != null ? request.getInitialAmount() : BigDecimal.ZERO;
        BigDecimal monthlyContribution = request.getMonthlyContribution() != null ? request.getMonthlyContribution() : BigDecimal.ZERO;
        BigDecimal interestRate = request.getInterestRate();
        String interestRateType = request.getInterestRateType();
        int investmentTime = request.getInvestmentTime();
        String investmentTimeUnit = request.getInvestmentTimeUnit();

        int totalMonths = "anos".equalsIgnoreCase(investmentTimeUnit) ? investmentTime * 12 : investmentTime;
        BigDecimal monthlyInterestRate = FinancialCalculator.calculateMonthlyInterestRate(interestRate, interestRateType);

        BigDecimal currentBalance = initialAmount;
        BigDecimal totalInvested = initialAmount;
        BigDecimal totalInterestEarned = BigDecimal.ZERO;

        List<MonthlySimulationData> monthlyData = new ArrayList<>();

        for (int month = 1; month <= totalMonths; month++) {
            currentBalance = currentBalance.add(monthlyContribution);
            totalInvested = totalInvested.add(monthlyContribution);

            BigDecimal interestAccrued = currentBalance.multiply(monthlyInterestRate);
            currentBalance = currentBalance.add(interestAccrued);

            totalInterestEarned = totalInterestEarned.add(interestAccrued);

            monthlyData.add(new MonthlySimulationData(
                    month,
                    interestAccrued.setScale(2, RoundingMode.HALF_UP),
                    totalInvested.setScale(2, RoundingMode.HALF_UP),
                    totalInterestEarned.setScale(2, RoundingMode.HALF_UP),
                    currentBalance.setScale(2, RoundingMode.HALF_UP)
            ));
        }

        BigDecimal taxRate = getTaxRate(totalMonths);
        BigDecimal taxOnProfit = totalInterestEarned.multiply(taxRate);
        BigDecimal netProfit = totalInterestEarned.subtract(taxOnProfit);
        BigDecimal finalAmountAfterTax = totalInvested.add(netProfit);

        return new SimulationResult(
                finalAmountAfterTax.setScale(2, RoundingMode.HALF_UP),
                totalInvested.setScale(2, RoundingMode.HALF_UP),
                totalInterestEarned.setScale(2, RoundingMode.HALF_UP),
                monthlyData
        );
    }

    private BigDecimal getTaxRate(int totalMonths) {
        int days = totalMonths * 30; // Approximate days

        if (days <= 180) {
            return new BigDecimal("0.225");
        } else if (days <= 360) {
            return new BigDecimal("0.20");
        } else if (days <= 720) {
            return new BigDecimal("0.175");
        } else {
            return new BigDecimal("0.15");
        }
    }
}
