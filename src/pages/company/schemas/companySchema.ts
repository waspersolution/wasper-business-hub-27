
import { z } from "zod";

export const companySchema = z.object({
  companyName: z.string().min(2, { message: "Company name is required" }),
  fiscalYearStart: z.date({
    required_error: "Fiscal year start date is required",
  }),
  accountingStart: z.date({
    required_error: "Accounting start date is required",
  }),
  currency: z.string({
    required_error: "Please select a base currency",
  }),
  timezone: z.string({
    required_error: "Please select a time zone",
  }),
}).refine((data) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return data.fiscalYearStart <= today;
}, {
  message: "Fiscal year start date must not be in the future",
  path: ["fiscalYearStart"],
}).refine((data) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return data.accountingStart <= today;
}, {
  message: "Accounting start date must not be in the future",
  path: ["accountingStart"],
}).refine((data) => {
  return data.fiscalYearStart <= data.accountingStart;
}, {
  message: "Fiscal year start must be on or before accounting start date",
  path: ["fiscalYearStart"],
});

export type CompanyFormValues = z.infer<typeof companySchema>;
