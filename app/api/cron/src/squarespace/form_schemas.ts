import { z } from "zod";

export type SchemaItem = {
  schema: z.ZodSchema;
  preprocessor: (v: string) => string;
};

const remove_extra_whitespace = (v: string) => v.replace(/\s+/g, " ").trim();
const remove_all_whitespace = (v: string) => v.replace(/\s+/g, "");
const remove_non_digits = (v: string) => v.replace(/\D/g, "");

export const string = {
  schema: z.string().nonempty(),
  preprocessor: remove_extra_whitespace,
} satisfies SchemaItem;

export const email = {
  schema: z.string().email(),
  preprocessor: remove_all_whitespace,
} satisfies SchemaItem;

export const phone = {
  schema: z.string().regex(/^\d{10}$/),
  preprocessor: remove_non_digits,
} satisfies SchemaItem;

export const zip_code = {
  schema: z.string().regex(/^\d{5}(-\d{4})?$/),
  preprocessor: remove_all_whitespace,
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
  preprocessor: (v: string) => remove_all_whitespace(v).toUpperCase(),
} satisfies SchemaItem;
