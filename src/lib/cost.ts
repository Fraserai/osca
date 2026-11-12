export type CostScenarioInput = {
  annualSalaryUsd: number;
  monthlyExecutions: number;
  avgInputTokens: number;
  avgOutputTokens: number;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  orchestrationFeePerExecution?: number;
};

export type CostScenario = {
  monthlySalaryCost: number;
  monthlyAgentCost: number;
  monthlySavings: number;
  annualSalaryCost: number;
  annualAgentCost: number;
  annualSavings: number;
};

export function calculateCostScenario(input: CostScenarioInput): CostScenario {
  const monthlySalaryCost = input.annualSalaryUsd / 12;
  const inputCost = (input.monthlyExecutions * input.avgInputTokens * input.inputPricePerMillion) / 1_000_000;
  const outputCost = (input.monthlyExecutions * input.avgOutputTokens * input.outputPricePerMillion) / 1_000_000;
  const orchestration = input.monthlyExecutions * (input.orchestrationFeePerExecution ?? 0.008);
  const monthlyAgentCost = inputCost + outputCost + orchestration;

  return {
    monthlySalaryCost,
    monthlyAgentCost,
    monthlySavings: monthlySalaryCost - monthlyAgentCost,
    annualSalaryCost: monthlySalaryCost * 12,
    annualAgentCost: monthlyAgentCost * 12,
    annualSavings: (monthlySalaryCost - monthlyAgentCost) * 12
  };
}

export function formatCurrency(value: number, maxFractionDigits = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: maxFractionDigits
  }).format(value);
}
