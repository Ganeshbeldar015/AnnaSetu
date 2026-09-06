# e-Kisan Procurement (ई-किसान सेतु)
### National MSP Smart Slot Scheduling, Live Queue Management & Transparent Direct Benefit Transfer (DBT) Platform

> **Smart India Hackathon 2026**  
> **Problem Statement ID:** 26032  
> **Organization:** Ministry of Consumer Affairs, Food & Public Distribution  
> **Department:** Department of Consumer Affairs (DoCA)  
> **Theme:** Smart Automation  
> **Tagline:** *"Smart Slots. Zero Waiting. Transparent Payments."*

---

## 🌾 1. Project Overview & Problem-Solution Fit

### The Real-World Crisis at Mandis & MSP Procurement Depots
During peak harvest seasons (Kharif/Rabi), millions of Indian farmers transport paddy, wheat, pulses, and oilseeds to Agricultural Produce Market Committee (APMC) hubs and Food Corporation of India (FCI) depots. Because there is no centralized pre-scheduling:
1. **Catastrophic Highway Queues**: Farmers queue their tractor-trolleys on highway shoulders for **18 to 36 hours** without basic shelter or information on whether the mandi has reached daily quota.
2. **Post-Harvest Spoilage & Night Exposure**: Grains left overnight in open trolleys absorb nocturnal dew, increasing moisture content and triggering arbitrary deductions.
3. **Opaque Quality & Moisture Grading**: Manual grain inspection leads to arbitrary deductions (cuts of ₹100–₹300/qtl) by middlemen.
4. **Delayed Payments & Manual Ledgers**: Paper receipts get misplaced; farmers make multiple trips over 3 to 4 weeks to verify bank payments.

### The e-Kisan Solution
**e-Kisan Procurement** transforms this chaotic walk-in system into an intelligent, high-throughput digital pipeline:
- **"Book Before You Arrive"**: Farmers select 30-minute time windows calibrated to real-time mandi capacities.
- **"Know Your Live Position"**: Live digital tokens (`A-024`), dynamic queue countdowns, and automated SMS alerts ensure farmers only start their tractor when their turn is near.
- **"Zero Tampering & Calibrated Scales"**: Automated formula-driven MSP calculations without manual alteration.
- **"Direct Benefit Transfer (DBT) Settlement"**: E-J Form generation dispatches instant mandates to the RBI PFMS / Aadhaar Payment Bridge.

---

## 🚀 2. Key Features & Role-Based Modules

### A. 👨‍🌾 Farmer Portal (Mobile-First Experience)
- **4-Step Integrated Registration**: Connects farmer profile, Aadhaar/PM-KISAN ID, and State Land Survey (Bhulekh) records.
- **Smart Slot Booking Matrix**: Real-time capacity grid with fast-filling badges (`23/25 booked, 2 slots available`) and FULL slot blocking.
- **AI Alternate Center Suggestion**: Suggests nearby hubs (e.g. Wardha East Depot 6.2 km away) when the primary hub is near capacity.
- **Live Queue Tracker & Audio Chimes**: Live multi-counter display, position countdown, and airport-grade PA audio announcements ("Token A-024 please proceed to Counter 2").
- **Digital Self Check-In**: Simulated gate QR scanner with grace-period intelligence for early or late arrivals.
- **Transparent DBT Ledger**: Real-time PFMS milestone timeline, moisture calculation audit, and downloadable official **Digital E-J Form** certificates.

### B. 🏢 Centre Operator Portal
- **Mandi Command Station**: Daily bookings, checked-in vehicles, in-progress weighment, and throughput monitoring.
- **Live Multi-Counter Dispatcher**: Real-time queue table with 1-click actions (`Check-In`, `Call Next`, `Start QC`, `Complete Procurement`).
- **Electronic Moisture & MSP Terminal**: Standardized quality parameters (Moisture %, Foreign Matter %, Broken Grains %, Grade Classification) with dynamic formula calculations.
- **Surge Gatekeeper & Broadcaster**: Dynamic slot limit adjustments, reserve weighbridge activation (Counter 4), and mass SMS broadcast to arriving farmers.

### C. 🏛️ Government Admin (DoCA) Command Center
- **National Executive Telemetry**: High-level KPIs across 6 states (Volume Procured, DBT Disbursed, Turnaround SLA, Slot Adherence).
- **Geospatial Mandi Network Map**: Interactive cluster map displaying center load statuses (`Normal`, `Busy`, `High Load`, `Full`) with drill-down telemetry drawers.
- **Smart Automation Hub**: Dynamic wait-time estimation algorithms (`T = (Q × P) / N`), predictive surge alerts, and automated rerouting routines.
- **Official Audit & CSV Reports**: Real-time CSV generation and printable official government audit ledgers.

### D. 🏆 Judge Interactive Demo Mode
- **Persistent Floating Scenario Dock**: A 9-step 1-click guided walkthrough allowing hackathon judges to evaluate the complete end-to-end multi-persona story in under 2 minutes.
- **Auto-Play Pitch Mode**: Hands-free presentation mode that cycles through the storyline automatically.
- **Simulated Telecom SMS Drawer**: Live Indian telecom SMS feed (`AX-EKISAN`) with instant custom alert simulators.

