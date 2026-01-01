import { Patient } from '../types';

export const calculateClinicalMetrics = (patient: Patient) => {
  if (!patient.mocaTests || patient.mocaTests.length === 0) {
    return {
      currentCDR: 0.0,
      futureCDR: 0.0,
      confidence: 1.0,
      confidenceLabel: "High",
      confidenceColor: "#107C10",
      declineRate: 0,
      statusLabel: 'Stable',
      statusColor: '#107C10',
      statusBg: 'bg-[#DFF6DD]'
    };
  }

  // Sort tests by date
  const sortedTests = [...patient.mocaTests].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestTest = sortedTests[sortedTests.length - 1];
  const score = latestTest.totalScore;

  let decline = 0;
  if (sortedTests.length >= 2) {
    const prev = sortedTests[sortedTests.length - 2].totalScore;
    decline = prev - score;
  }

  // MoCA to CDR mapping logic (Production Mimic)
  let currentCDR = 0.0;
  if (score < 15) currentCDR = 2.0;
  else if (score < 20) currentCDR = 1.0;
  else if (score < 26) currentCDR = 0.5;

  // Future projection based on longitudinal decline
  let futureCDR = currentCDR;
  if (decline > 2 || score < 20) {
    futureCDR = Math.min(3.0, currentCDR + 0.5);
  }

  // Status and Confidence determination
  let statusLabel = 'Stable';
  let statusColor = '#107C10';
  let statusBg = 'bg-[#DFF6DD]';

  if (currentCDR >= 1.0) {
    statusLabel = 'Critical Alert';
    statusColor = '#A4262C';
    statusBg = 'bg-[#FDE7E9]';
  } else if (currentCDR > 0 || futureCDR > currentCDR) {
    statusLabel = 'Monitor';
    statusColor = '#D83B01';
    statusBg = 'bg-[#FFF4CE]';
  }

  let confidenceLabel = "High";
  let confidenceColor = "#107C10";
  
  // Vary confidence based on score range and consistency for demo realism
  let simulatedConfidence = 0.88;
  if (score < 15 || score > 28) simulatedConfidence = 0.92; // Clear cases
  else if (score < 22) simulatedConfidence = 0.74; // Edge cases
  else simulatedConfidence = 0.82;

  if (simulatedConfidence < 0.75) {
    confidenceLabel = "Moderate";
    confidenceColor = "#D83B01";
  } else if (simulatedConfidence < 0.85) {
    confidenceLabel = "High";
    confidenceColor = "#107C10";
  } else {
    confidenceLabel = "Very High";
    confidenceColor = "#107C10";
  }

  return {
    currentCDR,
    futureCDR,
    confidence: simulatedConfidence,
    confidenceLabel,
    confidenceColor,
    declineRate: decline,
    statusLabel,
    statusColor,
    statusBg
  };
};

