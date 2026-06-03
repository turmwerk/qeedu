import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { isChunkLoadError, recoverFromChunkLoadError } from "@/utils/chunkRecovery";

const getErrorMessage = (error: unknown): string => {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown application error";
};

const RouteErrorElement: React.FC = () => {
  const error = useRouteError();
  const message = getErrorMessage(error);
  const isAssetError = isChunkLoadError(error);

  React.useEffect(() => {
    if (isAssetError) {
      recoverFromChunkLoadError(error);
    }
  }, [error, isAssetError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-bg)] px-6 py-10 text-[var(--brand-text)]">
      <div className="w-full max-w-xl rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6 shadow-[var(--brand-shadow)]">
        <div className="text-sm font-semibold uppercase tracking-wide text-[var(--brand-accent)]">
          QeEdu
        </div>
        <h1 className="mt-3 text-2xl font-bold">
          {isAssetError ? "New version is loading" : "Page failed to load"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--brand-text-muted)]">
          {isAssetError
            ? "This page was opened with an older application bundle. Reload to fetch the latest assets."
            : "The application hit an unexpected route error. You can reload or return home."}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg border border-[var(--brand-accent)] px-4 py-2 text-sm font-semibold text-[var(--brand-accent)] transition hover:bg-[var(--brand-accent-soft)]"
          >
            Reload
          </button>
          <button
            type="button"
            onClick={() => window.location.assign("/")}
            className="rounded-lg border border-[var(--brand-border)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
          >
            Home
          </button>
        </div>
        {message && (
          <pre className="mt-5 max-h-40 overflow-auto rounded-lg bg-black/5 p-3 text-xs text-[var(--brand-text-muted)]">
            {message}
          </pre>
        )}
      </div>
    </div>
  );
};

export default RouteErrorElement;
