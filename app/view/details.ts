import {useRouter} from "next/navigation";
import {View} from "@/app/schemas/schema";

export const handleShowDetails = (memberId: string, entries: Record<string, any>[], router: ReturnType<typeof useRouter>) => {
    if (!memberId || memberId === "") {
        console.error("No memberId provided");
        return;
    }

    console.log("Show Details", memberId);
    // get the row with the given memberId
    const row = entries.find((entry) => entry.pid === memberId);
    console.log("View Row", row);
    // navigate to the details page
    // pass the row as a prop
    router.push(`/details?row=${encodeURIComponent(JSON.stringify(row))}`);
}

export const handleEditDetails = (memberId: string, entries: Record<string, any>[], selectedView: View, router: ReturnType<typeof useRouter>) => {
    if (!memberId || memberId === "") {
        console.error("No memberId provided");
        return;
    }

    const row = entries.find((entry) => entry.pid === memberId);
    if (!row) {
        console.error("No row found");
        return;
    }

    // add the table name to the row
    row["table_name"] = selectedView?.name || "";
    if (!row["table_name"]) {
        console.error("No table name found");
        return;
    }

    // navigate to the edit page
    // pass the row as a prop
    router.push(`/edit-admin?row=${encodeURIComponent(JSON.stringify(row))}`);
}
