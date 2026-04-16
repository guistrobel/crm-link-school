"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STAGES = [
  { value: "LEAD_FRIO", label: "Lead Frio" },
  { value: "INSCRITO_ONBOARDING", label: "Inscrito / Onboarding" },
  { value: "ATIVO_PREP", label: "Ativo — PREP" },
  { value: "ATIVO_CASE", label: "Ativo — Case" },
  { value: "ATIVO_ENTREVISTA", label: "Ativo — Entrevista" },
  { value: "ODP_OKRS_DEFINIDOS", label: "ODP — OKRs Definidos" },
  { value: "ODP_EM_ANDAMENTO", label: "ODP — Em Andamento" },
  { value: "ODP_PITCH_FINAL", label: "ODP — Pitch Final" },
  { value: "CONCLUIDO", label: "Concluído" },
  { value: "APROVADO", label: "Aprovado" },
  { value: "REPROVADO", label: "Reprovado" },
  { value: "DESISTIU", label: "Desistiu" },
];

const CANAIS = [
  { value: "INDICACAO", label: "Indicação" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "EVENTO", label: "Evento" },
  { value: "GOOGLE", label: "Google" },
  { value: "OUTRO", label: "Outro" },
];

export default function NovoAlunoPage() {
  const router = useRouter();
  const [mentores, setMentores] = useState<{ id: string; nome: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nome: "", email: "", telefone: "", cursoInteresse: "",
    dataMatricula: "", status: "LEAD_FRIO", canalOrigem: "",
    mentorId: "", observacoes: "",
  });

  useEffect(() => {
    fetch("/api/mentores").then((r) => r.json()).then(setMentores);
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erro ao criar aluno");
      const aluno = await res.json();
      router.push(`/alunos/${aluno.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
          <Link href="/alunos" className="hover:text-blue-600">Alunos</Link>
          <span>/</span>
          <span className="text-slate-600">Novo Aluno</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Cadastrar Aluno</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome completo *</label>
            <input required value={form.nome} onChange={set("nome")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <input required type="email" value={form.email} onChange={set("email")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
            <input value={form.telefone} onChange={set("telefone")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select value={form.status} onChange={set("status")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Canal de origem</label>
            <select value={form.canalOrigem} onChange={set("canalOrigem")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione...</option>
              {CANAIS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mentor</label>
            <select value={form.mentorId} onChange={set("mentorId")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Sem mentor</option>
              {mentores.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data de matrícula</label>
            <input type="date" value={form.dataMatricula} onChange={set("dataMatricula")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Curso de interesse</label>
            <input value={form.cursoInteresse} onChange={set("cursoInteresse")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
            <textarea rows={3} value={form.observacoes} onChange={set("observacoes")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="bg-blue-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50">
            {loading ? "Salvando..." : "Cadastrar Aluno"}
          </button>
          <Link href="/alunos" className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
