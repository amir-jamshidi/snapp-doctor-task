import type { Dispatch, SetStateAction } from "react";
import type { IFilters } from "../types/share.types";

interface IFiltersBoxProps {
  categories: string[];
  filters: IFilters;
  onChangeFilter: Dispatch<SetStateAction<IFilters>>;
}
const FiltersBox = ({
  categories,
  filters,
  onChangeFilter,
}: IFiltersBoxProps) => {
  const updateFilter = (field: keyof IFilters, value: string) => {
    onChangeFilter({
      ...filters,
      [field]: value,
    });
  };

  const clearFilters = () => {
    onChangeFilter({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      status: "",
    });
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.status !== "";

  return (
    <div className="bg-gray-100 border w-3xl max-w-3xl border-gray-200 rounded-lg p-6 mb-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <input
          type="text"
          placeholder="Search by name"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-md"
        />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="minPrice"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Min Price
          </label>
          <input
            id="minPrice"
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            min="0"
            className="w-full px-3 py-2 border border-gray-200 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="maxPrice"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Max Price
          </label>
          <input
            id="maxPrice"
            type="number"
            placeholder="Any"
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            min="0"
            className="w-full px-3 py-2 border border-gray-200 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) =>
              updateFilter("status", e.target.value as IFilters["status"])
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100"
          >
            <option value="">All Status</option>
            <option value="AVALIBALE">AVALIBALE</option>
            <option value="NOT-AVALIBALE">NOT-AVALIBALE</option>
          </select>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="border border-red-400 h-10 self-end rounded-md px-4 py-2 cursor-pointer"
          >
            clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FiltersBox;
