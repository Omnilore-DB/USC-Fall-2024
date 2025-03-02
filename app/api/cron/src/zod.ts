import { z, ZodError } from "zod";

const transform = (v: string): string => v.replace(/\s+/g, " ").trim();

const string = z.string().transform(transform);

const email = z.preprocess(
  v => (typeof v === "string" ? transform(v).replace(/\s+/g, "") : ""),
  z.string().email()
);

const phone = z.preprocess(
  v => (typeof v === "string" ? transform(v).replace(/\D/g, "") : ""),
  z.string().regex(/^\d{10}$/)
);

// Define valid US state abbreviations
const state = z.preprocess(
  v => (typeof v === "string" ? transform(v).toUpperCase() : v),
  z.enum([
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
  ])
);

const zip_code = z.preprocess(
  v => (typeof v === "string" ? transform(v) : v),
  z.string().regex(/^\d{5}(-\d{4})?$/)
);

export const forum_form = z.object({
  first_name: string,
  last_name: string,
  email: email,
  phone: phone,
});

export const membership_form = z.object({
  first_name: string,
  last_name: string,
  email: email,
  phone: phone,
  address: string,
  city: string,
  state: state,
  zip_code: zip_code,
  emergency_contact_name: string,
  emergency_contact_phone: phone,
});

export const donation_form = z.object({
  first_name: string,
  last_name: string,
  email: email,
});

/**
 * Validates order data against forum and membership form schemas.
 * First tries forum_form since it's a subset of membership_form.
 * If validation fails, calls onError with the validation error.
 *
 * @param data - The order data to validate
 * @param onError - Callback function to handle validation errors
 * @returns Object containing:
 *   - data: The validated data (if successful) or original data (if failed)
 *   - isValid: Whether validation succeeded
 */
export function validateOrderData<T extends Record<string, unknown>>(
  data: T,
  { onError }: { onError: (error: ZodError) => void }
) {
  // start with forum_form because it is a subset of membership_form, so it will be more likely to succeed (so if it fails, we know membership_form will fail too)
  const forum_parsed = forum_form.safeParse(data);
  if (!forum_parsed.success) {
    onError(forum_parsed.error);
    // Return original data with isValid=false
    return { data, isValid: false };
  }

  // If the address is undefined, we can return the forum_parsed data since it satisfies forum_form and won't satisfy membership_form
  if (data.address === undefined)
    return { data: forum_parsed.data, isValid: true };

  const membership_parsed = membership_form.safeParse(data);
  if (!membership_parsed.success) {
    // Return original data with isValid=false
    onError(membership_parsed.error);
    return { data, isValid: false };
  }

  // Return validated data with isValid=true
  return { data: membership_parsed.data, isValid: true };
}

/**
 * Validates donation data against the donation form schema.
 * If validation fails, calls onError with the validation error.
 *
 * @param data - The donation data to validate
 * @param onError - Callback function to handle validation errors
 * @returns Object containing:
 *   - data: The validated data (if successful) or original data (if failed)
 *   - isValid: Whether validation succeeded
 */
export function validateDonationData<T>(
  data: T,
  { onError }: { onError: (error: ZodError) => void }
) {
  const parsed = donation_form.safeParse(data);
  if (!parsed.success) {
    onError(parsed.error);
    // Return original data with isValid=false
    return { data, isValid: false };
  }

  // Return validated data with isValid=true
  return { data: parsed.data, isValid: true };
}
