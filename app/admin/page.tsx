"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
};

type Memo = {
  id: number;
  leadId: number;
  content: string;
  createdAt: string;
};

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 수정 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);

  // 메모 패널 상태
  const [memoLead, setMemoLead] = useState<Lead | null>(null);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [memosLoading, setMemosLoading] = useState(false);
  const [newMemo, setNewMemo] = useState("");
  const [memoSaving, setMemoSaving] = useState(false);

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
      if (memoLead?.id === id) setMemoLead(null);
    } catch {
      alert("삭제에 실패했습니다.");
    }
  }

  async function openMemoPanel(lead: Lead) {
    setMemoLead(lead);
    setNewMemo("");
    setMemosLoading(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}/memos`);
      const data = await res.json();
      setMemos(data);
    } catch {
      setMemos([]);
    } finally {
      setMemosLoading(false);
    }
  }

  function closeMemoPanel() {
    setMemoLead(null);
    setMemos([]);
    setNewMemo("");
  }

  async function handleAddMemo() {
    if (!memoLead || !newMemo.trim()) return;
    setMemoSaving(true);
    try {
      const res = await fetch(`/api/leads/${memoLead.id}/memos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMemo }),
      });
      if (!res.ok) throw new Error();
      const created: Memo = await res.json();
      setMemos((prev) => [created, ...prev]);
      setNewMemo("");
    } catch {
      alert("메모 저장에 실패했습니다.");
    } finally {
      setMemoSaving(false);
    }
  }

  async function handleDeleteMemo(memoId: number) {
    if (!memoLead) return;
    try {
      const res = await fetch(`/api/leads/${memoLead.id}/memos/${memoId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setMemos((prev) => prev.filter((m) => m.id !== memoId));
    } catch {
      alert("메모 삭제에 실패했습니다.");
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
    maxWidth: memoLead ? "1200px" : "900px",
    margin: "0 auto",
    transition: "max-width 0.3s ease",
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

        {/* 메인 레이아웃: 테이블 + 메모 패널 */}
        {!loading && !error && (
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
            {/* 테이블 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {leads.length === 0 ? (
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
                        <tr
                          key={lead.id}
                          style={{
                            background: memoLead?.id === lead.id ? "#f5f3ff" : "transparent",
                          }}
                        >
                          <td style={{ ...tdStyle, color: "#999", fontSize: "13px" }}>{lead.id}</td>
                          <td style={tdStyle}>{lead.name}</td>
                          <td style={tdStyle}>{lead.phone}</td>
                          <td style={tdStyle}>{lead.email}</td>
                          <td style={{ ...tdStyle, fontSize: "13px", color: "#666" }}>
                            {new Date(lead.createdAt).toLocaleString("ko-KR")}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "center" }}>
                            <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                              <button
                                onClick={() =>
                                  memoLead?.id === lead.id ? closeMemoPanel() : openMemoPanel(lead)
                                }
                                style={{
                                  ...btnBase,
                                  background: memoLead?.id === lead.id ? "#ede9fe" : "#f3f4f6",
                                  color: memoLead?.id === lead.id ? "#6d28d9" : "#555",
                                }}
                              >
                                메모
                              </button>
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
              )}
            </div>

            {/* 메모 패널 */}
            {memoLead && (
              <div
                style={{
                  width: "320px",
                  flexShrink: 0,
                  background: "#fafafa",
                  border: "1.5px solid #e5e5e5",
                  borderRadius: "12px",
                  padding: "20px",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>
                      {memoLead.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>
                      {memoLead.phone}
                    </div>
                  </div>
                  <button
                    onClick={closeMemoPanel}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "18px",
                      color: "#999",
                      lineHeight: 1,
                      padding: "2px 6px",
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* 메모 입력 */}
                <div style={{ marginBottom: "16px" }}>
                  <textarea
                    value={newMemo}
                    onChange={(e) => setNewMemo(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddMemo();
                    }}
                    placeholder="메모를 입력하세요... (Cmd+Enter로 저장)"
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1.5px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "13px",
                      color: "#1a1a1a",
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />
                  <button
                    onClick={handleAddMemo}
                    disabled={memoSaving || !newMemo.trim()}
                    style={{
                      width: "100%",
                      marginTop: "8px",
                      padding: "9px",
                      background: memoSaving || !newMemo.trim() ? "#a5b4fc" : "#4f46e5",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 600,
                      border: "none",
                      borderRadius: "8px",
                      cursor: memoSaving || !newMemo.trim() ? "not-allowed" : "pointer",
                    }}
                  >
                    {memoSaving ? "저장 중..." : "메모 추가"}
                  </button>
                </div>

                {/* 메모 목록 */}
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {memosLoading ? (
                    <div style={{ textAlign: "center", padding: "20px 0", color: "#999", fontSize: "13px" }}>
                      불러오는 중...
                    </div>
                  ) : memos.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "20px 0", color: "#bbb", fontSize: "13px" }}>
                      메모가 없습니다.
                    </div>
                  ) : (
                    memos.map((memo) => (
                      <div
                        key={memo.id}
                        style={{
                          background: "#fff",
                          border: "1px solid #e5e5e5",
                          borderRadius: "8px",
                          padding: "12px",
                          marginBottom: "8px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                          <p style={{ margin: 0, fontSize: "13px", color: "#1a1a1a", whiteSpace: "pre-wrap", flex: 1, lineHeight: 1.5 }}>
                            {memo.content}
                          </p>
                          <button
                            onClick={() => handleDeleteMemo(memo.id)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "14px",
                              color: "#ccc",
                              lineHeight: 1,
                              padding: "0 2px",
                              flexShrink: 0,
                            }}
                          >
                            ×
                          </button>
                        </div>
                        <div style={{ fontSize: "11px", color: "#bbb", marginTop: "6px" }}>
                          {new Date(memo.createdAt).toLocaleString("ko-KR")}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
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
