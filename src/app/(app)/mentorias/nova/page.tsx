"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const TIPOS = [
  { value: "PREP", label: "PREP — Vídeo + Portfólio" },
  { value: "CASE", label: "Case de Negócios" },
  { value: "ENTREVISTA", label: "Simulação de Entrevista" },
  { value: "ODP_OKR", label: "ODP — Definição de OKRs" },
  { value: "ODP_ACOMPANHAMENTO", label: "ODP — Acompanhamento" },
  { value: "ODP_PITCH", label: "ODP — Pitch Final" },
];

export default function NovaMentoriaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preAlunoId = searchParams.get("alunoId") ?? "";

  const [alunos, setAlunos] = useState<{ id: string; nome: string; mentorId: string | null }[]>([]);
  const [mentores, setMentores] = useState<{ id: string; nome: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    alunoId: preAlunoId,
    mentorId: "",
    tipo: "PREP",
    dataAgendada: new Date().toISOString().slice(0, 16),
    dataRealizada: "",
    status: "AGENDADA",
    notaMentor: "",
    feedbackQualitativo: "",
    entregaveisRecebidos: false,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/alunos").then((r) => r.json()),
      fetch("/api/mentores").then((r) => r.json()),
    ]).then(([alunosData, mentoresData]) => {
      setAlunos(alunosData);
      setMentores(mentoresData);
      if (preAlunoId) {
        const aluno = alunosData.find((a: any) => a.id === preAlunoId);
        if (aluno?.mentorId) setForm((f) => ({ ...f, mentorId: aluno.mentorId ?? "" }));
      }
    });
  }, [preAlunoId]);

  const set = (k: string) => (e: React.ChangeEvent<any>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleAlunoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const alunoId = e.target.value;
    const aluno = alunos.find((a) => a.id === alunoId);
    setForm((f) => ({ ...f, alunoId, mentorId: aluno?.mentorId ?? f.mentorId }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mentorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          notaMentor: form.notaMentor ? Number(form.notaMentor) : null,
          dataRealizada: form.dataRealizada || null,
        }),
      });
      if (!res.ok) throw new Error("Erro ao criar mentoria");
      if (form.alunoId) router.push(`/alunos/${form.alunoId}`);
      else router.push("/mentorias");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
          <Link href="/mentorias" className="hover:text-blue-600">Mentorias</Link>
          <span>/</span>
          <span className="text-slate-600">Nova Mentoria</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Registrar Mentoria</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Aluno *</label>
          <select required value={form.alunoId} onChange={handleAlunoChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Selecione o aluno...</option>
            {alunos.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mentor *</label>
          <select required value={form.mentorId} onChange={set("mentorId")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Selecione o mentor...</option>
            {mentores.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
          <select required value={form.tipo} onChange={set("tipo")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data Agendada *</label>
            <input required type="datetime-local" value={form.dataAgendada} onChange={set("dataAgendada")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select value={form.status} onChange={set("status")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="AGENDADA">Agendada</option>
              <option value="REALIZADA">Realizada</option>
              <option value="CANCELADA">Cancelada</option>
              <option value="NAO_REALIZADA">Não Realizada</option>
            </select>
          </div>
        </div>
        {form.status === "REALIZADA" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data Realizada</label>
              <input type="datetime-local" value={form.dataRealizada} onChange={set("dataRealizada")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nota do mentor (1-5)</label>
              <input type="number" min="1" max="5" value={form.notaMentor} onChange={set("notaMentor")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Feedback qualitativo</label>
              <textarea rows={3} value={form.feedbackQualitativo} onChange={set("feedbackQualitativo")} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Observações sobre a mentoria..." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="entregaveis" checked={form.entregaveisRecebidos} onChange={set("entregaveisRecebidos")} className="rounded border-slate-300" />
              <label htmlFor="entregaveis" className="text-sm text-slate-700">Entregáveis recebidos (vídeo, case, portfólio, etc.)</label>
            </div>
          </>
        )}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="bg-blue-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50">
            {loading ? "Salvando..." : "Registrar Mentoria"}
          </button>
          <Link href="/mentorias" className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
