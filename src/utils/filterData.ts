import type { IFilters, IListItem } from "../types/share.types"

export const filterData = (data: IListItem[], filters: IFilters): IListItem[] => {
    return data.filter(itm => {

        if (filters.search.trim()) {
            const normalWord = filters.search.toLowerCase();
            if (!itm.name.toLowerCase().includes(normalWord)) return false

        }

        if (filters.category) {
            const normalCategory = filters.category.toLowerCase();
            if (!itm.category.toLowerCase().includes(normalCategory)) return false

        }

        if (filters.status) {
            const normalStatus = filters.status.toLowerCase()
            if (itm.status.toLowerCase() !== normalStatus) return false

        }

        if (filters.minPrice) {
            const minPrice = parseInt(filters.minPrice)
            if (!isNaN(minPrice) && itm.price < minPrice) return false
        }

        if (filters.maxPrice) {
            const maxPrice = parseInt(filters.maxPrice)
            if (!isNaN(maxPrice) && itm.price > maxPrice) return false
        }

        return true
    })
}