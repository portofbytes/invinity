export default function Loading() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="container-page"
      style={{ paddingBlock: "var(--space-192)", minHeight: "60vh" }}
    >
      <div className="max-w-[560px]">
        <p className="eyebrow mb-4">Uncorking</p>
        <h1 className="serif display-l" style={{ opacity: 0.42 }}>
          A moment.
        </h1>
      </div>
    </section>
  );
}
