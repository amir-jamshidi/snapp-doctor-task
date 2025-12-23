export interface IListItem {
    id: number;
    name: string;
    price: number;
    category: string;
    status: "AVALIBALE" | "NOT-AVALIBALE";
}

export interface IFilters {
    search: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    status: string;
}