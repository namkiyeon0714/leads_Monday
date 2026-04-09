"use client";

import { useState } from "react";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({ name: false, phone: false, email: false });

  function handlePhone(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length <= 3) {
      // do nothing
    } else if (v.length <= 7) {
      v = v.slice(0, 3) + "-" + v.slice(3);
    } else {
      v = v.slice(0, 3) + "-" + v.slice(3, 7) + "-" + v.slice(7, 11);
    }
    setForm((f) => ({ ...f, phone: v }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {
      name: !form.name.trim(),
      phone: !phoneRegex.test(form.phone),
      email: !emailRegex.test(form.email),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSubmitted(true);
  }

  return (
    <main
      style={{
        fontFamily: "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
        background: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        margin: 0,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          padding: "40px",
          width: "100%",
          maxWidth: "480px",
        }}
      >
        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
            <h2 style={{ fontSize: "20px", color: "#1a1a1a", marginBottom: "8px" }}>제출 완료!</h2>
            <p style={{ fontSize: "14px", color: "#666" }}>
              입력하신 정보가 접수되었습니다.
              <br />곧 연락드리겠습니다.
            </p>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>
              문의하기
            </h1>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "32px" }}>
              아래 정보를 입력해 주시면 빠르게 연락드리겠습니다.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* 이름 */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px" }}>
                  이름 <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="홍길동"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: `1.5px solid ${errors.name ? "#e53e3e" : "#ddd"}`,
                    borderRadius: "8px",
                    fontSize: "15px",
                    color: "#1a1a1a",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {errors.name && (
                  <div style={{ fontSize: "12px", color: "#e53e3e", marginTop: "4px" }}>이름을 입력해 주세요.</div>
                )}
              </div>

              {/* 전화번호 */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px" }}>
                  전화번호 <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={form.phone}
                  onChange={handlePhone}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: `1.5px solid ${errors.phone ? "#e53e3e" : "#ddd"}`,
                    borderRadius: "8px",
                    fontSize: "15px",
                    color: "#1a1a1a",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {errors.phone && (
                  <div style={{ fontSize: "12px", color: "#e53e3e", marginTop: "4px" }}>올바른 전화번호를 입력해 주세요.</div>
                )}
              </div>

              {/* 이메일 */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px" }}>
                  이메일 <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: `1.5px solid ${errors.email ? "#e53e3e" : "#ddd"}`,
                    borderRadius: "8px",
                    fontSize: "15px",
                    color: "#1a1a1a",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {errors.email && (
                  <div style={{ fontSize: "12px", color: "#e53e3e", marginTop: "4px" }}>올바른 이메일 주소를 입력해 주세요.</div>
                )}
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#4f46e5",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginTop: "8px",
                }}
              >
                제출하기
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
