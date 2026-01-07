"use client";

import { useEffect } from "react";

/**
 * Global Error Boundary
 * 捕获整个应用的错误，包括 layout 中的错误
 * 必须定义自己的 <html> 和 <body> 标签
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录错误到日志服务
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
          <div style={{
            maxWidth: "28rem",
            width: "100%",
            textAlign: "center",
            padding: "2rem",
            backgroundColor: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
          }}>
            <div style={{
              width: "4rem",
              height: "4rem",
              margin: "0 auto 1rem",
              backgroundColor: "#fee2e2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <svg
                style={{ width: "2rem", height: "2rem", color: "#dc2626" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#dc2626", marginBottom: "0.5rem" }}>
              Application Error
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
              A critical error occurred. Please refresh the page or contact support.
            </p>

            <div style={{ marginBottom: "1.5rem", padding: "0.75rem", backgroundColor: "#f9fafb", borderRadius: "0.375rem" }}>
              <p style={{ fontSize: "0.875rem", color: "#374151" }}>
                {error.message || "Unknown error"}
              </p>
            </div>

            <button
              onClick={reset}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer",
                marginBottom: "0.5rem"
              }}
            >
              Try Again
            </button>

            <button
              onClick={() => window.location.href = "/"}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                backgroundColor: "white",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Go to Home
            </button>

            {process.env.NODE_ENV === "development" && (
              <details style={{ marginTop: "1rem", textAlign: "left" }}>
                <summary style={{ fontSize: "0.75rem", color: "#6b7280", cursor: "pointer" }}>
                  Error Details
                </summary>
                <pre style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "0.375rem",
                  fontSize: "0.75rem",
                  overflow: "auto"
                }}>
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
