export type FilterCounts = {
  total: number;
  byProvince: Record<string, number>;
  byDistrict: Record<string, number>;
  byCategory: Record<string, number>;
};
