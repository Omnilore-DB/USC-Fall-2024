import type { SupabaseMember, SupabaseMemberInsert } from "../supabase/types";
import {
  remove_extra_whitespace,
  string,
  email,
  phone,
  state,
  zip_code,
  yes_no,
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
    Privacy: {
      column: "public",
      processor: yes_no,
    },
    "I agree to the display of my address/phone/email on the annual membership rosters stored in the password-protected area of the Omnilore website:":
      {
        column: "public",
        processor: yes_no,
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

    if (
      label ===
      "I recognize that Omnilore is a member-driven, peer teaching/learning organization. As a member, I agree to assume my share of responsibility necessary for the success of its program, including but not limited to: (1) preparing and providing an approximately 30 minute presentation and (2) preparing discussion questions and leading a discussion as agreed by S/DG members during Pre-meeting planning in each Study/Discussion Group (S/DG) in which I enroll."
    ) {
      continue;
    }

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
      transform(parsed.data as string).forEach((v, i) => {
        valid_data[columns[i]] = v;
      });
      continue;
    }

    valid_data[column] = parsed.data as any;
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
