import { z } from "zod";

export type SchemaItem = {
  schema: z.ZodSchema;
  pre: (v: string) => string | boolean;
};

export const remove_extra_whitespace = (v: string) =>
  v.replace(/\s+/g, " ").trim();
export const remove_all_whitespace = (v: string) => v.replace(/\s+/g, "");
export const remove_non_digits = (v: string) => v.replace(/\D/g, "");

export const string = {
  schema: z.string().nonempty(),
  pre: remove_extra_whitespace,
} satisfies SchemaItem;

export const yes_no = {
  schema: z.boolean(),
  pre: (s) => (remove_all_whitespace(s).toLowerCase() === "yes" ? true : false),
} satisfies SchemaItem;

export const email = {
  schema: z.string().email(),
  pre: (s) => remove_all_whitespace(s).toLowerCase(),
} satisfies SchemaItem;

export const phone = {
  schema: z.string().regex(/^\d{10}$/),
  pre: remove_non_digits,
} satisfies SchemaItem;

export const zip_code = {
  schema: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid zip code"),
  pre: remove_all_whitespace,
} satisfies SchemaItem;

export const state = {
  schema: z.enum([
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "DC",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "PW",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ]),
  pre: (v: string) => remove_all_whitespace(v).toUpperCase(),
} satisfies SchemaItem;

export const formatted_sku = {
  schema: z
    .string()
    .regex(/^SQF(\d{2})00(\d+)$/)
    .or(z.string().regex(/^SQM([FLA])([EU])(\d{2})00(\d+)$/)),
  pre: (v: string) => remove_extra_whitespace(v).toUpperCase(),
} satisfies SchemaItem;
