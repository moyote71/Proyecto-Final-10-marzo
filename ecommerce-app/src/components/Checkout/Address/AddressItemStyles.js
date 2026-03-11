export const container = (isSelected, isDefault) =>
    `w-full rounded-xl border p-4 shadow-sm transition bg-white/90 backdrop-blur
${isSelected ? "border-blue-500 shadow-md" : "border-gray-300"}
${isDefault ? "bg-blue-50" : ""}`;

export const title =
    `text-lg font-semibold text-gray-800`;

export const text =
    `text-gray-600`;

export const defaultBadge =
    `inline-block mt-2 px-2 py-1 text-xs font-medium 
bg-blue-600 text-white rounded-md`;

export const actions =
    `flex flex-wrap gap-3`;

