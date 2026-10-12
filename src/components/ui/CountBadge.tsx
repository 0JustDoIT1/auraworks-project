type CountBadgeProps = {
  count: number;
};

export default function CountBadge({ count }: CountBadgeProps) {
  if (count <= 0) return null;

  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}
