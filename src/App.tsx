import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "./hooks/useDebounce";
import { generateMockData } from "./utils/generateMockData";
import VirtualList from "./components/VirtualList";
import FiltersBox from "./components/FiltersBox";
import ListItem from "./components/ListItem";
import type { IFilters, IListItem } from "./types/share.types";
import { filterData } from "./utils/filterData";

const initalFilters: IFilters = {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  status: "",
};

const App = () => {
  const [data] = useState(() => generateMockData(5000));
  const [filters, setFilters] = useState<IFilters>(initalFilters);
  
  const searchFilterDebounce = useDebounce(filters.search, 500);
  const minPriceFilterDebounce = useDebounce(filters.minPrice, 500);
  const maxPriceFilterDebounce = useDebounce(filters.maxPrice, 500);

  const filterItems = useMemo(() => {
    return filterData(data, {
      ...filters,
      search: searchFilterDebounce,
      minPrice: minPriceFilterDebounce,
      maxPrice: maxPriceFilterDebounce,
    });
  }, [
    data,
    filters,
    searchFilterDebounce,
    minPriceFilterDebounce,
    maxPriceFilterDebounce,
  ]);
  // all filter fields affect the result so we depend on the filters object itself

  const categories = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.category)));
  }, [data]);

  const renderListItem = useCallback((item: IListItem) => {
    return <ListItem item={item} />;
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-8">
      <FiltersBox
        categories={categories}
        filters={filters}
        onChangeFilter={setFilters}
      />
      <div className="max-w-3xl w-3xl">
        <VirtualList
          className="w-full rounded-xl"
          height={400}
          itemHeight={50}
          items={filterItems}
          moreScan={5}
          renderListItem={renderListItem}
        />
      </div>
      <p>Count : {filterItems.length}</p>
    </div>
  );
};

export default App;
