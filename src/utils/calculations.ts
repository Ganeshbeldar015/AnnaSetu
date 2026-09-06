export interface MSPCalculationInput {
  baseMspRate: number; // e.g. 2320
  quantityQuintals: number; // e.g. 52.5
  moisturePercent: number; // e.g. 13.8 or 15.2
  foreignMatterPercent: number; // e.g. 0.8
  standardMoisture: number; // e.g. 14.0
  grade: 'Grade A (MSP Premium)' | 'FAQ (Standard MSP)' | 'Below FAQ';
}

export interface MSPCalculationResult {
  baseMspRate: number;
  actualQuantityQuintals: number;
  moisturePercent: number;
  isMoistureCompliant: boolean;
  moistureDeductionPerQtl: number;
  gradePremiumDiscountPerQtl: number;
  netRatePerQuintal: number;
  grossPayableAmount: number;
  totalDeductions: number;
  netPayableAmount: number;
  breakdownSummary: string;
}

export function calculateMSPProcurement(input: MSPCalculationInput): MSPCalculationResult {
  const { baseMspRate, quantityQuintals, moisturePercent, standardMoisture, grade } = input;

  let moistureDeduction = 0;
  if (moisturePercent > standardMoisture) {
    // Standard Mandi Rule: ₹23.20 per quintal per 1% excess moisture
    const excess = moisturePercent - standardMoisture;
    moistureDeduction = Math.round(excess * (baseMspRate * 0.01) * 100) / 100;
  }

  let gradeAdjustment = 0;
  if (grade === 'Grade A (MSP Premium)') {
    gradeAdjustment = 0; // standard full premium rate
  } else if (grade === 'Below FAQ') {
    gradeAdjustment = -50; // ₹50 deduction for substandard clean
  }

  const netRate = Math.max(0, baseMspRate - moistureDeduction + gradeAdjustment);
  const grossPayable = Math.round(quantityQuintals * baseMspRate);
  const deductions = Math.round(quantityQuintals * (moistureDeduction - gradeAdjustment));
  const netPayable = Math.round(quantityQuintals * netRate);

  const breakdown = moisturePercent <= standardMoisture 
    ? `Standard moisture (<=${standardMoisture}%) satisfied. 100% full MSP rate applied without deductions.`
    : `Excess moisture of ${(moisturePercent - standardMoisture).toFixed(1)}% resulted in standard deduction of ₹${moistureDeduction.toFixed(2)}/qtl.`;

  return {
    baseMspRate,
    actualQuantityQuintals: quantityQuintals,
    moisturePercent,
    isMoistureCompliant: moisturePercent <= standardMoisture,
    moistureDeductionPerQtl: moistureDeduction,
    gradePremiumDiscountPerQtl: gradeAdjustment,
    netRatePerQuintal: netRate,
    grossPayableAmount: grossPayable,
    totalDeductions: deductions,
    netPayableAmount: netPayable,
    breakdownSummary: breakdown
  };
}

export function estimateWaitTime(
  queuePosition: number, 
  activeCounters: number, 
  avgProcessingMinutes: number = 10
): number {
  if (queuePosition <= 0) return 0;
  const effectiveCounters = Math.max(1, activeCounters);
  return Math.ceil((queuePosition * avgProcessingMinutes) / effectiveCounters);
}

// ==========================================
// SMART ARRIVAL & DEPARTURE PREDICTION ENGINE
// ==========================================

import { SmartJourneyPlan, ProcurementCenter } from '../types';

/**
 * Converts a 12-hour AM/PM time window or time string to minutes from midnight (0 to 1439).
 * E.g., "02:00 PM – 02:30 PM" -> 840 mins (14:00)
 *       "10:30 AM – 11:00 AM" -> 630 mins (10:30)
 *       "03:00 PM – 03:30 PM" -> 900 mins (15:00)
 */
export function parseSlotStartTime(slotString: string): { startMinutes: number; startFormatted: string } {
  if (!slotString) return { startMinutes: 630, startFormatted: '10:30 AM' };

  // Extract the first time portion before '-' or '–'
  const firstPart = slotString.split(/[–-]/)[0].trim();
  
  // Match standard time regex: HH:MM AM/PM or HH:MM
  const match = firstPart.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) {
    return { startMinutes: 630, startFormatted: '10:30 AM' };
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3] ? match[3].toUpperCase() : '';

  if (modifier === 'PM' && hours < 12) {
    hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  const startMinutes = (hours * 60) + minutes;
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedPeriod = hours >= 12 ? 'PM' : 'AM';
  const startFormatted = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${formattedPeriod}`;

  return { startMinutes, startFormatted };
}

/**
 * Converts minutes from midnight to a 12-hour AM/PM string.
 * Handles wrap-around if before midnight or after.
 */
export function formatMinutesToTimeStr(totalMinutes: number): string {
  // Normalize into 0-1439 range
  let normalized = Math.round(totalMinutes) % 1440;
  if (normalized < 0) normalized += 1440;

  const hours24 = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const paddedMins = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${hours12}:${paddedMins} ${period}`;
}

