import {
  getLastSyncTime,
  getMembers,
  getTransactionsAfterDate,
} from "../src/db";
import { apiResponse } from "../src/utils";

export async function POST() {
  return apiResponse(async () => {
    const now = new Date().toISOString();
    const lastUpdated = await getLastSyncTime("members");

    const ts = (await getTransactionsAfterDate(lastUpdated)).filter(
      t => t.parsed_form_data.length > 0 && t.issues.length > 0
    );
    // const members = await getMembers();

    return Response.json({
      lastUpdated,
      now,
      ts,
    });
  });
}
