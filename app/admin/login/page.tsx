"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error ?? "오류가 발생했습니다.");
        setLoading(false);
      }
    } catch {
      setError("오류가 발생했습니다.");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        fontFamily: "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
        background: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          padding: "40px 32px",
          width: "100%",
          maxWidth: "380px",
        }}
      >
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#1a1a1a",
            margin: "0 0 8px 0",
          }}
        >
          관리자 로그인
        </h1>
        <p style={{ fontSize: "14px", color: "#666", margin: "0 0 28px 0" }}>
          비밀번호를 입력하여 관리자 페이지에 접근하세요.
        </p>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "#333",
              marginBottom: "6px",
            }}
          >
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            autoFocus
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1.5px solid #ddd",
              borderRadius: "8px",
              fontSize: "15px",
              color: "#1a1a1a",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: error ? "10px" : "20px",
            }}
          />

          {error && (
            <p
              style={{
                fontSize: "13px",
                color: "#e53e3e",
                margin: "0 0 16px 0",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#a5b4fc" : "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "확인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </main>
  );
}
