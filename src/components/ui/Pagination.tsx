import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  // Build visible page numbers: always show first, last, current ±1, with ellipsis
  const pages: (number | "…")[] = [];
  const delta = 1;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.info}>
        Showing {start}–{end} of {total.toLocaleString()}
      </span>

      <div className={styles.controls}>
        <button
          className={styles.btn}
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          title="First page"
          aria-label="First page"
        >
          «
        </button>
        <button
          className={styles.btn}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          title="Previous page"
          aria-label="Previous page"
        >
          ‹
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={p}
              className={`${styles.btn} ${p === page ? styles.btnActive : ""}`}
              onClick={() => typeof p === "number" && onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          ),
        )}

        <button
          className={styles.btn}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          title="Next page"
          aria-label="Next page"
        >
          ›
        </button>
        <button
          className={styles.btn}
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          title="Last page"
          aria-label="Last page"
        >
          »
        </button>
      </div>
    </div>
  );
}
