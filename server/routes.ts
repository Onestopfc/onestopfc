import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabase } from "./supabase";
import { insertCustomerSchema, insertLoanRequestSchema } from "@shared/schema";
import { z } from "zod";

const STAFF_EMAIL = "aekwenibe@gmail.com";
const STAFF_PASSWORD = "onestop2024";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mgvknpap";

async function notifyEmail(subject: string, body: Record<string, string>) {
  try {
    await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ _subject: subject, ...body, _replyto: body.email || STAFF_EMAIL }),
    });
  } catch {
    // non-fatal
  }
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<void> {

  // ── AUTH ──────────────────────────────────────────────────────────────────

  // Register
  app.post("/api/register", async (req, res) => {
    try {
      const data = insertCustomerSchema.parse(req.body);

      // Check email uniqueness
      const { data: existing } = await supabase
        .from("customers")
        .select("id")
        .eq("email", data.email.toLowerCase().trim())
        .single();

      if (existing) return res.status(409).json({ error: "Email already registered. Please sign in." });

      const { data: customer, error } = await supabase
        .from("customers")
        .insert({
          full_name: data.full_name.trim(),
          email: data.email.toLowerCase().trim(),
          phone: data.phone.trim(),
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          home_address: data.home_address.trim(),
          city: data.city.trim(),
          state: data.state,
          id_type: data.id_type,
          id_number: data.id_number.trim(),
          nok_name: data.nok_name.trim(),
          nok_phone: data.nok_phone.trim(),
          nok_relationship: data.nok_relationship,
          password: data.password,
          status: "active",
        })
        .select()
        .single();

      if (error) {
        console.error("Register error:", error);
        return res.status(500).json({ error: "Could not create account. Please try again." });
      }

      // Notify staff
      notifyEmail(`New Customer — ${data.full_name} | One Stop FC`, {
        Name: data.full_name,
        Email: data.email,
        Phone: data.phone,
        "Date of Birth": data.date_of_birth,
        Gender: data.gender,
        Address: `${data.home_address}, ${data.city}, ${data.state}`,
        "ID Type": data.id_type,
        "ID Number": data.id_number,
        "Next of Kin": `${data.nok_name} (${data.nok_relationship}) — ${data.nok_phone}`,
        Message: "A new customer has registered on One Stop FC.",
      });

      const { password: _pw, ...safeCustomer } = customer;
      res.json({ customer: safeCustomer });
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors[0].message });
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Login
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const { data: customer, error } = await supabase
      .from("customers")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !customer) return res.status(401).json({ error: "No account found with that email. Please register first." });
    if (customer.password !== password) return res.status(401).json({ error: "Incorrect password. Please try again." });

    const { password: _pw, ...safeCustomer } = customer;
    res.json({ customer: safeCustomer });
  });

  // Staff login
  app.post("/api/staff/login", (req, res) => {
    const { email, password } = req.body;
    if (email === STAFF_EMAIL && password === STAFF_PASSWORD) {
      return res.json({ role: "staff" });
    }
    res.status(401).json({ error: "Invalid staff credentials" });
  });

  // ── CUSTOMERS ─────────────────────────────────────────────────────────────

  app.get("/api/customers", async (_req, res) => {
    const { data, error } = await supabase
      .from("customers")
      .select("id, full_name, email, phone, date_of_birth, gender, home_address, city, state, id_type, id_number, nok_name, nok_phone, nok_relationship, status, created_at")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: "Could not fetch customers" });
    res.json(data);
  });

  app.get("/api/customers/:id", async (req, res) => {
    const { data, error } = await supabase
      .from("customers")
      .select("id, full_name, email, phone, date_of_birth, gender, home_address, city, state, id_type, id_number, nok_name, nok_phone, nok_relationship, status, created_at")
      .eq("id", req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: "Not found" });
    res.json(data);
  });

  // ── LOAN REQUESTS ─────────────────────────────────────────────────────────

  // Customer submits request
  app.post("/api/loans", async (req, res) => {
    try {
      const data = insertLoanRequestSchema.parse(req.body);

      // Verify customer exists
      const { data: customer } = await supabase
        .from("customers")
        .select("id, full_name, email, phone")
        .eq("id", data.customer_id)
        .single();

      if (!customer) return res.status(404).json({ error: "Customer not found" });

      const { data: loan, error } = await supabase
        .from("loan_requests")
        .insert({
          customer_id: data.customer_id,
          item_name: data.item_name,
          item_category: data.item_category,
          item_description: data.item_description,
          item_condition: data.item_condition,
          estimated_value: data.estimated_value,
          requested_amount: data.requested_amount,
          preferred_duration: data.preferred_duration,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("Loan insert error:", error);
        return res.status(500).json({ error: "Could not submit request" });
      }

      // Notify staff
      notifyEmail(`New Loan Request — ${customer.full_name} | One Stop FC`, {
        "Customer Name": customer.full_name,
        "Customer Email": customer.email,
        "Customer Phone": customer.phone,
        Item: data.item_name,
        Category: data.item_category,
        Condition: data.item_condition,
        Description: data.item_description,
        "Estimated Value": `₦${data.estimated_value.toLocaleString()}`,
        "Amount Requested": `₦${data.requested_amount.toLocaleString()}`,
        "Preferred Duration": data.preferred_duration,
        Message: "A customer has submitted a new pawn loan request on One Stop FC.",
      });

      res.json(loan);
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors[0].message });
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get all (staff)
  app.get("/api/loans", async (_req, res) => {
    const { data, error } = await supabase
      .from("loan_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: "Could not fetch loans" });
    res.json(data);
  });

  // Get by customer
  app.get("/api/loans/customer/:id", async (req, res) => {
    const { data, error } = await supabase
      .from("loan_requests")
      .select("*")
      .eq("customer_id", req.params.id)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: "Could not fetch loans" });
    res.json(data);
  });

  // Get single loan
  app.get("/api/loans/:id", async (req, res) => {
    const { data, error } = await supabase
      .from("loan_requests")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: "Not found" });
    res.json(data);
  });

  // Staff: assess / update
  app.patch("/api/loans/:id", async (req, res) => {
    // Fetch existing loan for email notification
    const { data: existing } = await supabase
      .from("loan_requests")
      .select("*, customers(full_name, email)")
      .eq("id", req.params.id)
      .single();

    if (!existing) return res.status(404).json({ error: "Not found" });

    const updates: Record<string, unknown> = { ...req.body, reviewed_at: new Date().toISOString() };

    const { data: updated, error } = await supabase
      .from("loan_requests")
      .update(updates)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      console.error("Loan update error:", error);
      return res.status(500).json({ error: "Could not update loan" });
    }

    // Notify customer if status changed
    if (req.body.status && (req.body.status === "approved" || req.body.status === "rejected")) {
      const isApproved = req.body.status === "approved";
      notifyEmail(
        `Loan ${isApproved ? "Approved ✅" : "Rejected ❌"} — ${existing.item_name} | One Stop FC`,
        {
          Status: req.body.status,
          "Offered Amount": req.body.offered_amount ? `₦${Number(req.body.offered_amount).toLocaleString()}` : "N/A",
          Notes: req.body.staff_notes || "—",
          Message: `Your pawn request for ${existing.item_name} has been ${req.body.status} by One Stop FC.`,
        }
      );
    }

    res.json(updated);
  });
}
