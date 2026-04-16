"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { calculateKRAtingimento, calculateOKRAtingimento, calculateStudentOKRScore } from "@/services/okr-calculator";

type KeyResult = {
  id?: string;
  descricao: string;
  meta: string;
  peso: number;
  resultadoM1: number | null;
  resultadoM2: number | null;
  resultadoM3: number | null;
  atingimentoPerc?: number | null;
};

type OKR = {
  id?: string;
  tipo: string;
  objetivo: string;
  peso: number;
  keyResults: KeyResult[];
};

function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`bg-slate-100 rounded-full h-2 ${className}`}>
      <div
        className={`h-2 rounded-full transition-all ${value >= 70 ? "bg-emerald-500" : value >= 40 ? "bg-amber-500" : "bg-red-500"}`}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}

function KRRow({
  kr,
  idx,
  onChange,
}: {
  kr: KeyResult;
  idx: number;
  onChange: (idx: number, field: string, value: any) => void;
}) {
  const ating = calculateKRAtingimento({ ...kr, atingimentoPerc: null } as any);
  return (
    <div className="border border-slate-100 rounded-lg p-3 mb-2">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <input
            value={kr.descricao}
            onChange={(e) => onChange(idx, "descricao", e.target.value)}
            placeholder="Descrição do Key Result"
            className="w-full text-sm font-medium text-slate-800 border-none outline-none bg-transparent"
          />
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-slate-400">Meta:</span>
            <input
              value={kr.meta}
              onChange={(e) => onChange(idx, "meta", e.target.value)}
              placeholder="ex: 10, R$5000, 100%"
              className="text-xs border-b border-slate-200 outline-none w-24 bg-transparent"
            />
            <span className="text-xs text-slate-400">Peso: {Math.round(kr.peso * 100)}%</span>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-sm font-bold ${ating >= 70 ? "text-emerald-600" : ating >= 40 ? "text-amber-600" : "text-red-600"}`}>
            {ating.toFixed(0)}%
          </span>
        </div>
      </div>
      <ProgressBar value={ating} className="mb-2" />
      <div className="grid grid-cols-3 gap-2">
        {(["resultadoM1", "resultadoM2", "resultadoM3"] as const).map((field, i) => (
          <div key={field}>
            <label className="text-xs text-slate-400">M{i + 1}</label>
            <input
              type="number"
              value={kr[field] ?? ""}
              onChange={(e) => onChange(idx, field, e.target.value === "" ? null : Number(e.target.value))}
              className="w-full text-xs border border-slate-200 rounded px-2 py-1 mt-0.5"
              placeholder="—"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function OKRCard({ okr, onUpdate }: { okr: OKR; onUpdate: (okr: OKR) => void }) {
  const ating = calculateOKRAtingimento({ ...okr, keyResults: okr.keyResults.map(kr => ({ ...kr, atingimentoPerc: null })) } as any);

  const updateKR = (idx: number, field: string, value: any) => {
    const newKRs = okr.keyResults.map((kr, i) =>
      i === idx ? { ...kr, [field]: value } : kr
    );
    onUpdate({ ...okr, keyResults: newKRs });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            {okr.tipo === "BUSINESS" ? "Objetivo de Negócios" : "Objetivo Acadêmico/Pessoal"} ({Math.round(okr.peso * 100)}%)
          </span>
        </div>
        <span className={`text-lg font-bold ${ating >= 70 ? "text-emerald-600" : ating >= 40 ? "text-amber-600" : "text-red-600"}`}>
          {ating.toFixed(0)}%
        </span>
      </div>
      <input
        value={okr.objetivo}
        onChange={(e) => onUpdate({ ...okr, objetivo: e.target.value })}
        placeholder="Escreva o objetivo aqui..."
        className="w-full text-base font-semibold text-slate-900 border-none outline-none bg-transparent mb-3"
      />
      <ProgressBar value={ating} className="mb-4" />
      <div>
        {okr.keyResults.map((kr, idx) => (
          <KRRow key={idx} kr={kr} idx={idx} onChange={updateKR} />
        ))}
      </div>
    </div>
  );
}

export default function AlunoOKRsPage() {
  const { id } = useParams<{ id: string }>();
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alunoNome, setAlunoNome] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/okrs?alunoId=${id}`).then((r) => r.json()),
      fetch(`/api/alunos/${id}`).then((r) => r.json()),
    ]).then(([okrData, aluno]) => {
      setAlunoNome(aluno.nome);
      // Ensure both BUSINESS and ACADEMICO_PESSOAL exist
      const tipos = ["BUSINESS", "ACADEMICO_PESSOAL"];
      const ensuredOkrs = tipos.map((tipo) => {
        const existing = okrData.find((o: OKR) => o.tipo === tipo);
        if (existing) return existing;
        return {
          tipo,
          objetivo: "",
          peso: 0.5,
          keyResults: [
            { descricao: "", meta: "", peso: 0.4, resultadoM1: null, resultadoM2: null, resultadoM3: null },
            { descricao: "", meta: "", peso: 0.4, resultadoM1: null, resultadoM2: null, resultadoM3: null },
            { descricao: "", meta: "", peso: 0.2, resultadoM1: null, resultadoM2: null, resultadoM3: null },
          ],
        };
      });
      setOkrs(ensuredOkrs);
      setLoading(false);
    });
  }, [id]);

  const score = calculateStudentOKRScore(okrs.map(o => ({ ...o, keyResults: o.keyResults.map(kr => ({ ...kr, atingimentoPerc: null })) })) as any);

  async function handleSave() {
    setSaving(true);
    try {
      for (const okr of okrs) {
        if (okr.id) {
          await fetch(`/api/okrs/${okr.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(okr),
          });
        } else {
          const res = await fetch("/api/okrs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...okr, alunoId: id }),
          });
          const created = await res.json();
          // Update with KRs
          await fetch(`/api/okrs/${created.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...okr, keyResults: okr.keyResults }),
          });
        }
      }
      // Reload
      const fresh = await fetch(`/api/okrs?alunoId=${id}`).then((r) => r.json());
      setOkrs(fresh.length ? fresh : okrs);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6 text-slate-500">Carregando OKRs...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
          <Link href="/alunos" className="hover:text-blue-600">Alunos</Link>
          <span>/</span>
          <Link href={`/alunos/${id}`} className="hover:text-blue-600">{alunoNome}</Link>
          <span>/</span>
          <span className="text-slate-600">OKRs</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">OKRs — {alunoNome}</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-400">Score Geral</p>
              <p className={`text-2xl font-bold ${score >= 70 ? "text-emerald-600" : score >= 40 ? "text-amber-600" : "text-red-600"}`}>
                {score.toFixed(0)}%
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar OKRs"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {okrs.map((okr, i) => (
          <OKRCard
            key={okr.tipo}
            okr={okr}
            onUpdate={(updated) => setOkrs((prev) => prev.map((o, j) => (j === i ? updated : o)))}
          />
        ))}
      </div>
    </div>
  );
}
