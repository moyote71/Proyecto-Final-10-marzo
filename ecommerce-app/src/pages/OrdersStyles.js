import { cva } from "class-variance-authority";

/* Página */
export const page = cva("p-6 max-w-7xl mx-auto flex flex-col gap-6");
export const pageEmpty = cva(
    "min-h-[60vh] flex flex-col justify-center items-center gap-4 text-center"
);

/* Header */
export const header = cva(
    "flex justify-between items-start flex-wrap gap-4 border-b pb-4"
);

/* Content Grid */
export const content = cva("grid grid-cols-1 md:grid-cols-3 gap-6");

/* LISTA */
export const listCard = cva(
    "bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-4"
);

export const listHeader = cva(
    "flex justify-between items-center text-lg font-medium"
);

export const listBody = cva("flex flex-col divide-y");

/* Order Card */
export const orderCard = cva(
    "text-left w-full p-4 hover:bg-gray-50 transition rounded-md flex flex-col gap-2",
    {
        variants: {
            active: {
                true: "bg-gray-100 border border-gray-300",
                false: "",
            },
        },
    }
);

/* BADGE */
export const statusBadge = cva(
    "px-2 py-1 text-xs rounded-md font-medium capitalize",
    {
        variants: {
            status: {
                confirmed: "bg-green-100 text-green-700",
                shipped: "bg-blue-100 text-blue-700",
                processing: "bg-yellow-100 text-yellow-700",
                cancelled: "bg-red-100 text-red-700",
            },
        },
        defaultVariants: {
            status: "confirmed",
        },
    }
);

/* DETALLE */
export const detailCard = cva(
    "md:col-span-2 bg-white rounded-lg shadow-sm border p-6 flex flex-col gap-6"
);

export const detailHeader = cva(
    "flex justify-between items-start border-b pb-4"
);

/* Sección */
export const section = cva("flex flex-col gap-2");

export const summaryList = cva("flex flex-col gap-2 text-sm");

export const address = cva("not-italic flex flex-col gap-1 text-sm");

export const itemsList = cva(
    "flex flex-col gap-4 py-2 border-t mt-2 text-sm"
);
