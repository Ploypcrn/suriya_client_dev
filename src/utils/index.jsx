import _ from "lodash";

export const pagingPayload = (pageParams) => {
  return {
    page: pageParams?.pagination?.current ?? 1,
    pageSize: pageParams?.pagination?.pageSize ?? 10,
    sort: {
      property: pageParams?.sorter?.field ?? "",
      direction: pageParams?.sorter?.order === "descend" ? "desc" : "asc",
    },
  };
}

