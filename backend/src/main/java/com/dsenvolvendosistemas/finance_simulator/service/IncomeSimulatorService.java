package com.dsenvolvendosistemas.finance_simulator.service;

import com.dsenvolvendosistemas.finance_simulator.dto.SimulationRequest;
import com.dsenvolvendosistemas.finance_simulator.dto.SimulationResult;
import com.dsenvolvendosistemas.finance_simulator.model.MonthlySimulationData;
import com.dsenvolvendosistemas.finance_simulator.util.FinancialCalculator;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class IncomeSimulatorService {

    public SimulationResult simulate(SimulationRequest request) {

        BigDecimal initialAmount = request.getInitialAmount();
        BigDecimal monthlyContribution = request.getMonthlyContribution() != null ? request.getMonthlyContribution() : BigDecimal.ZERO;
        BigDecimal interestRate = request.getInterestRate();
        String interestRateType = request.getInterestRateType();
        int investmentTime = request.getInvestmentTime();
        String investmentTimeUnit = request.getInvestmentTimeUnit();

        int totalMonths = "years".equalsIgnoreCase(investmentTimeUnit) ? investmentTime * 12 : investmentTime;
        BigDecimal monthlyInterestRate = FinancialCalculator.calculateMonthlyInterestRate(interestRate, interestRateType);

        BigDecimal currentBalance = initialAmount;
        BigDecimal totalInvested = initialAmount;
        BigDecimal totalInterestEarned = BigDecimal.ZERO;

        // Calculate initial interest and accumulated values for month zero
        BigDecimal interestAccruedForMonthZero = initialAmount.multiply(monthlyInterestRate);
        BigDecimal totalAccumulatedForMonthZero = initialAmount.add(interestAccruedForMonthZero);

        List<MonthlySimulationData> monthlyData = new ArrayList<>();

        // Add month zero data
        monthlyData.add(new MonthlySimulationData(
                0,
                interestAccruedForMonthZero.setScale(2, RoundingMode.HALF_UP),
                initialAmount.setScale(2, RoundingMode.HALF_UP),
                interestAccruedForMonthZero.setScale(2, RoundingMode.HALF_UP),
                totalAccumulatedForMonthZero.setScale(2, RoundingMode.HALF_UP)
        ));

        // Initialize for the loop with values after month zero
        currentBalance = totalAccumulatedForMonthZero;
        totalInvested = initialAmount;
        totalInterestEarned = interestAccruedForMonthZero;

        for (int month = 1; month <= totalMonths; month++) {
            // Add monthly contribution before calculating interest for the current month
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

        return new SimulationResult(
                currentBalance.setScale(2, RoundingMode.HALF_UP),
                totalInvested.setScale(2, RoundingMode.HALF_UP),
                totalInterestEarned.setScale(2, RoundingMode.HALF_UP),
                monthlyData
        );
    }
}