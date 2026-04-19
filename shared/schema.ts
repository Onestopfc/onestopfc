import { z } from "zod";

// ── CUSTOMERS ─────────────────────────────────────────────────────────────────
export type Customer = {
  id: string; // UUID from Supabase
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  home_address: string;
  city: string;
  state: string;
  id_type: string;
  id_number: string;
  nok_name: string;
  nok_phone: string;
  nok_relationship: string;
  password?: string; // never sent to frontend
  status: string;
  created_at: string;
};

export const insertCustomerSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  date_of_birth: z.string().min(1),
  gender: z.string().min(1),
  home_address: z.string().min(3),
  city: z.string().min(1),
  state: z.string().min(1),
  id_type: z.string().min(1),
  id_number: z.string().min(1),
  nok_name: z.string().min(2),
  nok_phone: z.string().min(7),
  nok_relationship: z.string().min(1),
  password: z.string().min(6),
});
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

// ── LOAN REQUESTS ──────────────────────────────────────────────────────────────
export type LoanRequest = {
  id: string; // UUID
  customer_id: string;
  item_name: string;
  item_category: string;
  item_description: string;
  item_condition: string;
  estimated_value: number;
  requested_amount: number;
  preferred_duration: string;
  appraised_value: number | null;
  offered_amount: number | null;
  interest_rate: number | null;
  duration_days: number | null;
  total_repayment: number | null;
  staff_notes: string | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
};

export const insertLoanRequestSchema = z.object({
  customer_id: z.string().uuid(),
  item_name: z.string().min(1),
  item_category: z.string().min(1),
  item_description: z.string().min(1),
  item_condition: z.string().min(1),
  estimated_value: z.number().positive(),
  requested_amount: z.number().positive(),
  preferred_duration: z.string().min(1),
});
export type InsertLoanRequest = z.infer<typeof insertLoanRequestSchema>;
