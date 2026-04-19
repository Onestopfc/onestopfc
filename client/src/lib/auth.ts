import { type Customer } from "@shared/schema";

// In-memory session (no localStorage — sandboxed iframe constraint)
let currentCustomer: Omit<Customer, "password"> | null = null;
let isStaff = false;

export function setCustomer(c: Omit<Customer, "password">) { currentCustomer = c; }
export function getCustomer() { return currentCustomer; }
export function setStaff(v: boolean) { isStaff = v; }
export function getIsStaff() { return isStaff; }
export function logout() { currentCustomer = null; isStaff = false; }
