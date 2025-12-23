import type { IListItem } from "../types/share.types";

interface IListItemProps {
  item: IListItem;
}

const ListItem = ({ item }: IListItemProps) => {
  return (
    <div className="h-12.5 bg-gray-100 border-b border-b-gray-300  flex items-center px-4 gap-x-3">
      <div>
        <span className="w-10 h-10 rounded-full font-semibold bg-blue-200 flex justify-center items-center">
          {item.id}
        </span>
      </div>
      <div className="w-full">
        <div className="flex items-center w-full justify-between">
          <p className="text-sm font-semibold">{item.name}</p>
          <div className="flex gap-x-1">
            <span className="text-xs bg-indigo-500 text-white px-2 rounded">
              {item.category}
            </span>
            <span
              className={`text-xs text-white px-2 rounded ${
                item.status === "AVALIBALE" ? "bg-green-400" : "bg-red-400"
              }`}
            >
              {item.status}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600">${item.price}</p>
      </div>
    </div>
  );
};

export default ListItem;
