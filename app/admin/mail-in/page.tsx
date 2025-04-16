"use client";

import { useState, useEffect, useMemo } from "react";
import { getRoles, getPermissions, Permission } from "@/app/supabase";
import { MoonLoader } from "react-spinners";
import { Check, ChevronsUpDown } from "lucide-react";
import { ClientOnly } from "@/components/is-client";
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
import { state, zip_code } from "@/app/api/cron/src/validations/schemas";

export default function () {
  return (
    <ClientOnly>
      <Table />
    </ClientOnly>
  );
}

type MailInOrderData = {
  date: Date;
  first_name: string;
  last_name: string;

  email?: string;
  phone?: string;

  street_address: string;
  city: string;
  state: string;
  zip_code: string;

  sku: string;
  amount: string;
  fee: string;

  emergency_contact?: string;
  emergency_contact_phone?: string;
};

function Table() {
  const { Field, handleSubmit, Subscribe } = useForm({
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
      sku: "",
      amount: "",
      fee: "0",
      emergency_contact: "",
      emergency_contact_phone: "",
    } as MailInOrderData,
    onSubmit: async (data) => {
      console.log(data);
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
        setProducts(await skus);
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
      <div className="flex w-full flex-grow flex-col items-center justify-center overflow-y-auto">
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
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    name="email"
                    validators={{
                      onChange: z
                        .string()
                        .email("Invalid email")
                        .or(z.literal("")),
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      onBlur: z
                        .string()
                        .length(10, "Phone number must be 10 digits")
                        .regex(/^\d+$/, "Phone number must only contain digits")
                        .or(z.literal("")),
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          value={field.state.value}
                          type="tel"
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                          Street Address<span className="text-red-600">*</span>
                        </label>
                        <input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      onChange: z.string().min(1, "City cannot be empty"),
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          City<span className="text-red-600">*</span>
                        </label>
                        <input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      onChange: state.schema,
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          State<span className="text-red-600">*</span>
                        </label>
                        <select
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {state.schema.options.map((option) => (
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
                      onBlur: zip_code.schema,
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Zip Code<span className="text-red-600">*</span>
                        </label>
                        <input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                "w-full justify-between rounded-md border border-gray-300 px-3 py-2 text-left focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
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
                                  {products.map((p) => (
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
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      onBlur: z
                        .string()
                        .length(10, "Phone number must be 10 digits")
                        .regex(/^\d+$/, "Phone number must only contain digits")
                        .or(z.literal("")),
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Emergency Contact Phone
                        </label>
                        <input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  <div className="col-span-2 flex justify-end">
                    <Subscribe
                      selector={(state) => [
                        state.canSubmit,
                        state.isSubmitting,
                      ]}
                      children={([canSubmit, isSubmitting]) => (
                        <button
                          type="submit"
                          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
