// conver the name of Views to the name of the tables

export const viewToTable = (viewName: string) => {
  const mapper: Record<string, string> = {
    "Members (general member)": "members",
    "Members (admin)": "members",
    Committees: "committees",
    "Committee Members": "committee_members",
    "Committee Member Roles": "committee_member_roles",
  };

  return mapper[viewName] || viewName;
};
