import { customers, loanRequests, type Customer, type InsertCustomer, type LoanRequest, type InsertLoanRequest } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Customers
  createCustomer(data: InsertCustomer & { createdAt: string }): Customer;
  getCustomerByEmail(email: string): Customer | undefined;
  getCustomerById(id: number): Customer | undefined;
  getAllCustomers(): Customer[];
  // Loan Requests
  createLoanRequest(data: InsertLoanRequest & { createdAt: string }): LoanRequest;
  getLoanRequestsByCustomer(customerId: number): LoanRequest[];
  getAllLoanRequests(): LoanRequest[];
  getLoanRequestById(id: number): LoanRequest | undefined;
  updateLoanRequest(id: number, data: Partial<LoanRequest>): LoanRequest | undefined;
}

export class DatabaseStorage implements IStorage {
  createCustomer(data: InsertCustomer & { createdAt: string }): Customer {
    return db.insert(customers).values(data).returning().get();
  }
  getCustomerByEmail(email: string): Customer | undefined {
    return db.select().from(customers).where(eq(customers.email, email)).get();
  }
  getCustomerById(id: number): Customer | undefined {
    return db.select().from(customers).where(eq(customers.id, id)).get();
  }
  getAllCustomers(): Customer[] {
    return db.select().from(customers).all();
  }
  createLoanRequest(data: InsertLoanRequest & { createdAt: string }): LoanRequest {
    return db.insert(loanRequests).values(data).returning().get();
  }
  getLoanRequestsByCustomer(customerId: number): LoanRequest[] {
    return db.select().from(loanRequests).where(eq(loanRequests.customerId, customerId)).all();
  }
  getAllLoanRequests(): LoanRequest[] {
    return db.select().from(loanRequests).all();
  }
  getLoanRequestById(id: number): LoanRequest | undefined {
    return db.select().from(loanRequests).where(eq(loanRequests.id, id)).get();
  }
  updateLoanRequest(id: number, data: Partial<LoanRequest>): LoanRequest | undefined {
    return db.update(loanRequests).set(data).where(eq(loanRequests.id, id)).returning().get();
  }
}

export const storage = new DatabaseStorage();
