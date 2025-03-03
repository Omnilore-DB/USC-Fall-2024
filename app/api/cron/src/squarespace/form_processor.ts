import { SupabaseMember } from "../types";
import {
  string,
  email,
  phone,
  state,
  zip_code,
  type SchemaItem,
} from "./form_schemas";

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
  } as const satisfies FormDataMap)
);

type ProcessedFormData = {
  valid_data: Partial<SupabaseMember>;
  invalid_data: InvalidProcessedFormData;
  miscellaneous_fields: string[];
};

type InvalidProcessedFormData = {
  [key: SquarespaceFormLabel]: { raw_value: string; errors: unknown };
};

export function processFormData(data: [string, string][]): ProcessedFormData {
  const valid_data: Partial<SupabaseMember> = {};
  const invalid_data: InvalidProcessedFormData = {};
  const miscellaneous_fields: string[] = [];

  for (const [label, value] of data) {
    if (label.length > 30) {
      miscellaneous_fields.push(label);
      continue;
    }

    if (!FORM_DATA_MAP.has(label)) {
      invalid_data[label] = {
        raw_value: value,
        errors: `This label is not in the FORM_DATA_MAP, so we do not know how to process it and map it to a column in the Supabase member table.`,
      };
      continue;
    }

    const {
      column,
      processor: { preprocessor, schema },

      columns,
      transform,
    } = FORM_DATA_MAP.get(label)!;

    const parsed = schema.safeParse(preprocessor(value));
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

  return { valid_data, invalid_data, miscellaneous_fields };
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
