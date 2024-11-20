import { membershipReports, memberViews } from "@/app/schemas/members";
import { referralViews } from "@/app/schemas/referrals";
import { committeeViews } from "@/app/schemas/committes";
import { committeeMembersViews } from "@/app/schemas/commiteeMembers";
import { leadershipViews } from "@/app/schemas/leadership";
import { leadershipPositionsViews } from "@/app/schemas/leadershipPositions";
import { sdgsViews } from "@/app/schemas/sdgs";
import { sdgMembersViews } from "@/app/schemas/sdgMembers";
import { forumsReports, forumsViews } from "@/app/schemas/forums";
import { forumsAttendeesViews } from "@/app/schemas/forumAttendees";
import { roleViews } from "@/app/schemas/roles";
import { ordersViews } from "@/app/schemas/orders";
import { View } from "@/app/schemas/schema";

export const allViews = {
  Members: memberViews,
  Orders: ordersViews,
  Referral: referralViews,
  Committee: committeeViews,
  CommitteeMembers: committeeMembersViews,
  Leadership: leadershipViews,
  LeadershipPositions: leadershipPositionsViews,
  SDGs: sdgsViews,
  SDGMembers: sdgMembersViews,
  Forums: forumsViews,
  Roles: roleViews,
};

export const allReports = {
  Forum: forumsReports,
  Membership: membershipReports,
}

export const allViewsByNames = Object.values(allViews)
    .flatMap(views => views)
    .reduce((acc, view) => ({
      ...acc,
      [view.name]: view
    }), {} as Record<string, View>);