/**
 * Formats duration minutes into human-readable text.
 * E.g., 180 -> "3 hrs", 90 -> "1.5 hrs", 25 -> "25 mins"
 */
export function formatDurationStr(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} mins`;
  }
  const hrs = minutes / 60;
  if (hrs % 1 === 0) {
    return `${hrs} hrs`;
  }
  return `${hrs.toFixed(1)} hrs`;
}

/**
 * Calculates road distance (km) and estimated tempo/tractor travel time (minutes).
 * Integrates an Indian inter-district agricultural corridor matrix with coordinate fallback.
 */
export function estimateTravelDistanceAndMinutes(
  origin: string,
  destination: ProcurementCenter | string
): { distanceKm: number; travelMinutes: number; routeNote: string } {
  const normOrigin = (origin || '').toLowerCase().trim();
  const destName = typeof destination === 'string' ? destination : `${destination.name} ${destination.district || ''} ${destination.address || ''}`;
  const normDest = destName.toLowerCase().trim();

  // 1. Specific District/City Routes (Maharashtra & Regional APMC Hubs)
  
  // Nashik <-> Satara
  if ((normOrigin.includes('nashik') || normOrigin.includes('dindori') || normOrigin.includes('niphad') || normOrigin.includes('sinnar')) && 
      (normDest.includes('satara'))) {
    return {
      distanceKm: 225,
      travelMinutes: 180, // 3.0 hrs
      routeNote: 'via NH48 & Pune-Nashik Highway (Estimated ~75 km/h)'
    };
  }

  // Pune <-> Satara
  if ((normOrigin.includes('pune') || normOrigin.includes('haveli') || normOrigin.includes('khed') || normOrigin.includes('baramati')) && 
      (normDest.includes('satara'))) {
    return {
      distanceKm: 110,
      travelMinutes: 90, // 1.5 hrs
      routeNote: 'via NH48 Katraj-Khandala Corridor (Estimated ~75 km/h)'
    };
  }

  // Sangli <-> Satara
  if ((normOrigin.includes('sangli') || normOrigin.includes('miraj') || normOrigin.includes('walwa') || normOrigin.includes('islampur')) && 
      (normDest.includes('satara'))) {
    return {
      distanceKm: 120,
      travelMinutes: 90, // 1.5 hrs
      routeNote: 'via NH48 Kolhapur-Satara Stretch (Estimated ~80 km/h)'
    };
  }

  // Kolhapur <-> Satara
  if (normOrigin.includes('kolhapur') && normDest.includes('satara')) {
    return {
      distanceKm: 125,
      travelMinutes: 95,
      routeNote: 'via NH48 (Estimated ~80 km/h)'
    };
  }

  // Wardha <-> Shivapur APMC
  if ((normOrigin.includes('wardha') || normOrigin.includes('shivapur') || normOrigin.includes('bori') || normOrigin.includes('dhotra')) && 
      (normDest.includes('shivapur'))) {
    return {
      distanceKm: 18,
      travelMinutes: 25,
      routeNote: 'via Mandi Link Road (Local Access)'
    };
  }

  // Wardha <-> Wardha East Depot
  if (normOrigin.includes('wardha') && normDest.includes('wardha east')) {
    return {
      distanceKm: 8,
      travelMinutes: 15,
      routeNote: 'via NH361 Bypass'
    };
  }

  // Nagpur <-> Wardha
  if (normOrigin.includes('nagpur') && (normDest.includes('wardha') || normDest.includes('shivapur'))) {
    return {
      distanceKm: 76,
      travelMinutes: 70,
      routeNote: 'via NH44 & Wardha Road'
    };
  }

  // Karnal Local Hub
  if (normOrigin.includes('karnal') || normDest.includes('karnal')) {
    return {
      distanceKm: 22,
      travelMinutes: 30,
      routeNote: 'via GT Road Corridor'
    };
  }

  // Ludhiana Local Hub
  if (normOrigin.includes('ludhiana') || normDest.includes('ludhiana')) {
    return {
      distanceKm: 25,
      travelMinutes: 35,
      routeNote: 'via Ferozepur Road'
    };
  }

  // Sehore Local Hub
  if (normOrigin.includes('sehore') || normDest.includes('sehore')) {
    return {
      distanceKm: 32,
      travelMinutes: 45,
      routeNote: 'via Bhopal-Indore Highway'
    };
  }

  // Bareilly Local Hub
  if (normOrigin.includes('bareilly') || normDest.includes('bareilly')) {
    return {
      distanceKm: 24,
      travelMinutes: 35,
      routeNote: 'via Pilibhit Bypass'
    };
  }

  // Same village / center local heuristic
  if (typeof destination !== 'string' && destination.distanceKm) {
    const dist = destination.distanceKm;
    const mins = Math.max(15, Math.round((dist / 35) * 60) + 10);
    return {
      distanceKm: dist,
      travelMinutes: mins,
      routeNote: 'Local rural transport corridor'
    };
  }

  // Default fallback estimate
  return {
    distanceKm: 35,
    travelMinutes: 40,
    routeNote: 'Standard regional agricultural road estimate'
  };
}

/**
 * Computes the complete Smart Journey Plan for a farmer.
 * Logic:
 * Recommended Departure = Slot Start Time - Estimated Travel Time - Safety Buffer
 * Expected Arrival = Departure + Travel Time = Slot Start Time - Safety Buffer
 */
export function calculateJourneyPlan(params: {
  originLocation: string;
  originDistrict?: string;
  destinationCenter: ProcurementCenter | string;
  slotTimeWindow: string;
  safetyBufferMinutes?: number;
}): SmartJourneyPlan {
  const {
    originLocation,
    originDistrict = '',
    destinationCenter,
    slotTimeWindow,
    safetyBufferMinutes = 30
  } = params;

  const destName = typeof destinationCenter === 'string' ? destinationCenter : destinationCenter.name;
  const destDistrict = typeof destinationCenter === 'string' ? destinationCenter : destinationCenter.district;

  // 1. Missing Location Edge Case
  if (!originLocation && !originDistrict) {
    return {
      originLocation: 'Location not set in profile',
      originDistrict: '',
      destinationCenter: destName,
      destinationDistrict: destDistrict,
      estimatedDistanceKm: 0,
      estimatedTravelMinutes: 0,
      estimatedTravelFormatted: 'Unknown',
      procurementSlot: slotTimeWindow,
      slotStartTime: '10:30 AM',
      safetyBufferMinutes,
      recommendedDepartureTime: 'Set location to calculate',
      expectedArrivalTime: 'Unknown',
      expectedProcurementTime: 'Slot window',
      isPractical: false,
      warningMessage: 'Please complete your district and village in your farmer profile to get departure predictions.',
      explanation: 'Departure prediction requires your village or district location.'
    };
  }

  const fromLabel = originDistrict 
    ? (originLocation.toLowerCase().includes(originDistrict.toLowerCase()) ? originLocation : `${originLocation}, ${originDistrict}`)
    : originLocation;

  // 2. Estimate Travel Distance & Minutes
  const { distanceKm, travelMinutes } = estimateTravelDistanceAndMinutes(fromLabel, destinationCenter);
  const travelFormatted = formatDurationStr(travelMinutes);

  // 3. Parse Slot Start Time
  const { startMinutes, startFormatted } = parseSlotStartTime(slotTimeWindow);

  // 4. Calculate Departure & Arrival Times
  const departureMinutes = startMinutes - travelMinutes - safetyBufferMinutes;
  const arrivalMinutes = departureMinutes + travelMinutes;

  const recommendedDepartureTime = formatMinutesToTimeStr(departureMinutes);
  const expectedArrivalTime = formatMinutesToTimeStr(arrivalMinutes);
  const expectedProcurementTime = `Around ${startFormatted}`;

  // 5. Edge cases & warnings
  let isPractical = true;
  let warningMessage: string | undefined = undefined;

  if (travelMinutes > 360) {
    // Over 6 hours travel
    warningMessage = `⚠️ This procurement center is over ${distanceKm} km (${travelFormatted}) away. Please consider booking a closer district APMC hub.`;
  }

  // If slot start is in early morning and departure would be before 4 AM
  if (departureMinutes < 240 && departureMinutes >= 0) {
    warningMessage = `⚠️ Early departure required (${recommendedDepartureTime}) to reach your ${startFormatted} slot safely.`;
  }

  const explanation = `Leave around ${recommendedDepartureTime} to reach the procurement center before your booked slot (${startFormatted}) and minimize waiting.`;

  return {
    originLocation: fromLabel,
    originDistrict,
    destinationCenter: destName,
    destinationDistrict: destDistrict,
    estimatedDistanceKm: distanceKm,
    estimatedTravelMinutes: travelMinutes,
    estimatedTravelFormatted: travelFormatted,
    procurementSlot: slotTimeWindow,
    slotStartTime: startFormatted,
    safetyBufferMinutes,
    recommendedDepartureTime,
    expectedArrivalTime,
    expectedProcurementTime,
    isPractical,
    warningMessage,
    explanation
  };
}
