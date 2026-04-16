"use client";
import { useState, useEffect, useCallback } from "react";
import { ALERTA_LABELS, ALERTA_SEVERITY, STAGE_LABELS } from "@/lib/constants";
import Link from "next/link";

type Alerta = {
  id: string;
  tipo: string;
  status: string;
  mensagem: string;
  criadoEm: string;
  aluno: {
    id: string;
    nome: string;
    status: string;
    mentor?: { nome: string } | null;
  };
};

const SEVERITY_STYLES: Record<string, string> = {
  red: "border-red-200 bg-red-50",
  orange: "border-orange-200 bg-orange-50",
  yellow: "border-yellow-200 bg-yellow-50",
  blue: "border-blue-200 bg-blue-50",
  green: "border-green-200 bg-green-50",
};

const SEVERITY_ICONS: Record<string, string> = {
  red: "🔴",
  orange: "🟠",
  yellow: "🟡",
  blue: "🔵",
  green: "🟢",
};

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [filter, setFilter] = useState("PENDENTE");
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastRun, setLastRun] = useState<number | null>(null);

  const loadAlertas = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/alertas?status=${filter}`);
    const data = await res.json();
    setAlertas(data);
    setLoading(false);
  }, [filter]);

  useEffect(() => { loadAlertas(); }, [loadAlertas]);

  async function runEngine() {
    setRunning(true);
    try {
      const res = await fetch("/api/alertas/check", { method: "POST" });
      const data = await res.json();
      setLastRun(data.created);
      await loadAlertas();
    } finally {
      setRunning(false);
    }
  }

  async function updateAlerta(id: string, status: string) {
    await fetch(`/api/alertas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setAlertas((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alertas</h1>
          <p className="text-slate-500 text-sm mt-1">Monitoramento de alunos em risco</p>
        </div>
        <div className="flex items-center gap-2">
          {lastRun !== null && (
            <span className="text-xs text-slate-500">{lastRun} novos alertas criados</span>
          )}
          <button
            onClick={runEngine}
            disabled={running}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
          >
            {running ? "Verificando..." : "🔍 Verificar Alertas"}
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {["PENDENTE", "VISUALIZADO", "RESOLVIDO", "TODOS"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === s
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {s === "TODOS" ? "Todos" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-8">Carregando...</div>
      ) : alertas.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-2xl mb-2">✅</p>
          <p className="text-slate-600 font-medium">Nenhum alerta {filter === "PENDENTE" ? "pendente" : "encontrado"}!</p>
          <p className="text-slate-400 text-sm mt-1">Todos os alunos estão em dia.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alertas.map((alerta) => {
            const severity = ALERTA_SEVERITY[alerta.tipo] ?? "orange";
            return (
              <div
                key={alerta.id}
                className={`rounded-xl border p-4 ${SEVERITY_STYLES[severity] ?? "border-slate-200 bg-slate-50"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-lg mt-0.5">{SEVERITY_ICONS[severity] ?? "⚠"}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-800">
                          {ALERTA_LABELS[alerta.tipo] ?? alerta.tipo}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <Link href={`/alunos/${alerta.aluno.id}`} className="text-sm font-medium text-blue-700 hover:underline">
                          {alerta.aluno.nome}
                        </Link>
                        {alerta.aluno.mentor?.nome && (
                          <>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">Mentor: {alerta.aluno.mentor.nome}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{alerta.mensagem}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">
                          Estágio: {STAGE_LABELS[alerta.aluno.status] ?? alerta.aluno.status}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-400">
                          {new Date(alerta.criadoEm).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                  {alerta.status === "PENDENTE" && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateAlerta(alerta.id, "RESOLVIDO")}
                        className="text-xs px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
                      >
                        ✓ Resolver
                      </button>
                      <button
                        onClick={() => updateAlerta(alerta.id, "IGNORADO")}
                        className="text-xs px-3 py-1.5 bg-white border border-slate-300 text-slate-500 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                      >
                        Ignorar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
