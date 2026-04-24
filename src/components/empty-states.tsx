import Link from "next/link";

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="py-24 text-center reveal max-w-[52ch] mx-auto">
      <p className="serif display-l">{title}</p>
      <p className="body-l mt-5">{body}</p>
      {action && (
        <p className="mt-10">
          <Link href={action.href} className="btn">{action.label}</Link>
        </p>
      )}
    </div>
  );
}
