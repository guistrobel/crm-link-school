"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovoMentorPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nome: "", email: "", especialidade: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mentores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erro ao criar mentor");
      router.push("/mentores");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
          <Link href="/mentores" className="hover:text-blue-600">Mentores</Link>
          <span>/</span>
          <span className="text-slate-600">Novo Mentor</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Cadastrar Mentor</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
        {[
          { key: "nome", label: "Nome completo *", required: true },
          { key: "email", label: "Email *", type: "email", required: true },
          { key: "especialidade", label: "Especialidade" },
          { key: "password", label: "Senha inicial", type: "password" },
        ].map(({ key, label, type = "text", required }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <input
              type={type}
              required={required}
              value={(form as any)[key]}
              onChange={set(key)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="bg-blue-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50">
            {loading ? "Salvando..." : "Cadastrar Mentor"}
          </button>
          <Link href="/mentores" className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
