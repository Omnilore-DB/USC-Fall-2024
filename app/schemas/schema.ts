import {getRoles, supabase} from "@/app/supabase";

export type BasicType = {
    type: "basic";
    name: "text" | "int" | "float" | "boolean" | "date" | "timestamp" | "varchar" | "_varchar"| "double precision";
    nullable: boolean;
}
export type CompositeType = {
    type: "composite";
    columns: Record<string, Schema>;
}
export type EnumType = {
    type: "enum";
    values: string[];
}
export type ArrayType = {
    type: "array";
    element: Schema;
};
export type Schema = BasicType | CompositeType | EnumType | ArrayType;

export interface View {
    name: string;
    priority: number;
    roles: ("member" | "treasurer" | "admin" | "registrar")[];
    schema: CompositeType;
    query_function: () => Promise<any>;
    upsert_function: ((value: any) => Promise<any>) | null;
    delete_function: ((pid: any) => Promise<any>) | null;
}

export interface Report extends View {
    query_function: (...args: any[]) => Promise<any>;
}

export async function getAccessibleViews(views: View[]): Promise<View[]> {
    const roles = await getRoles() ?? [];
    return views
        .filter(view => view.roles.some(role => roles.includes(role)))
        .sort((a, b) => b.priority - a.priority);
}
