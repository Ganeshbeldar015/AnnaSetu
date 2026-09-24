import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BookingToken, QCInspection, PaymentRecord, ProcurementCenter, FarmerProfile } from '../types';

/**
 * Supabase Data Service
 * Provides seamless integration with Supabase PostgreSQL tables
 * with automatic fallback to local memory/state if credentials are not yet configured.
 */

export const supabaseService = {
  // Check if live Supabase is active
  isLive: (): boolean => {
    return isSupabaseConfigured();
  },

  // Save or Update a Booking Token
  saveBooking: async (token: BookingToken): Promise<{ success: boolean; data?: any; error?: string }> => {
    if (!isSupabaseConfigured() || !supabase) {
      console.info('[SupabaseService:Mock] Booking stored in dynamic local memory:', token.tokenNumber);
      return { success: true, data: token };
    }

    try {
      const { data, error } = await supabase
        .from('booking_tokens')
        .upsert({
          id: token.id.length === 36 ? token.id : undefined, // Ensure valid UUID or let Supabase generate
          token_number: token.tokenNumber,
          farmer_id: token.farmerId,
          farmer_name: token.farmerName,
          farmer_phone: token.farmerPhone,
          farmer_village: token.farmerVillage,
          farmer_district: token.farmerDistrict,
          center_id: token.centerId,
          center_name: token.centerName,
          crop_id: token.cropId,
          crop_name: token.cropName,
          expected_quantity_quintals: token.expectedQuantityQuintals,
          actual_quantity_quintals: token.actualQuantityQuintals,
          date: token.date,
          time_slot: token.timeSlot,
          stage: token.stage,
          queue_position: token.queuePosition,
          estimated_wait_minutes: token.estimatedWaitMinutes,
          counter_assigned: token.counterAssigned,
          qr_token_payload: token.qrTokenPayload,
          checked_in_at: token.checkedInAt,
          called_at: token.calledAt,
          completed_at: token.completedAt
        })
        .select()
        .single();

      if (error) {
        console.warn('[SupabaseService] Error saving booking:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err: any) {
      console.warn('[SupabaseService] Exception saving booking:', err.message);
      return { success: false, error: err.message };
    }
  },

  // Update Booking Stage (e.g. from 'booked' -> 'checked_in' -> 'called' -> 'weighing_qc')
  updateBookingStage: async (
    tokenId: string,
    stage: string,
    extraFields: Partial<BookingToken> = {}
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured() || !supabase) {
      console.info(`[SupabaseService:Mock] Token ${tokenId} stage updated to ${stage}`);
      return { success: true };
    }

    try {
      const updatePayload: Record<string, any> = { stage, ...extraFields };
      const { error } = await supabase
        .from('booking_tokens')
        .update(updatePayload)
        .eq('token_number', tokenId);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Save QC Inspection Result
  saveQCInspection: async (
    tokenId: string,
    qc: QCInspection
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured() || !supabase) {
      console.info('[SupabaseService:Mock] QC record saved for token:', tokenId);
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('qc_inspections')
        .insert({
          token_id: tokenId,
          moisture_percent: qc.moisturePercent,
          foreign_matter_percent: qc.foreignMatterPercent,
          broken_grains_percent: qc.brokenGrainsPercent,
          grade: qc.grade,
          base_msp_rate: qc.baseMspRate,
          moisture_deduction_rate: qc.moistureDeductionRate,
          net_rate_per_quintal: qc.netRatePerQuintal,
          actual_quantity_quintals: qc.actualQuantityQuintals,
          gross_amount: qc.grossAmount,
          deductions_amount: qc.deductionsAmount,
          net_payable_amount: qc.netPayableAmount,
          inspector_name: qc.inspectorName,
          counter_number: qc.counterNumber,
          weighment_slip_no: qc.weighmentSlipNo,
          inspected_at: qc.inspectedAt
        });

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Save Payment Record
  savePayment: async (payment: PaymentRecord, tokenId: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured() || !supabase) {
      console.info('[SupabaseService:Mock] Payment saved:', payment.utrNumber);
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('payments')
        .upsert({
          payment_id: payment.paymentId,
          token_id: tokenId,
          utr_number: payment.utrNumber,
          amount: payment.amount,
          status: payment.status,
          bank_name: payment.bankName,
          account_masked: payment.accountMasked,
          ifsc_code: payment.ifscCode,
          pfms_reference: payment.pfmsReference,
          initiated_at: payment.initiatedAt,
          credited_at: payment.creditedAt
        });

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Fetch Centers from Supabase
  fetchCenters: async (): Promise<{ success: boolean; data?: ProcurementCenter[]; error?: string }> => {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase credentials not configured' };
    }

    try {
      const { data, error } = await supabase
        .from('procurement_centers')
        .select('*');

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data: data as any };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Log Security Audit Event
  logAudit: async (
    actorId: string,
    actorName: string,
    actorRole: string,
    action: string,
    details: string
  ): Promise<void> => {
    console.info(`[AUDIT LOG] [${actorRole.toUpperCase()}] ${actorName}: ${action} - ${details}`);
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('audit_logs').insert({
          actor_id: actorId,
          actor_name: actorName,
          actor_role: actorRole,
          action,
          details
        });
      } catch (err) {
        console.warn('Audit logging error:', err);
      }
    }
  }
};