---

## 🛠️ 3. Technologies Used

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 18 + Vite + TypeScript | High-performance SPA with instant client-side state transitions |
| **Styling** | Tailwind CSS + Custom GovTech Palette | Government of India / Digital India compliant design system |
| **Icons** | Lucide React | Professional UI and telemetry iconography |
| **Data Viz** | Recharts | Daily volume curves, hourly slot utilization, wait time before/after, payment SLAs |
| **Audio** | Web Audio API + SpeechSynthesis | Mandi PA announcement chime and synthesized audio callouts |
| **Visual FX** | Canvas Confetti | Celebratory milestone feedback upon E-J Form & DBT settlement |
| **State Sync** | React Context + Real-Time Event Bus | Synchronized data across Farmer, Operator, and Admin roles |

---

## ⚡ 4. How to Run Locally

### Prerequisites
- Node.js (v18 or newer)
- npm (v9 or newer)

### Installation & Execution
```bash
# 1. Navigate to project directory
cd ekisan-procurement

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev
```

The application will launch locally at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
Generates an optimized production bundle in the `dist/` directory.

---

## 📋 5. Demo Credentials & Test Personas

For prototype judging, no manual login or passwords are required. Judges can switch personas instantly using the top bar or floating demo controller:

| Persona | Name | Role / Context | Assigned Token |
|---|---|---|---|
| **Farmer Demo** | Rameshwar Pandurang Patil | Village Shivapur, Wardha, MH (4.8 Acres) | `A-024` (Paddy Grade A) |
| **Centre Operator** | Sanjay Deshmukh / Anil Jadhav | Shivapur APMC Hub (Counter 2) | Terminal DOCA-MH-042 |
| **Govt Admin** | Directorate of Food & Public Distribution | Central Command (DoCA / Krishi Bhavan) | National Monitoring |

---

## 🎬 6. End-to-End 2-Minute Demo Scenario for Judges

1. **Step 1 (Farmer Registration)**: Open Farmer Registration → Review pre-filled land survey and crop data (`52.5 qtl Paddy Grade A`).
2. **Step 2 (Smart Slot Booking)**: Select Shivapur APMC Hub → Observe capacity bars → Confirm `10:30 AM – 11:00 AM` slot → Generate **Token `A-024`**.
3. **Step 3 (Live Queue & Wait Time)**: Open Live Queue → View position `#12` and estimated wait time `~35 minutes`.
4. **Step 4 (Operator Gate Check-In)**: Switch to Centre Operator → Scan Gate QR / Check-in Token `A-024` → Watch queue position update to `#8 (24 mins)`.
5. **Step 5 (Counter Call & Audio Chime)**: Operator clicks `Call to Counter 2` → Hear Mandi PA chime and voice announcement → Simulated SMS is dispatched.
6. **Step 6 (QC Moisture & Dynamic MSP)**: Open QC Terminal → Enter moisture `13.8%` and weight `52.5 qtl` → Formula dynamically calculates `₹1,21,800`.
7. **Step 7 (Complete E-Procurement)**: Operator clicks `Issue Digital E-J Form` → Celebratory confetti triggers → Digital certificate stamped.
8. **Step 8 (Direct DBT Settlement)**: Switch to Farmer Payments → View PFMS milestone timeline → Click `Mark Paid` to verify instant bank credit.
9. **Step 9 (DoCA Executive Analytics)**: Switch to Admin Dashboard → Inspect Geospatial Mandi Map and download generated CSV audit report.

---

## 🔮 7. Future Scalability & Government-Scale Roadmap

1. **IoT Weighbridge API Integration**: Direct serial/RS-485 hookup to digital weighbridges (Avery Weigh-Tronix, Essae) to eliminate human data entry.
2. **AI Optical Grain Quality Scanners**: Integration with smartphone camera image processing to assess grain discoloration and broken kernels in 10 seconds.
3. **National e-NAM & PM-KISAN Federation**: Seamless REST API synchronization with the national e-NAM bidding network and state land registry Bhulekh databases.
4. **IVRS / USSD Dialing for Feature Phones**: Multi-lingual voice IVR (`*99#` or toll-free `1967`) enabling non-smartphone farmers to book slots via keypad.
5. **Offline Queue Sync (Edge Nodes)**: Local SQLite edge caches running on mandi raspberry pi servers to ensure zero downtime during rural internet outages.

---

## ⚖️ 8. Prototype Disclosures

- All farmer names, vehicle registrations, bank account numbers, UTR transaction references, and simulated telecom SMS messages are realistic mock data created specifically for **SIH 2026 Problem Statement #26032** evaluation.
- No actual SMS charges, banking transactions, or government databases are altered during the demonstration.

---
**Developed with pride for the Ministry of Consumer Affairs, Food & Public Distribution (DoCA) • Smart India Hackathon 2026**
