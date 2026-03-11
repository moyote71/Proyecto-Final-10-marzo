import { cva } from "class-variance-authority";

const container = cva(
    "w-full flex justify-center mt-6 px-4"
);

const card = cva(
    "w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-6"
);

const header = cva(
    "flex items-center gap-4 pb-4 border-b"
);

const avatar = cva(
    "w-20 h-20 rounded-full object-cover border shadow-sm"
);

const names = cva(
    "flex flex-col gap-1"
);

const roleBadge = cva(
    "text-white text-xs px-3 py-1 rounded-full capitalize inline-block w-fit"
);

const info = cva(
    "grid grid-cols-1 gap-3"
);

const infoItem = cva(
    "flex justify-between border-b pb-2 text-sm text-gray-700"
);

const actions = cva(
    "mt-4 flex flex-col gap-3 pt-4 border-t"
);

const ProfileCardStyles = {
    container,
    card,
    header,
    avatar,
    names,
    roleBadge,
    info,
    infoItem,
    actions,
};

export default ProfileCardStyles;
