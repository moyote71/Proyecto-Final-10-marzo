import { cva } from "class-variance-authority";

const container = cva(
    "w-full max-w-6xl mx-auto px-4 py-6"
);

const header = cva(
    "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b"
);

const title = cva(
    "text-2xl font-bold text-gray-900"
);

const description = cva(
    "text-gray-600 text-sm max-w-lg"
);

const controls = cva(
    "flex items-center gap-3"
);

const select = cva(
    "border rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
);

const sortBtn = cva(
    "px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition"
);

const message = cva(
    "p-6 text-center text-gray-700"
);

const SearchResultsListStyles = {
    container,
    header,
    title,
    description,
    controls,
    select,
    sortBtn,
    message,
};

export default SearchResultsListStyles;
