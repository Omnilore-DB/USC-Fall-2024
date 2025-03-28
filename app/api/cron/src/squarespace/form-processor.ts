import type { SupabaseMember, SupabaseMemberInsert } from "../supabase/types";
import {
  remove_extra_whitespace,
  string,
  email,
  phone,
  state,
  zip_code,
  type SchemaItem,
} from "../validations/schemas";

const FORM_DATA_MAP = new Map(
  Object.entries({
    "First Name": {
      column: "first_name",
      processor: string,
    },
    "Last Name": {
      column: "last_name",
      processor: string,
    },
    Name: {
      processor: string,
      transform: (v: string) => {
        const [first_name, ...last_name] = v.split(" ");
        return [first_name, last_name.join(" ")];
      },
      columns: ["first_name", "last_name"],
    },
    Email: {
      column: "email",
      processor: email,
    },
    Phone: {
      column: "phone",
      processor: phone,
    },
    "Street Address": {
      column: "street_address",
      processor: string,
    },
    Address: {
      column: "street_address",
      processor: string,
    },
    City: {
      column: "city",
      processor: string,
    },
    State: {
      column: "state",
      processor: state,
    },
    Zip: {
      column: "zip_code",
      processor: zip_code,
    },
    "Zip Code": {
      column: "zip_code",
      processor: zip_code,
    },
    "Emergency Contact Name": {
      column: "emergency_contact",
      processor: string,
    },
    "Emergency Contact Phone": {
      column: "emergency_contact_phone",
      processor: phone,
    },
  } as const satisfies FormDataMap),
);

type ProcessedFormData = {
  valid_data: Partial<SupabaseMember>;
  invalid_data: InvalidProcessedFormData;
};

type InvalidProcessedFormData = {
  [key: SquarespaceFormLabel]: { raw_value: string; errors: unknown };
};

export function parse_form_data(data: [string, string][]): ProcessedFormData {
  const valid_data: Partial<SupabaseMemberInsert> = {};
  const invalid_data: InvalidProcessedFormData = {};

  for (let [label, value] of data) {
    label = remove_extra_whitespace(label);

    if (!FORM_DATA_MAP.has(label)) {
      if (label.length > 30) {
        invalid_data[label] = {
          raw_value: value,
          errors: `This label is not in the FORM_DATA_MAP and is more than 30 characters long, so we wont process it. This is not an error.`,
        };
        continue;
      }

      invalid_data[label] = {
        raw_value: value,
        errors: `This label is not in the FORM_DATA_MAP, so we do not know how to process it and map it to a column in the Supabase member table.`,
      };
      continue;
    }

    const {
      column,
      processor: { pre, schema },

      columns,
      transform,
    } = FORM_DATA_MAP.get(label)!;

    const parsed = schema.safeParse(pre(value));
    if (!parsed.success) {
      invalid_data[label] = { raw_value: value, errors: parsed.error.issues };
      continue;
    }

    if (!column) {
      transform(parsed.data).forEach((v, i) => {
        valid_data[columns[i]] = v;
      });
      continue;
    }

    valid_data[column] = parsed.data;
  }

  return { valid_data, invalid_data };
}

type SquarespaceFormLabel = string;
type SupabaseMemberColumn = keyof SupabaseMember;

type FormDataMap = {
  [key: SquarespaceFormLabel]:
    | {
        column: SupabaseMemberColumn;
        processor: SchemaItem;
      }
    | {
        processor: SchemaItem;
        transform: (v: string) => string[];
        columns: SupabaseMemberColumn[];
      };
};
