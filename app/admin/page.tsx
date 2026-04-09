"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
};

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      })
      .catch(() => {
        setError("데이터를 불러오지 못했습니다.");
        setLoading(false);
      });
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  function openEditModal(lead: Lead) {
    setEditTarget(lead);
    setEditForm({ name: lead.name, phone: lead.phone, email: lead.email });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
  }

  async function handleSave() {
    if (!editTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${editTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error();
      const updated: Lead = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      closeModal();
    } catch {
      alert("수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch {
      alert("삭제에 실패했습니다.");
    }
  }

  const containerStyle: React.CSSProperties = {
    fontFamily: "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
    background: "#f5f5f5",
    minHeight: "100vh",
    padding: "40px 24px",
    boxSizing: "border-box",
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
    padding: "32px",
    maxWidth: "900px",
    margin: "0 auto",
  };

  const thStyle: React.CSSProperties = {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 600,
    color: "#333",
    background: "#f5f5f5",
    borderBottom: "1px solid #e5e5e5",
  };

  const tdStyle: React.CSSProperties = {
    padding: "14px 16px",
    fontSize: "14px",
    color: "#1a1a1a",
    borderBottom: "1px solid #f0f0f0",
    verticalAlign: "middle",
  };

  const btnBase: React.CSSProperties = {
    padding: "6px 14px",
    fontSize: "13px",
    fontWeight: 600,
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    color: "#1a1a1a",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <main style={containerStyle}>
      <div style={cardStyle}>
        {/* 헤더 */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
              관리자 페이지
            </h1>
            {!loading && !error && (
              <span
                style={{
                  background: "#4f46e5",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: "999px",
                }}
              >
                총 {leads.length}명
              </span>
            )}
            <button
              onClick={handleLogout}
              style={{
                marginLeft: "auto",
                padding: "6px 14px",
                fontSize: "13px",
                fontWeight: 600,
                background: "#f5f5f5",
                color: "#666",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              로그아웃
            </button>
          </div>
          <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
            수집된 리드 목록을 확인하고 관리하세요.
          </p>
        </div>

        {/* 상태 */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#666", fontSize: "14px" }}>
            불러오는 중...
          </div>
        )}
        {error && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#e53e3e", fontSize: "14px" }}>
            {error}
          </div>
        )}

        {/* 테이블 */}
        {!loading && !error && (
          leads.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#999", fontSize: "14px" }}>
              등록된 리드가 없습니다.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>번호</th>
                    <th style={thStyle}>이름</th>
                    <th style={thStyle}>전화번호</th>
                    <th style={thStyle}>이메일</th>
                    <th style={thStyle}>등록일</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td style={{ ...tdStyle, color: "#999", fontSize: "13px" }}>{lead.id}</td>
                      <td style={tdStyle}>{lead.name}</td>
                      <td style={tdStyle}>{lead.phone}</td>
                      <td style={tdStyle}>{lead.email}</td>
                      <td style={{ ...tdStyle, fontSize: "13px", color: "#666" }}>
                        {new Date(lead.createdAt).toLocaleString("ko-KR")}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button
                            onClick={() => openEditModal(lead)}
                            style={{ ...btnBase, background: "#4f46e5", color: "#fff" }}
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            style={{ ...btnBase, background: "#fee2e2", color: "#e53e3e" }}
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* 수정 모달 */}
      {modalOpen && editTarget && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
              padding: "32px",
              width: "100%",
              maxWidth: "420px",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a", marginTop: 0, marginBottom: "24px" }}>
              리드 수정
            </h2>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px" }}>
                이름
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px" }}>
                전화번호
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px" }}>
                이메일
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: saving ? "#a5b4fc" : "#4f46e5",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "8px",
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={closeModal}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#f5f5f5",
                  color: "#333",
                  fontSize: "15px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
