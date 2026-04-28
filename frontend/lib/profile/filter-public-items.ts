function getTitleFromItem(item: any) {
  return item?.title ?? item?.media ?? item;
}

function getTitleName(item: any) {
  const title = getTitleFromItem(item);

  return (
    title?.title ||
    title?.name ||
    title?.original_title ||
    title?.original_name ||
    item?.title_name ||
    ""
  );
}

function getMediaType(item: any) {
  const title = getTitleFromItem(item);
  return title?.media_type || title?.type || item?.media_type || "";
}

function getRating(item: any) {
  return Number(item?.rating ?? item?.user_rating ?? 0);
}

function getDateValue(item: any) {
  return new Date(
    item?.updated_at ||
      item?.watched_at ||
      item?.created_at ||
      item?.added_at ||
      0,
  ).getTime();
}

export function filterPublicTitleItems(
  items: unknown[],
  searchParams: {
    q?: string;
    type?: string;
    sort?: string;
  },
) {
  const query = (searchParams.q ?? "").trim().toLowerCase();
  const type = searchParams.type ?? "all";
  const sort = searchParams.sort ?? "recent";
  let result = [...items];

  if (query) {
    result = result.filter((item) =>
      getTitleName(item).toLowerCase().includes(query),
    );
  }

  if (type !== "all") {
    result = result.filter((item) => getMediaType(item) === type);
  }

  result.sort((a, b) => {
    if (sort === "title") {
      return getTitleName(a).localeCompare(getTitleName(b));
    }

    if (sort === "rating_desc") {
      return getRating(b) - getRating(a);
    }

    if (sort === "rating_asc") {
      return getRating(a) - getRating(b);
    }

    return getDateValue(b) - getDateValue(a);
  });

  return result;
}
