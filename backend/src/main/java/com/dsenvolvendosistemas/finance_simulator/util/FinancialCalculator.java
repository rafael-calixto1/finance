package com.dsenvolvendosistemas.finance_simulator.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class FinancialCalculator {

    public static BigDecimal calculateMonthlyInterestRate(BigDecimal annualRate, String rateType) {
        if ("anual".equalsIgnoreCase(rateType)) {
            // Convert annual rate to monthly rate: (1 + annual_rate)^(1/12) - 1
            // Convert annual rate to monthly rate: (1 + annual_rate_decimal)^(1/12) - 1
            BigDecimal annualRateDecimal = annualRate.divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP);
            double monthlyRateDecimal = Math.pow(annualRateDecimal.add(BigDecimal.ONE).doubleValue(), 1.0/12.0) - 1;
            return BigDecimal.valueOf(monthlyRateDecimal).setScale(10, RoundingMode.HALF_UP);
        } else if ("mensal".equalsIgnoreCase(rateType)) {
            return annualRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP); // Already monthly, convert to decimal
        } else {
            throw new IllegalArgumentException("Tipo de taxa de juros inválido: " + rateType);
        }
    }
}
