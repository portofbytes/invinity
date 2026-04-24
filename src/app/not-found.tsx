import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page" style={{ paddingBlock: "var(--space-192)" }}>
      <div className="max-w-[640px]">
        <p className="eyebrow mb-4">404</p>
        <h1 className="serif display-l">Off the map.</h1>
        <p className="body-l mt-6 max-w-[52ch]">
          The page you were looking for isn&rsquo;t here. Perhaps it was taken back into the cellar. Return to <Link className="link-quiet" href="/">the house</Link> or browse <Link className="link-quiet" href="/wines">the wines</Link>.
        </p>
      </div>
    </section>
  );
}
