// Quantitative Cyber Risk Engine — Monte Carlo Financial Loss Expectancy (FAIR Model)

export function runMonteCarloSimulation(iterations = 1000, baseExposure = 1850000) {
  const simulatedLosses = [];

  for (let i = 0; i < iterations; i++) {
    // Loss Event Frequency (LEF): Likelihood of breach execution (log-normal distribution)
    const lef = Math.random() * 0.45 + 0.15; // 15% to 60% annualized breach likelihood

    // Primary Loss: Direct incident response + forensic investigations
    const primaryLoss = baseExposure * (0.35 + Math.random() * 0.4);

    // Secondary Loss: Regulatory fines (GDPR/HIPAA/PCI) + class action litigation
    const secondaryLoss = Math.random() > 0.4 ? baseExposure * (0.6 + Math.random() * 0.8) : 0;

    // Total Simulated Loss for this sample run
    const totalSampleLoss = Math.round(lef * (primaryLoss + secondaryLoss));
    simulatedLosses.push(totalSampleLoss);
  }

  simulatedLosses.sort((a, b) => a - b);

  // Value-at-Risk (VaR) percentiles
  const p50 = simulatedLosses[Math.floor(iterations * 0.5)];
  const p90 = simulatedLosses[Math.floor(iterations * 0.9)];
  const p99 = simulatedLosses[Math.floor(iterations * 0.99)];
  const mean = Math.round(simulatedLosses.reduce((a, b) => a + b, 0) / iterations);

  return {
    iterations,
    meanLoss: mean,
    var90: p90,
    var99: p99,
    medianLoss: p50,
    formattedMean: `$${(mean / 1000000).toFixed(2)}M`,
    formattedVaR90: `$${(p90 / 1000000).toFixed(2)}M`,
    formattedVaR99: `$${(p99 / 1000000).toFixed(2)}M`,
    distributionSamples: simulatedLosses.filter((_, idx) => idx % 20 === 0)
  };
}
