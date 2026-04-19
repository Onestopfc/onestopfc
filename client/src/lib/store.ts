// API-based store — all data persisted in Supabase via the backend
// These functions call /api/* endpoints and return real data

import { type Customer, type LoanRequest } from "@shared/schema";

const API_BASE = "";

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Request failed");
  return json;
}

// ── CUSTOMERS ──────────────────────────────────────────────────────────────────

export async function registerCustomer(data: {
  full_name: string; email: string; phone: string; date_of_birth: string;
  gender: string; home_address: string; city: string; state: string;
  id_type: string; id_number: string; nok_name: string; nok_phone: string;
  nok_relationship: string; password: string;
}): Promise<{ ok: boolean; error?: string; customer?: Customer }> {
  try {
    const result = await apiFetch("/api/register", { method: "POST", body: JSON.stringify(data) });
    return { ok: true, customer: result.customer };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "Registration failed" };
  }
}

export async function loginCustomer(email: string, password: string): Promise<{ ok: boolean; error?: string; customer?: Customer }> {
  try {
    const result = await apiFetch("/api/login", { method: "POST", body: JSON.stringify({ email, password }) });
    return { ok: true, customer: result.customer };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "Login failed" };
  }
}

export async function getAllCustomers(): Promise<Customer[]> {
  return apiFetch("/api/customers");
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  try { return await apiFetch(`/api/customers/${id}`); } catch { return undefined; }
}

// ── LOAN REQUESTS ──────────────────────────────────────────────────────────────

export async function createLoanRequest(data: {
  customer_id: string; item_name: string; item_category: string;
  item_description: string; item_condition: string; estimated_value: number;
  requested_amount: number; preferred_duration: string;
}): Promise<LoanRequest> {
  return apiFetch("/api/loans", { method: "POST", body: JSON.stringify(data) });
}

export async function getLoansByCustomer(customerId: string): Promise<LoanRequest[]> {
  try { return await apiFetch(`/api/loans/customer/${customerId}`); } catch { return []; }
}

export async function getAllLoans(): Promise<LoanRequest[]> {
  return apiFetch("/api/loans");
}

export async function getLoanById(id: string): Promise<LoanRequest | undefined> {
  try { return await apiFetch(`/api/loans/${id}`); } catch { return undefined; }
}

export async function updateLoan(id: string, updates: Partial<LoanRequest>): Promise<LoanRequest | undefined> {
  try { return await apiFetch(`/api/loans/${id}`, { method: "PATCH", body: JSON.stringify(updates) }); } catch { return undefined; }
}
