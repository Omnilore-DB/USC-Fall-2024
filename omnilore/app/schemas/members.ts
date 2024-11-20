import {supabase} from "@/app/supabase";
import {CompositeType, View, Report} from "@/app/schemas/schema";
import { filter_splitOrdersBySKU, Order } from "@/app/utils/orderUtils";

export const memberViews: View[] = [
    {
        name: "Members (general member)",
        priority: 1,
        roles: ["member"],
        schema: {
            type: "composite",
            columns: {
                pid: {type: "basic", name: "int", nullable: false},
                first_name: {type: "basic", name: "text", nullable: true},
                last_name: {type: "basic", name: "text", nullable: true},
                street_address: {type: "basic", name: "text", nullable: true},
                city: {type: "basic", name: "text", nullable: true},
                state: {type: "basic", name: "text", nullable: true},
                zip: {type: "basic", name: "text", nullable: true},
                phone: {type: "basic", name: "text", nullable: true},
                email: {type: "basic", name: "text", nullable: true},
                photo_link: {type: "basic", name: "text", nullable: true},
            },
        },
        query_function: async (): Promise<any> => {
            const {data, error} = await supabase
                .from("members")
                .select(
                    "pid, first_name, last_name, street_address, city, state, zip, phone, email, photo_link"
                )
                .order("pid", {ascending: true});
            if (error) throw error;
            return data;
        },
        upsert_function: null,
        delete_function: null,
    },
    {
        name: "Members (treasurer)",
        priority: 1,
        roles: ["treasurer"],
        schema: {
            type: "composite",
            columns: {
                pid: {type: "basic", name: "int", nullable: false},
                first_name: {type: "basic", name: "text", nullable: true},
                last_name: {type: "basic", name: "text", nullable: true},
                street_address: {type: "basic", name: "text", nullable: true},
                city: {type: "basic", name: "text", nullable: true},
                state: {type: "basic", name: "text", nullable: true},
                zip: {type: "basic", name: "text", nullable: true},
                phone: {type: "basic", name: "text", nullable: true},
                email: {type: "basic", name: "text", nullable: true},
                photo_link: {type: "basic", name: "text", nullable: true},
            },
        },
        query_function: async (): Promise<any> => {
            const {data, error} = await supabase
                .from("members")
                .select(
                    "pid, first_name, last_name, street_address, city, state, zip, phone, email, photo_link"
                )
                .order("pid", {ascending: true});
            if (error) throw error;
            return data;
        },
        upsert_function: null,
        delete_function: null,
    },
    {
        name: "Members (admin)",
        priority: 2,
        roles: ["admin"],
        schema: {
            type: "composite",
            columns: {
                pid: {type: "basic", name: "int", nullable: false},
                first_name: {type: "basic", name: "text", nullable: true},
                last_name: {type: "basic", name: "text", nullable: true},
                street_address: {type: "basic", name: "text", nullable: true},
                city: {type: "basic", name: "text", nullable: true},
                state: {type: "basic", name: "text", nullable: true},
                zip: {type: "basic", name: "text", nullable: true},
                phone: {type: "basic", name: "text", nullable: true},
                email: {type: "basic", name: "text", nullable: true},
                emergency_contact: {type: "basic", name: "text", nullable: true},
                emergency_contact_phone: {type: "basic", name: "text", nullable: true},
                member_status: {type: "basic", name: "text", nullable: true},
                expiration_date: {type: "basic", name: "date", nullable: true},
                date_of_birth: {type: "basic", name: "date", nullable: true},
                deceased_date: {type: "basic", name: "date", nullable: true},
                public: {type: "basic", name: "boolean", nullable: true},
                orientation_date: {type: "basic", name: "date", nullable: true},
                date_joined: {type: "basic", name: "date", nullable: true},
                notes: {type: "basic", name: "text", nullable: true},
                photo_link: {type: "basic", name: "text", nullable: true},
            },
        },
        query_function: async (): Promise<any> => {
            const {data, error} = await supabase
                .from("members")
                .select(
                    "pid, first_name, last_name, street_address, city, state, zip, phone, email, emergency_contact, emergency_contact_phone, member_status, expiration_date, date_of_birth, deceased_date, public, orientation_date, date_joined, notes, photo_link"
                )
                .order("pid", {ascending: true});
            if (error) throw error;
            return data;
        },
        upsert_function: async (value: any): Promise<any> => {
            const {data, error} = await supabase
                .from("members")
                .upsert(value);
            if (error) throw error;
            return data;
        },
        delete_function: async (pid: any): Promise<any> => {
            const {data, error} = await supabase
                .from("members")
                .delete()
                .eq("pid", pid);
            if (error) throw error;
            return data;
        },
    },
    {
        name: "Members (registrar)",
        priority: 1,
        roles: ["registrar"],
        schema: {
            type: "composite",
            columns: {
                pid: {type: "basic", name: "int", nullable: false},
                first_name: {type: "basic", name: "text", nullable: true},
                last_name: {type: "basic", name: "text", nullable: true},
                street_address: {type: "basic", name: "text", nullable: true},
                city: {type: "basic", name: "text", nullable: true},
                state: {type: "basic", name: "text", nullable: true},
                zip: {type: "basic", name: "text", nullable: true},
                phone: {type: "basic", name: "text", nullable: true},
                email: {type: "basic", name: "text", nullable: true},
                emergency_contact: {type: "basic", name: "text", nullable: true},
                emergency_contact_phone: {type: "basic", name: "text", nullable: true},
                member_status: {type: "basic", name: "text", nullable: true},
                expiration_date: {type: "basic", name: "date", nullable: true},
                date_of_birth: {type: "basic", name: "date", nullable: true},
                deceased_date: {type: "basic", name: "date", nullable: true},
                public: {type: "basic", name: "boolean", nullable: true},
                orientation_date: {type: "basic", name: "date", nullable: true},
                date_joined: {type: "basic", name: "date", nullable: true},
                notes: {type: "basic", name: "text", nullable: true},
                photo_link: {type: "basic", name: "text", nullable: true},
            },
        },
        query_function: async (): Promise<any> => {
            const {data, error} = await supabase
                .from("members")
                .select(
                    "pid, first_name, last_name, street_address, city, state, zip, phone, email, emergency_contact, emergency_contact_phone, member_status, expiration_date, date_of_birth, deceased_date, public, orientation_date, date_joined, notes, photo_link"
                )
                .order("pid", {ascending: true});
            if (error) throw error;
            return data;
        },
        upsert_function: null,
        delete_function: null,
    },
];

