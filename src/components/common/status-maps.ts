import type { EmployeeStatus } from "@/mocks/people";
import type { PayrollRunStatus } from "@/mocks/payroll";
import type { RequestStatus } from "@/mocks/time";

import type { Tone } from "./status-badge";

export const employeeStatusTone: Record<EmployeeStatus, Tone> = {
  active: "success",
  probation: "info",
  leave: "warning",
  terminated: "neutral",
};

export const payrollStatusTone: Record<PayrollRunStatus, Tone> = {
  draft: "neutral",
  calculated: "info",
  review: "violet",
  approved: "success",
  paid: "success",
  closed: "neutral",
};

export const requestStatusTone: Record<RequestStatus, Tone> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
  returned: "violet",
  draft: "neutral",
};
