import type { SupabaseMemberInsert } from "./types";
import { erase, perform, update } from "./api";

// when we resolve a member conflict, the cases are:
// - different members, keep both
// - same member, keep one and delete other, merge columns done on client side

async function resolve_member_conflict_different_members(
  first_member_id: number,
  second_member_id: number
) {
  return await update.member_conflicts({
    first_member_id,
    second_member_id,
    resolved: true,
  });
}

async function resolve_member_conflict_merge(
  first_member_id: number,
  second_member_id: number,
  merged_member: SupabaseMemberInsert
) {
  delete merged_member.id;
  delete merged_member.created_at;
  delete merged_member.updated_at;

  // update first member with merge info
  await update.member(first_member_id, merged_member);
  // change anything assigned to second member id to be assined to first (except for member_conflicts table itself)
  await perform.remap_member_foreign_keys(second_member_id, first_member_id);
  // delete second member
  await erase.member(second_member_id);
}

export const resolve_member_conflict = {
  different_members: resolve_member_conflict_different_members,
  merge: resolve_member_conflict_merge,
};
