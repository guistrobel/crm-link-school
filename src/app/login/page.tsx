"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Email ou senha incorretos.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left sidebar */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-900 font-black text-lg">L</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">Simplificando</p>
              <p className="text-blue-200 text-sm">a Jornada</p>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mt-16">
            CRM para a<br />
            <span className="text-blue-300">Jornada Link</span>
          </h1>
          <p className="text-blue-200 mt-4 text-lg leading-relaxed">
            Gerencie alunos, mentorias e OKRs do processo seletivo da Link School of Business.
          </p>
        </div>
        <div className="space-y-4">
          {[
            { icon: "📊", text: "Dashboard com métricas de growth" },
            { icon: "🎯", text: "Pipeline visual em 10 etapas" },
            { icon: "📈", text: "Módulo de OKRs com cálculo automático" },
            { icon: "🔔", text: "Alertas automáticos de risco" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-blue-100">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-black">L</span>
              </div>
              <span className="font-bold text-blue-900">Simplificando a Jornada</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h2>
            <p className="text-slate-500 mt-1">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-900 text-white py-2.5 rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Link School of Business — Simplificando a Jornada © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