const fromDate = new Date('1990-01-01');
const toDate = new Date();

export const membershipReports: Report[] = [
    {
        name: "Membership",
        priority: 1,
        roles: ["treasurer", "admin", "registrar"],
        schema: {
            type: "composite",
            columns: {
                user_names: { type: "basic", name: "text", nullable: false },
                user_emails: { type: "basic", name: "text", nullable: false },
                date: { type: "basic", name: "timestamp", nullable: false },
                product_description: { type: "basic", name: "text", nullable: false },
                skus: { type: "basic", name: "text", nullable: false },
                user_amounts: { type: "basic", name: "int", nullable: false },
                fee: { type: "basic", name: "int", nullable: false },
                payment_platform: { type: "basic", name: "text", nullable: false },
                sqsp_transaction_id: { type: "basic", name: "text", nullable: false },
                sqsp_order_id: { type: "basic", name: "text", nullable: false },
                external_transaction_id: { type: "basic", name: "text", nullable: false },
            },
        },
        query_function: createMembershipReportsQueryFunction,
        upsert_function: null,
        delete_function: null,
    },
];  

    export async function createMembershipReportsQueryFunction(fromDate: Date, toDate: Date): Promise<any> {
        // Step 1: Query the products table
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('description, sku, pid')
            .ilike('description', 'membership%');

        if (productsError) throw productsError;

        const productSkus = products.map(product => product.sku);

        // Step 2: Query the orders table
        console.log("fromDate.toISOString()", fromDate.toISOString(), "toDate.toISOString()", toDate.toISOString());
        
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('user_names, user_emails, date, skus, user_amounts, fee, payment_platform, sqsp_transaction_id, sqsp_order_id, external_transaction_id, created_at, updated_at, amount')
            .or(productSkus.map(sku => `skus.cs.{${sku}}`).join(','))
            .gte('date', fromDate.toISOString())
            .lte('date', toDate.toISOString());

        if (ordersError) throw ordersError;
        // console.log("orders: ", orders);


        const ordersData: Order[] = orders.map(order => ({
            created_at: order.created_at,
            updated_at: order.updated_at,
            sqsp_transaction_id: order.sqsp_transaction_id,
            sqsp_order_id: order.sqsp_order_id,
            user_emails: order.user_emails,
            amount: order.amount,
            date: order.date,
            skus: order.skus,
            payment_platform: order.payment_platform,
            fee: order.fee,
            external_transaction_id: order.external_transaction_id,
            user_names: order.user_names,
            user_amounts: order.user_amounts
        }));
        console.log("ordersData: ", ordersData);
        
        const filteredOrders = filter_splitOrdersBySKU(ordersData, productSkus);
        console.log("filteredOrders: ", filteredOrders);

        
        // Step 3: Map product descriptions to orders
        const ordersWithDescriptions = filteredOrders.map(order => {
            const product = products.find(p => p.sku === order.skus);
            const description = product ? product.description : '';
            return {
                ...order,
                product_description: description // Add product description
            };
        });

        console.log("ordersWithDescriptions: ", ordersWithDescriptions);
        return ordersWithDescriptions;
    }