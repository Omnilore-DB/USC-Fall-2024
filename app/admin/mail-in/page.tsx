"use client";

import { useState, useEffect, useMemo } from "react";
import { getRoles, getPermissions, Permission } from "@/app/supabase";
import { MoonLoader } from "react-spinners";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { getProducts } from "@/app/queryFunctions";
import { SupabaseProduct } from "@/app/api/cron/src/supabase/types";
import { CommandItem } from "@/components/ui/command";
import { CommandGroup } from "@/components/ui/command";
import { CommandList } from "@/components/ui/command";
import { Command } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandEmpty } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { CommandInput } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { z } from "zod";
import {
  state as states,
  zip_code,
} from "@/app/api/cron/src/validations/schemas";
import type { MailInOrderData } from "@/app/api/cron/src/types";
import { toast } from "sonner";
import { insertMailInOrder } from "./actions";

export default function Table() {
  const {
    Field,
    handleSubmit,
    Subscribe,
    state: formState,
  } = useForm({
    defaultValues: {
      date: new Date(),
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      street_address: "",
      city: "",
      state: "CA",
      zip_code: "",
      public: true,
      sku: "",
      amount: "",
      fee: "0",
      emergency_contact: "",
      emergency_contact_phone: "",
    } as MailInOrderData,
    onSubmit: async (data) => {
      const cleanedData = Object.fromEntries(
        Object.entries(data.value).map(([key, value]) => [
          key,
          value === "" ? null : value,
        ]),
      ) as MailInOrderData;

      const toAwait = insertMailInOrder(
        cleanedData,
        products.find((p) => p.sku === cleanedData.sku)?.type ?? "UNKNOWN",
      );

      toast.promise(toAwait, {
        loading: "Creating mail-in order...",
        success: "Mail-in order created successfully",
        error: (error) => {
          console.error(error);
          return `Error creating mail-in order. ${error.message}`;
        },
      });

      await toAwait;
      data.formApi.reset();
    },
  });

  const [roles, setRoles] = useState<string[]>([]);
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setup = async () => {
      try {
        setIsLoading(true);
        const userRoles = await getRoles();
        const skus = getProducts();
        if (!userRoles) {
          console.error("Failed to fetch roles");
          return;
        }
        setRoles(userRoles);

        const allPermissions: Record<string, Permission[]> = {};
        const viewTables = new Set<string>();

        for (const role of userRoles) {
          const rolePermissions = await getPermissions(role);
          allPermissions[role] = rolePermissions;

          rolePermissions.forEach((permission) => {
            if (permission.can_read) {
              viewTables.add(permission.table_name);
            }
          });
        }

        setPermissions(allPermissions);
        setProducts((await skus).filter((p) => p.type !== "HIDDEN"));
      } catch (error) {
        console.error("Error during setup", error);
      } finally {
        setIsLoading(false);
      }
    };

    setup().catch(console.error);
  }, []);

  const hasPermission = (action: keyof Permission) => {
    return roles.some((role) =>
      permissions[role]?.some(
        (p) => p.table_name === "transactions" && p[action],
      ),
    );
  };

  return (
    <div className="flex h-full w-full flex-col bg-gray-100">
      <div className="flex w-full grow flex-col items-center justify-center overflow-y-auto">
        {roles === null ? (
          <div>Don't have the necessary permission</div>
        ) : isLoading ? (
          <div className="flex h-full items-center justify-center">
            <MoonLoader />
          </div>
        ) : (
          <div className="flex h-[95%] w-[98%] flex-row items-center gap-4">
            <div className="flex h-full w-full flex-col items-center">
              <div className="flex h-full w-full flex-col gap-6 overflow-y-auto rounded-lg bg-white p-8 shadow-md">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Mail-In Order Form
                </h1>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSubmit();
                  }}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  <Field
                    name="first_name"
                    validators={{
                      onChange: z.string().min(1, "First name cannot be empty"),
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          First Name<span className="text-red-600">*</span>
                        </label>
                        <input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                        />
                        {field.state.meta.errors ? (
                          <p className="text-sm text-red-600">
                            {field.state.meta.errors
                              .map((e) => e?.message)
                              .join(", ")}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </Field>
                  <Field
                    name="last_name"
                    validators={{
                      onChange: z.string().min(1, "Last name cannot be empty"),
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Last Name<span className="text-red-600">*</span>
                        </label>
                        <input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                        />
                        {field.state.meta.errors ? (
                          <p className="text-sm text-red-600">
                            {field.state.meta.errors
                              .map((e) => e?.message)
                              .join(", ")}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </Field>
                  <Field
                    name="date"
                    validators={{
                      onChange: z.date(),
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Date<span className="text-red-600">*</span>
                        </label>
                        <DatePicker
                          selected={field.state.value}
                          onChange={(date) => date && field.handleChange(date)}
                          dateFormat="yyyy-MM-dd"
                          wrapperClassName="w-full"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                        />
                        {field.state.meta.errors ? (
                          <p className="text-sm text-red-600">
                            {field.state.meta.errors
                              .map((e) => e?.message)
                              .join(", ")}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </Field>
                  <Field
                    name="sku"
                    validators={{
                      onChange: z.enum(
                        products.map((p) => p.sku) as [string, ...string[]],
                        { message: "Invalid SKU" },
                      ),
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          SKU<span className="text-red-600">*</span>
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between rounded-md border border-gray-300 px-3 py-2 text-left focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden",
                                !field.state.value && "text-muted-foreground",
                              )}
                            >
                              {field.state.value
                                ? products.find(
                                    (p) => p.sku === field.state.value,
                                  )?.sku +
                                  " - " +
                                  products.find(
                                    (p) => p.sku === field.state.value,
                                  )?.descriptor
                                : "Select SKU"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0 md:w-[300px] lg:w-[400px] xl:w-[500px] 2xl:w-[600px]">
                            <Command>
                              <CommandInput placeholder="Search product..." />
                              <CommandList>
                                <CommandEmpty>No product found.</CommandEmpty>
                                <CommandGroup>
                                  {products
                                    .toSorted(
                                      (a, b) =>
                                        -(
                                          (a.year ?? "") + (a.group_id ?? "")
                                        ).localeCompare(
                                          (b.year ?? "") + (b.group_id ?? ""),
                                        ) ||
                                        new Date(b.updated_at).getTime() -
                                          new Date(a.updated_at).getTime(),
                                    )
                                    .map((p) => (
                                      <CommandItem
                                        value={p.sku}
                                        key={p.sku}
                                        keywords={[
                                          p.sku,
                                          p.descriptor,
                                          p.year ?? "",
                                          p.type,
                                        ]}
                                        onSelect={() => {
                                          field.handleChange(p.sku);
                                        }}
                                      >
                                        {p.sku} - {p.descriptor}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            p.sku === field.state.value
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {field.state.meta.errors ? (
                          <p className="text-sm text-red-600">
                            {field.state.meta.errors
                              .map((e) => e?.message)
                              .join(", ")}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </Field>
                  <Field
                    name="email"
                    validators={{
                      onChangeListenTo: ["phone"],
                      onChange: ({ value, fieldApi }) => {
                        const phoneValue =
                          fieldApi.form.getFieldValue("phone") ?? "";
                        if (
                          (value ?? "").length === 0 &&
                          phoneValue.length === 0
                        ) {
                          return {
                            message: "Either email or phone number is required",
                          };
                        }
                        const result = z
                          .string()
                          .email("Invalid email")
                          .or(z.literal(""))
                          .safeParse(value);
                        if (!result.success) {
                          return {
                            message: result.error
                              .flatten()
                              .formErrors.join(", "),
                          };
                        }
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          value={field.state.value ?? ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                        />
                        {field.state.meta.errors ? (
                          <p className="text-sm text-red-600">
                            {field.state.meta.errors
                              .map((e) => e?.message)
                              .join(", ")}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </Field>
                  <Field
                    name="phone"
                    validators={{
                      onChangeListenTo: ["email"],
                      onChange: ({ value, fieldApi }) => {
                        const emailValue =
                          fieldApi.form.getFieldValue("email") ?? "";
                        if (
                          (value ?? "").length === 0 &&
                          emailValue.length === 0
                        ) {
                          return {
                            message: "Either email or phone number is required",
                          };
                        }
                        const result = z
                          .string()
                          .length(10, "Phone number must be 10 digits")
                          .regex(
                            /^\d+$/,
                            "Phone number must only contain digits",
                          )
                          .or(z.literal(""))
                          .safeParse(value);
                        if (!result.success) {
                          return {
                            message: result.error
                              .flatten()
                              .formErrors.join(", "),
                          };
                        }
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          value={field.state.value ?? ""}
                          type="tel"
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                        />
                        {field.state.meta.errors ? (
                          <p className="text-sm text-red-600">
                            {field.state.meta.errors
                              .map((e) => e?.message)
                              .join(", ")}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </Field>
                  <Subscribe selector={(state) => [state.values.sku]}>
                    {([sku]) => {
                      const sku_type = products.find(
                        (p) => p.sku === sku,
                      )?.type;
                      return sku_type === "MEMBERSHIP" ? (
                        <>
                          <Field
                            name="street_address"
                            validators={{
                              onChange: z
                                .string()
                                .min(1, "Street address cannot be empty"),
                            }}
                          >
                            {(field) => (
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Street Address
                                </label>
                                <input
                                  value={field.state.value ?? ""}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                                />
                                {field.state.meta.errors ? (
                                  <p className="text-sm text-red-600">
                                    {field.state.meta.errors
                                      .map((e) => e?.message)
                                      .join(", ")}
                                  </p>
                                ) : null}
                              </div>
                            )}
                          </Field>
                          <Field
                            name="city"
                            validators={{
                              onChange: z
                                .string()
                                .min(1, "City cannot be empty"),
                            }}
                          >
                            {(field) => (
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  City
                                </label>
                                <input
                                  value={field.state.value ?? ""}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                                />
                                {field.state.meta.errors ? (
                                  <p className="text-sm text-red-600">
                                    {field.state.meta.errors
                                      .map((e) => e?.message)
                                      .join(", ")}
                                  </p>
                                ) : null}
                              </div>
                            )}
                          </Field>
                          <Field
                            name="state"
                            validators={{
                              onChange: states.schema,
                            }}
                          >
                            {(field) => (
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  State
                                </label>
                                <select
                                  value={field.state.value ?? ""}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                                >
                                  {states.schema.options.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                                {field.state.meta.errors ? (
                                  <p className="text-sm text-red-600">
                                    {field.state.meta.errors
                                      .map((e) => e?.message)
                                      .join(", ")}
                                  </p>
                                ) : null}
                              </div>
                            )}
                          </Field>
                          <Field
                            name="zip_code"
                            validators={{
                              onChange: zip_code.schema,
                            }}
                          >
                            {(field) => (
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Zip Code
                                </label>
                                <input
                                  value={field.state.value ?? ""}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  onBlur={field.handleBlur}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                                />
                                {field.state.meta.errors ? (
                                  <p className="text-sm text-red-600">
                                    {field.state.meta.errors
                                      .map((e) => e?.message)
                                      .join(", ")}
                                  </p>
                                ) : null}
                              </div>
                            )}
                          </Field>
                        </>
                      ) : null;
                    }}
                  </Subscribe>
                  <Field
                    name="amount"
                    validators={{
                      onChange: z
                        .string()
                        .regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Amount<span className="text-red-600">*</span>
                        </label>
                        <input
                          value={field.state.value}
                          type="number"
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                        />
                        {field.state.meta.errors ? (
                          <p className="text-sm text-red-600">
                            {field.state.meta.errors
                              .map((e) => e?.message)
                              .join(", ")}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </Field>
                  <Field
                    name="fee"
                    validators={{
                      onChange: z
                        .string()
                        .regex(/^\d+(\.\d{1,2})?$/, "Invalid fee"),
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Fee<span className="text-red-600">*</span>
                        </label>
                        <input
                          value={field.state.value}
                          type="number"
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                        />
                        {field.state.meta.errors ? (
                          <p className="text-sm text-red-600">
                            {field.state.meta.errors
                              .map((e) => e?.message)
                              .join(", ")}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </Field>

                  <Subscribe selector={(state) => [state.values.sku]}>
                    {([sku]) => {
                      return (
                        products.find((p) => p.sku === sku)?.type ===
                          "MEMBERSHIP" && (
                          <>
                            <Field
                              name="emergency_contact"
                              validators={{
                                onBlurListenTo: ["emergency_contact_phone"],
                                onBlur: ({ value, fieldApi }) => {
                                  if (
                                    (
                                      fieldApi.form.getFieldValue(
                                        "emergency_contact_phone",
                                      ) ?? ""
                                    ).length > 0 &&
                                    (value ?? "").length === 0
                                  ) {
                                    return {
                                      message:
                                        "Name is required if emergency contact phone is provided",
                                    };
                                  }
                                  return undefined;
                                },
                              }}
                            >
                              {(field) => (
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Emergency Contact
                                  </label>
                                  <input
                                    value={field.state.value ?? ""}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    onBlur={field.handleBlur}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                                  />
                                  {field.state.meta.errors ? (
                                    <p className="text-sm text-red-600">
                                      {field.state.meta.errors
                                        .map((e) => e?.message)
                                        .join(", ")}
                                    </p>
                                  ) : null}
                                </div>
                              )}
                            </Field>
                            <Field
                              name="emergency_contact_phone"
                              validators={{
                                onBlurListenTo: ["emergency_contact"],
                                onBlur: ({ value, fieldApi }) => {
                                  if (
                                    (
                                      fieldApi.form.getFieldValue(
                                        "emergency_contact",
                                      ) ?? ""
                                    ).length > 0 &&
                                    (value ?? "").length === 0
                                  ) {
                                    return {
                                      message:
                                        "Phone is required if emergency contact is provided",
                                    };
                                  }

                                  const result = z
                                    .string()
                                    .length(
                                      10,
                                      "Phone number must be 10 digits",
                                    )
                                    .regex(
                                      /^\d+$/,
                                      "Phone number must only contain digits",
                                    )
                                    .or(z.literal(""))
                                    .safeParse(value);

                                  if (!result.success) {
                                    return {
                                      message: result.error
                                        .flatten()
                                        .formErrors.join(", "),
                                    };
                                  }

                                  return undefined;
                                },
                              }}
                            >
                              {(field) => (
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Emergency Contact Phone
                                  </label>
                                  <input
                                    value={field.state.value ?? ""}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    onBlur={field.handleBlur}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                                  />
                                  {field.state.meta.errors ? (
                                    <p className="text-sm text-red-600">
                                      {field.state.meta.errors
                                        .map((e) => e?.message)
                                        .join(", ")}
                                    </p>
                                  ) : null}
                                </div>
                              )}
                            </Field>
                            <Field name="public">
                              {(field) => (
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Display User Publicly
                                  </label>
                                  <input
                                    type="checkbox"
                                    checked={field.state.value ?? true}
                                    onChange={(e) =>
                                      field.handleChange(e.target.checked)
                                    }
                                    className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                                  />
                                </div>
                              )}
                            </Field>
                          </>
                        )
                      );
                    }}
                  </Subscribe>
                  <div className="col-span-2 flex justify-end">
                    <Subscribe
                      selector={(state) => [
                        state.canSubmit,
                        state.isSubmitting,
                      ]}
                      children={([canSubmit, isSubmitting]) => (
                        <button
                          type="submit"
                          className={`cursor-pointer text-sm inline-block max-h-fit max-w-fit rounded-lg px-3 py-1 font-semibold bg-[#E5E7EB] items-center justify-center`}
                          disabled={!canSubmit}
                        >
                          {isSubmitting ? "Adding..." : "Add Mail-In Order"}
                        </button>
                      )}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
