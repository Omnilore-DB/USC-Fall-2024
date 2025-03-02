import { getLastSyncTime, getMembers } from "../src/db";
import { apiResponse } from "../src/utils";

export async function POST() {
  return apiResponse(async () => {
    const lastUpdated = await getLastSyncTime("members");
    const now = new Date().toISOString();

    const members = await getMembers();

    return Response.json({
      lastUpdated,
      now,
      members,
    });
  });
}
