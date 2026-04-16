"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";

const COLORS = ["#3b82f6","#8b5cf6","#f59e0b","#10b981","#ef4444","#ec4899","#06b6d4","#f97316","#84cc16","#6366f1","#14b8a6","#a855f7"];

export function DashboardCharts({
  alunosPorStatus,
  alunosPorCanal,
  mensal,
}: {
  alunosPorStatus: { name: string; value: number; status: string }[];
  alunosPorCanal: { name: string; value: number }[];
  mensal: { month: string; mentorias: number }[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pipeline Distribution */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Distribuição no Pipeline</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={alunosPorStatus} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
            <Tooltip />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {alunosPorStatus.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Canal de Origem */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Canal de Origem</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={alunosPorCanal}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }: any) => `${name ?? ""} ${(((percent as number) ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {alunosPorCanal.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Mentorias History */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-2">
        <h3 className="font-semibold text-slate-900 mb-4">Mentorias Realizadas (últimos 6 meses)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={mensal}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="mentorias"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
