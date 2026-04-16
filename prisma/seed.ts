import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";
import bcrypt from "bcryptjs";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up
  await prisma.alerta.deleteMany();
  await prisma.keyResult.deleteMany();
  await prisma.oKR.deleteMany();
  await prisma.mentoria.deleteMany();
  await prisma.alunoTag.deleteMany();
  await prisma.aluno.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.user.deleteMany();

  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  // ── Users ─────────────────────────────────────────────────────────────────

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@simplificando.com.br",
      name: "Admin Simplificando",
      passwordHash: hash("admin123"),
      role: "ADMIN",
    },
  });

  const coord1 = await prisma.user.create({
    data: {
      email: "coordenacao@simplificando.com.br",
      name: "Coordenação",
      passwordHash: hash("coord123"),
      role: "COORDINATOR",
    },
  });

  const mentorUser1 = await prisma.user.create({
    data: {
      email: "lucas.mentor@simplificando.com.br",
      name: "Lucas Ferreira",
      passwordHash: hash("mentor123"),
      role: "MENTOR",
    },
  });
  const mentorUser2 = await prisma.user.create({
    data: {
      email: "ana.mentor@simplificando.com.br",
      name: "Ana Clara Silva",
      passwordHash: hash("mentor123"),
      role: "MENTOR",
    },
  });
  const mentorUser3 = await prisma.user.create({
    data: {
      email: "rafael.mentor@simplificando.com.br",
      name: "Rafael Gomes",
      passwordHash: hash("mentor123"),
      role: "MENTOR",
    },
  });

  // ── Mentors ────────────────────────────────────────────────────────────────

  const mentor1 = await prisma.mentor.create({
    data: {
      userId: mentorUser1.id,
      nome: "Lucas Ferreira",
      email: "lucas.mentor@simplificando.com.br",
      especialidade: "Empreendedorismo e Startups",
    },
  });
  const mentor2 = await prisma.mentor.create({
    data: {
      userId: mentorUser2.id,
      nome: "Ana Clara Silva",
      email: "ana.mentor@simplificando.com.br",
      especialidade: "Marketing e Branding",
    },
  });
  const mentor3 = await prisma.mentor.create({
    data: {
      userId: mentorUser3.id,
      nome: "Rafael Gomes",
      email: "rafael.mentor@simplificando.com.br",
      especialidade: "Finanças e Gestão",
    },
  });

  // ── Alunos ─────────────────────────────────────────────────────────────────

  const alunosData = [
    // Lead Frio
    {
      nome: "Beatriz Santos",
      email: "beatriz@email.com",
      status: "LEAD_FRIO",
      canalOrigem: "INSTAGRAM",
      mentorId: mentor1.id,
    },
    {
      nome: "Carlos Mendes",
      email: "carlos@email.com",
      status: "LEAD_FRIO",
      canalOrigem: "INDICACAO",
      mentorId: mentor2.id,
    },
    // Inscrito/Onboarding
    {
      nome: "Diana Oliveira",
      email: "diana@email.com",
      status: "INSCRITO_ONBOARDING",
      canalOrigem: "EVENTO",
      mentorId: mentor1.id,
      dataMatricula: new Date("2026-04-01"),
    },
    {
      nome: "Eduardo Lima",
      email: "eduardo@email.com",
      status: "INSCRITO_ONBOARDING",
      canalOrigem: "GOOGLE",
      mentorId: mentor3.id,
      dataMatricula: new Date("2026-04-05"),
    },
    // Ativo PREP
    {
      nome: "Fernanda Costa",
      email: "fernanda@email.com",
      status: "ATIVO_PREP",
      canalOrigem: "INDICACAO",
      mentorId: mentor2.id,
      dataMatricula: new Date("2026-03-10"),
    },
    {
      nome: "Gabriel Rocha",
      email: "gabriel@email.com",
      status: "ATIVO_PREP",
      canalOrigem: "INSTAGRAM",
      mentorId: mentor1.id,
      dataMatricula: new Date("2026-03-12"),
    },
    // Ativo Case
    {
      nome: "Helena Vieira",
      email: "helena@email.com",
      status: "ATIVO_CASE",
      canalOrigem: "LINKEDIN",
      mentorId: mentor3.id,
      dataMatricula: new Date("2026-02-20"),
    },
    // Ativo Entrevista
    {
      nome: "Igor Martins",
      email: "igor@email.com",
      status: "ATIVO_ENTREVISTA",
      canalOrigem: "INDICACAO",
      mentorId: mentor2.id,
      dataMatricula: new Date("2026-02-15"),
    },
    // ODP OKRs Definidos
    {
      nome: "Juliana Pereira",
      email: "juliana@email.com",
      status: "ODP_OKRS_DEFINIDOS",
      canalOrigem: "EVENTO",
      mentorId: mentor1.id,
      dataMatricula: new Date("2026-01-20"),
    },
    // ODP Em Andamento
    {
      nome: "Kleber Souza",
      email: "kleber@email.com",
      status: "ODP_EM_ANDAMENTO",
      canalOrigem: "GOOGLE",
      mentorId: mentor3.id,
      dataMatricula: new Date("2026-01-10"),
    },
    {
      nome: "Larissa Alves",
      email: "larissa@email.com",
      status: "ODP_EM_ANDAMENTO",
      canalOrigem: "INSTAGRAM",
      mentorId: mentor2.id,
      dataMatricula: new Date("2026-01-08"),
    },
    // ODP Pitch Final
    {
      nome: "Marcos Nunes",
      email: "marcos@email.com",
      status: "ODP_PITCH_FINAL",
      canalOrigem: "INDICACAO",
      mentorId: mentor1.id,
      dataMatricula: new Date("2025-12-15"),
    },
    // Concluído
    {
      nome: "Natalia Ferraz",
      email: "natalia@email.com",
      status: "CONCLUIDO",
      canalOrigem: "LINKEDIN",
      mentorId: mentor3.id,
      dataMatricula: new Date("2025-11-01"),
      npsScore: 9,
    },
    {
      nome: "Otávio Castro",
      email: "otavio@email.com",
      status: "CONCLUIDO",
      canalOrigem: "EVENTO",
      mentorId: mentor2.id,
      dataMatricula: new Date("2025-11-05"),
      npsScore: 8,
    },
    // Aprovado
    {
      nome: "Priscila Melo",
      email: "priscila@email.com",
      status: "APROVADO",
      canalOrigem: "INDICACAO",
      mentorId: mentor1.id,
      dataMatricula: new Date("2025-09-01"),
      npsScore: 10,
      resultadoLink: "aprovado",
    },
    {
      nome: "Rodrigo Barros",
      email: "rodrigo@email.com",
      status: "APROVADO",
      canalOrigem: "INSTAGRAM",
      mentorId: mentor3.id,
      dataMatricula: new Date("2025-09-10"),
      npsScore: 9,
      resultadoLink: "aprovado",
    },
    // Reprovado
    {
      nome: "Sandra Lima",
      email: "sandra@email.com",
      status: "REPROVADO",
      canalOrigem: "GOOGLE",
      mentorId: mentor2.id,
      dataMatricula: new Date("2025-09-05"),
      npsScore: 7,
      resultadoLink: "reprovado",
    },
    // Desistiu
    {
      nome: "Thiago Ramos",
      email: "thiago@email.com",
      status: "DESISTIU",
      canalOrigem: "INSTAGRAM",
      mentorId: mentor1.id,
      dataMatricula: new Date("2025-10-01"),
    },
    // Em risco
    {
      nome: "Ursula Faria",
      email: "ursula@email.com",
      status: "ODP_EM_ANDAMENTO",
      canalOrigem: "EVENTO",
      mentorId: mentor3.id,
      dataMatricula: new Date("2026-01-15"),
      observacoes: "Aluna com dificuldade de engajamento. Requer atenção.",
    },
    {
      nome: "Victor Santos",
      email: "victor@email.com",
      status: "ATIVO_CASE",
      canalOrigem: "INDICACAO",
      mentorId: mentor2.id,
      dataMatricula: new Date("2026-02-25"),
    },
  ];

  const alunos = await Promise.all(
    alunosData.map((data) => prisma.aluno.create({ data }))
  );

  const findAluno = (nome: string) => {
    const a = alunos.find((a) => a.nome === nome);
    if (!a) throw new Error(`Aluno ${nome} not found`);
    return a;
  };

  // ── Tags ───────────────────────────────────────────────────────────────────

  const tagData = [
    { alunoId: findAluno("Priscila Melo").id, tag: "AMBASSADOR_POTENCIAL" },
    { alunoId: findAluno("Priscila Melo").id, tag: "FIT_EMPREENDEDOR" },
    { alunoId: findAluno("Rodrigo Barros").id, tag: "AMBASSADOR_POTENCIAL" },
    { alunoId: findAluno("Marcos Nunes").id, tag: "FIT_EMPREENDEDOR" },
    { alunoId: findAluno("Marcos Nunes").id, tag: "INGLES_FORTE" },
    { alunoId: findAluno("Marcos Nunes").id, tag: "AUTONOMO" },
    { alunoId: findAluno("Larissa Alves").id, tag: "FIT_EMPREENDEDOR" },
    { alunoId: findAluno("Ursula Faria").id, tag: "EM_RISCO" },
    { alunoId: findAluno("Ursula Faria").id, tag: "PRECISA_SUPORTE" },
    { alunoId: findAluno("Helena Vieira").id, tag: "INGLES_FORTE" },
    { alunoId: findAluno("Igor Martins").id, tag: "AUTONOMO" },
  ];

  await prisma.alunoTag.createMany({ data: tagData });

  // ── Mentorias ──────────────────────────────────────────────────────────────

  const now = new Date();
  const d = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000);

  const mentoriasData = [
    // Fernanda Costa - PREP
    {
      alunoId: findAluno("Fernanda Costa").id,
      mentorId: mentor2.id,
      tipo: "PREP",
      dataAgendada: d(20),
      dataRealizada: d(20),
      status: "REALIZADA",
      notaMentor: 4,
      feedbackQualitativo: "Ótimo vídeo de apresentação. Portfólio bem estruturado.",
      entregaveisRecebidos: true,
      sequenciaNumero: 1,
    },
    // Gabriel Rocha - PREP
    {
      alunoId: findAluno("Gabriel Rocha").id,
      mentorId: mentor1.id,
      tipo: "PREP",
      dataAgendada: d(18),
      dataRealizada: d(18),
      status: "REALIZADA",
      notaMentor: 3,
      feedbackQualitativo: "Vídeo bom, mas precisa melhorar o portfólio.",
      entregaveisRecebidos: true,
      sequenciaNumero: 1,
    },
    // Helena Vieira - PREP + CASE
    {
      alunoId: findAluno("Helena Vieira").id,
      mentorId: mentor3.id,
      tipo: "PREP",
      dataAgendada: d(35),
      dataRealizada: d(35),
      status: "REALIZADA",
      notaMentor: 5,
      feedbackQualitativo: "Excelente apresentação, muito forte.",
      entregaveisRecebidos: true,
      sequenciaNumero: 1,
    },
    {
      alunoId: findAluno("Helena Vieira").id,
      mentorId: mentor3.id,
      tipo: "CASE",
      dataAgendada: d(15),
      dataRealizada: d(15),
      status: "REALIZADA",
      notaMentor: 4,
      feedbackQualitativo: "Case bem resolvido. Estrutura clara.",
      entregaveisRecebidos: true,
      sequenciaNumero: 2,
    },
    // Igor Martins - PREP + CASE + ENTREVISTA
    {
      alunoId: findAluno("Igor Martins").id,
      mentorId: mentor2.id,
      tipo: "PREP",
      dataAgendada: d(40),
      dataRealizada: d(40),
      status: "REALIZADA",
      notaMentor: 5,
      feedbackQualitativo: "Perfil empreendedor muito forte.",
      entregaveisRecebidos: true,
      sequenciaNumero: 1,
    },
    {
      alunoId: findAluno("Igor Martins").id,
      mentorId: mentor2.id,
      tipo: "CASE",
      dataAgendada: d(28),
      dataRealizada: d(28),
      status: "REALIZADA",
      notaMentor: 4,
      feedbackQualitativo: "Case muito bem estruturado.",
      entregaveisRecebidos: true,
      sequenciaNumero: 2,
    },
    {
      alunoId: findAluno("Igor Martins").id,
      mentorId: mentor2.id,
      tipo: "ENTREVISTA",
      dataAgendada: d(10),
      dataRealizada: d(10),
      status: "REALIZADA",
      notaMentor: 4,
      feedbackQualitativo: "Inglês intermediário, melhorar fluidez.",
      entregaveisRecebidos: false,
      sequenciaNumero: 3,
    },
    // Juliana - ODP OKR
    {
      alunoId: findAluno("Juliana Pereira").id,
      mentorId: mentor1.id,
      tipo: "ODP_OKR",
      dataAgendada: d(12),
      dataRealizada: d(12),
      status: "REALIZADA",
      notaMentor: 4,
      feedbackQualitativo: "OKRs bem definidos. Metas ambiciosas e realistas.",
      entregaveisRecebidos: true,
      sequenciaNumero: 1,
    },
    // Kleber - ODP OKR + Acompanhamento
    {
      alunoId: findAluno("Kleber Souza").id,
      mentorId: mentor3.id,
      tipo: "ODP_OKR",
      dataAgendada: d(30),
      dataRealizada: d(30),
      status: "REALIZADA",
      notaMentor: 3,
      feedbackQualitativo: "Objetivos definidos, mas KRs precisam ser mais mensuráveis.",
      entregaveisRecebidos: true,
      sequenciaNumero: 1,
    },
    {
      alunoId: findAluno("Kleber Souza").id,
      mentorId: mentor3.id,
      tipo: "ODP_ACOMPANHAMENTO",
      dataAgendada: d(10),
      dataRealizada: d(10),
      status: "REALIZADA",
      notaMentor: 3,
      feedbackQualitativo: "Progresso moderado. Precisa acelerar nos KRs de negócio.",
      entregaveisRecebidos: true,
      sequenciaNumero: 2,
    },
    // Larissa - ODP OKR + Acompanhamento
    {
      alunoId: findAluno("Larissa Alves").id,
      mentorId: mentor2.id,
      tipo: "ODP_OKR",
      dataAgendada: d(28),
      dataRealizada: d(28),
      status: "REALIZADA",
      notaMentor: 5,
      feedbackQualitativo: "OKRs excelentes! Muito bem estruturados.",
      entregaveisRecebidos: true,
      sequenciaNumero: 1,
    },
    {
      alunoId: findAluno("Larissa Alves").id,
      mentorId: mentor2.id,
      tipo: "ODP_ACOMPANHAMENTO",
      dataAgendada: d(8),
      dataRealizada: d(8),
      status: "REALIZADA",
      notaMentor: 5,
      feedbackQualitativo: "Progresso excelente! OKRs no caminho certo.",
      entregaveisRecebidos: true,
      sequenciaNumero: 2,
    },
    // Marcos - ODP completo
    {
      alunoId: findAluno("Marcos Nunes").id,
      mentorId: mentor1.id,
      tipo: "ODP_OKR",
      dataAgendada: d(45),
      dataRealizada: d(45),
      status: "REALIZADA",
      notaMentor: 5,
      feedbackQualitativo: "OKRs muito bem definidos. Aluno autônomo.",
      entregaveisRecebidos: true,
      sequenciaNumero: 1,
    },
    {
      alunoId: findAluno("Marcos Nunes").id,
      mentorId: mentor1.id,
      tipo: "ODP_ACOMPANHAMENTO",
      dataAgendada: d(25),
      dataRealizada: d(25),
      status: "REALIZADA",
      notaMentor: 5,
      feedbackQualitativo: "Atingimento acima de 80%. Pronto para o pitch.",
      entregaveisRecebidos: true,
      sequenciaNumero: 2,
    },
    {
      alunoId: findAluno("Marcos Nunes").id,
      mentorId: mentor1.id,
      tipo: "ODP_PITCH",
      dataAgendada: d(5),
      dataRealizada: d(5),
      status: "REALIZADA",
      notaMentor: 5,
      feedbackQualitativo: "Pitch extraordinário. Pronto para a Link.",
      entregaveisRecebidos: true,
      sequenciaNumero: 3,
    },
    // Ursula - sem entregáveis (em risco)
    {
      alunoId: findAluno("Ursula Faria").id,
      mentorId: mentor3.id,
      tipo: "ODP_OKR",
      dataAgendada: d(25),
      dataRealizada: d(25),
      status: "REALIZADA",
      notaMentor: 2,
      feedbackQualitativo: "Aluna pouco engajada. OKRs vagos.",
      entregaveisRecebidos: false,
      sequenciaNumero: 1,
    },
    {
      alunoId: findAluno("Ursula Faria").id,
      mentorId: mentor3.id,
      tipo: "ODP_ACOMPANHAMENTO",
      dataAgendada: d(8),
      dataRealizada: d(8),
      status: "REALIZADA",
      notaMentor: 2,
      feedbackQualitativo: "Sem progresso nos OKRs. Situação crítica.",
      entregaveisRecebidos: false,
      sequenciaNumero: 2,
    },
    // Natalia - concluída
    {
      alunoId: findAluno("Natalia Ferraz").id,
      mentorId: mentor3.id,
      tipo: "ODP_OKR",
      dataAgendada: d(90),
      dataRealizada: d(90),
      status: "REALIZADA",
      notaMentor: 4,
      entregaveisRecebidos: true,
      sequenciaNumero: 1,
    },
    {
      alunoId: findAluno("Natalia Ferraz").id,
      mentorId: mentor3.id,
      tipo: "ODP_ACOMPANHAMENTO",
      dataAgendada: d(70),
      dataRealizada: d(70),
      status: "REALIZADA",
      notaMentor: 4,
      entregaveisRecebidos: true,
      sequenciaNumero: 2,
    },
    {
      alunoId: findAluno("Natalia Ferraz").id,
      mentorId: mentor3.id,
      tipo: "ODP_PITCH",
      dataAgendada: d(50),
      dataRealizada: d(50),
      status: "REALIZADA",
      notaMentor: 5,
      entregaveisRecebidos: true,
      sequenciaNumero: 3,
    },
    // Próximas agendadas
    {
      alunoId: findAluno("Diana Oliveira").id,
      mentorId: mentor1.id,
      tipo: "PREP",
      dataAgendada: new Date(now.getTime() + 2 * 86400000),
      status: "AGENDADA",
      sequenciaNumero: 1,
    },
    {
      alunoId: findAluno("Eduardo Lima").id,
      mentorId: mentor3.id,
      tipo: "PREP",
      dataAgendada: new Date(now.getTime() + 5 * 86400000),
      status: "AGENDADA",
      sequenciaNumero: 1,
    },
    // Cancelada
    {
      alunoId: findAluno("Victor Santos").id,
      mentorId: mentor2.id,
      tipo: "CASE",
      dataAgendada: d(5),
      status: "NAO_REALIZADA",
      sequenciaNumero: 1,
    },
  ];

  await prisma.mentoria.createMany({ data: mentoriasData });

  // ── OKRs ───────────────────────────────────────────────────────────────────

  // Kleber Souza - ODP Em Andamento
  const okrKleberBusiness = await prisma.oKR.create({
    data: {
      alunoId: findAluno("Kleber Souza").id,
      tipo: "BUSINESS",
      objetivo: "Validar modelo de negócio de startup edtech",
      peso: 0.5,
    },
  });
  await prisma.keyResult.createMany({
    data: [
      {
        okrId: okrKleberBusiness.id,
        descricao: "Número de entrevistas de descoberta realizadas",
        meta: "20",
        peso: 0.4,
        resultadoM1: 8,
        resultadoM2: 15,
        atingimentoPerc: 75,
      },
      {
        okrId: okrKleberBusiness.id,
        descricao: "Receita de pilotos (R$)",
        meta: "5000",
        peso: 0.4,
        resultadoM1: 0,
        resultadoM2: 1500,
        atingimentoPerc: 30,
      },
      {
        okrId: okrKleberBusiness.id,
        descricao: "Deck de pitch finalizado",
        meta: "1",
        peso: 0.2,
        resultadoM1: 0.5,
        resultadoM2: 0.8,
        atingimentoPerc: 80,
      },
    ],
  });

  const okrKleberAcad = await prisma.oKR.create({
    data: {
      alunoId: findAluno("Kleber Souza").id,
      tipo: "ACADEMICO_PESSOAL",
      objetivo: "Melhorar inglês e autoconhecimento",
      peso: 0.5,
    },
  });
  await prisma.keyResult.createMany({
    data: [
      {
        okrId: okrKleberAcad.id,
        descricao: "Horas de estudo de inglês",
        meta: "40",
        peso: 0.4,
        resultadoM1: 10,
        resultadoM2: 22,
        atingimentoPerc: 55,
      },
      {
        okrId: okrKleberAcad.id,
        descricao: "Leituras de livros de negócios",
        meta: "3",
        peso: 0.4,
        resultadoM1: 1,
        resultadoM2: 2,
        atingimentoPerc: 67,
      },
      {
        okrId: okrKleberAcad.id,
        descricao: "Sessões de coaching/terapia",
        meta: "5",
        peso: 0.2,
        resultadoM1: 2,
        resultadoM2: 3,
        atingimentoPerc: 60,
      },
    ],
  });

  // Larissa Alves - ODP Em Andamento (alta performance)
  const okrLarissaBusiness = await prisma.oKR.create({
    data: {
      alunoId: findAluno("Larissa Alves").id,
      tipo: "BUSINESS",
      objetivo: "Lançar primeiro produto digital com receita",
      peso: 0.5,
    },
  });
  await prisma.keyResult.createMany({
    data: [
      {
        okrId: okrLarissaBusiness.id,
        descricao: "Vendas do produto (R$)",
        meta: "3000",
        peso: 0.4,
        resultadoM1: 800,
        resultadoM2: 2200,
        atingimentoPerc: 73,
      },
      {
        okrId: okrLarissaBusiness.id,
        descricao: "Clientes pagantes",
        meta: "15",
        peso: 0.4,
        resultadoM1: 4,
        resultadoM2: 11,
        atingimentoPerc: 73,
      },
      {
        okrId: okrLarissaBusiness.id,
        descricao: "NPS do produto",
        meta: "8",
        peso: 0.2,
        resultadoM1: 7,
        resultadoM2: 8.5,
        atingimentoPerc: 100,
      },
    ],
  });

  const okrLarissaAcad = await prisma.oKR.create({
    data: {
      alunoId: findAluno("Larissa Alves").id,
      tipo: "ACADEMICO_PESSOAL",
      objetivo: "Construir presença profissional e rede de contatos",
      peso: 0.5,
    },
  });
  await prisma.keyResult.createMany({
    data: [
      {
        okrId: okrLarissaAcad.id,
        descricao: "Conexões no LinkedIn",
        meta: "200",
        peso: 0.4,
        resultadoM1: 80,
        resultadoM2: 165,
        atingimentoPerc: 83,
      },
      {
        okrId: okrLarissaAcad.id,
        descricao: "Eventos de networking participados",
        meta: "5",
        peso: 0.4,
        resultadoM1: 2,
        resultadoM2: 4,
        atingimentoPerc: 80,
      },
      {
        okrId: okrLarissaAcad.id,
        descricao: "Artigos publicados no LinkedIn",
        meta: "4",
        peso: 0.2,
        resultadoM1: 1,
        resultadoM2: 3,
        atingimentoPerc: 75,
      },
    ],
  });

  // Marcos Nunes - ODP Pitch Final (excelente)
  const okrMarcosBusiness = await prisma.oKR.create({
    data: {
      alunoId: findAluno("Marcos Nunes").id,
      tipo: "BUSINESS",
      objetivo: "Desenvolver e validar startup de impacto social",
      peso: 0.5,
    },
  });
  await prisma.keyResult.createMany({
    data: [
      {
        okrId: okrMarcosBusiness.id,
        descricao: "Usuários ativos na plataforma",
        meta: "100",
        peso: 0.4,
        resultadoM1: 30,
        resultadoM2: 75,
        resultadoM3: 95,
        atingimentoPerc: 95,
      },
      {
        okrId: okrMarcosBusiness.id,
        descricao: "Parcerias firmadas",
        meta: "3",
        peso: 0.4,
        resultadoM1: 1,
        resultadoM2: 2,
        resultadoM3: 3,
        atingimentoPerc: 100,
      },
      {
        okrId: okrMarcosBusiness.id,
        descricao: "Investimento captado (R$)",
        meta: "50000",
        peso: 0.2,
        resultadoM1: 10000,
        resultadoM2: 30000,
        resultadoM3: 45000,
        atingimentoPerc: 90,
      },
    ],
  });

  const okrMarcosAcad = await prisma.oKR.create({
    data: {
      alunoId: findAluno("Marcos Nunes").id,
      tipo: "ACADEMICO_PESSOAL",
      objetivo: "Dominar inglês fluente e liderança",
      peso: 0.5,
    },
  });
  await prisma.keyResult.createMany({
    data: [
      {
        okrId: okrMarcosAcad.id,
        descricao: "Score no TOEFL",
        meta: "100",
        peso: 0.4,
        resultadoM1: 80,
        resultadoM2: 92,
        resultadoM3: 98,
        atingimentoPerc: 98,
      },
      {
        okrId: okrMarcosAcad.id,
        descricao: "Pessoas lideradas no projeto",
        meta: "8",
        peso: 0.4,
        resultadoM1: 3,
        resultadoM2: 6,
        resultadoM3: 8,
        atingimentoPerc: 100,
      },
      {
        okrId: okrMarcosAcad.id,
        descricao: "Certificações concluídas",
        meta: "2",
        peso: 0.2,
        resultadoM1: 0,
        resultadoM2: 1,
        resultadoM3: 2,
        atingimentoPerc: 100,
      },
    ],
  });

  // Ursula Faria - Em Risco (baixo atingimento)
  const okrUrsulaBusiness = await prisma.oKR.create({
    data: {
      alunoId: findAluno("Ursula Faria").id,
      tipo: "BUSINESS",
      objetivo: "Criar projeto social na área de educação",
      peso: 0.5,
    },
  });
  await prisma.keyResult.createMany({
    data: [
      {
        okrId: okrUrsulaBusiness.id,
        descricao: "Beneficiários impactados",
        meta: "50",
        peso: 0.4,
        resultadoM1: 5,
        resultadoM2: 8,
        atingimentoPerc: 16,
      },
      {
        okrId: okrUrsulaBusiness.id,
        descricao: "Parceiros captados",
        meta: "3",
        peso: 0.4,
        resultadoM1: 0,
        resultadoM2: 0,
        atingimentoPerc: 0,
      },
      {
        okrId: okrUrsulaBusiness.id,
        descricao: "Verba captada (R$)",
        meta: "2000",
        peso: 0.2,
        resultadoM1: 0,
        resultadoM2: 200,
        atingimentoPerc: 10,
      },
    ],
  });

  const okrUrsulaAcad = await prisma.oKR.create({
    data: {
      alunoId: findAluno("Ursula Faria").id,
      tipo: "ACADEMICO_PESSOAL",
      objetivo: "Melhorar consistência e autogestão",
      peso: 0.5,
    },
  });
  await prisma.keyResult.createMany({
    data: [
      {
        okrId: okrUrsulaAcad.id,
        descricao: "Dias com rotina cumprida",
        meta: "60",
        peso: 0.4,
        resultadoM1: 10,
        resultadoM2: 18,
        atingimentoPerc: 30,
      },
      {
        okrId: okrUrsulaAcad.id,
        descricao: "Horas de estudo semanais",
        meta: "15",
        peso: 0.4,
        resultadoM1: 4,
        resultadoM2: 6,
        atingimentoPerc: 40,
      },
      {
        okrId: okrUrsulaAcad.id,
        descricao: "Mentorias realizadas no prazo",
        meta: "3",
        peso: 0.2,
        resultadoM1: 1,
        resultadoM2: 1,
        atingimentoPerc: 33,
      },
    ],
  });

  // ── Alerts ─────────────────────────────────────────────────────────────────

  await prisma.alerta.createMany({
    data: [
      {
        alunoId: findAluno("Ursula Faria").id,
        tipo: "EM_RISCO" as any,
        status: "PENDENTE",
        mensagem: "Ursula Faria está com OKRs abaixo de 20% de atingimento no meio do ciclo.",
        tipo: "OKR_ABAIXO_20_MIDPOINT",
      },
      {
        alunoId: findAluno("Victor Santos").id,
        tipo: "MENTORIA_PERDIDA_48H",
        status: "PENDENTE",
        mensagem: "Victor Santos perdeu uma mentoria de CASE sem reagendamento em 48h.",
      },
      {
        alunoId: findAluno("Natalia Ferraz").id,
        tipo: "ALUNO_CONCLUIDO_NPS",
        status: "RESOLVIDO",
        mensagem: "Natalia Ferraz concluiu o programa. Solicite o NPS e feedback.",
        resolvidoEm: new Date(),
      },
      {
        alunoId: findAluno("Priscila Melo").id,
        tipo: "RESULTADO_RECEBIDO_DEPOIMENTO",
        status: "PENDENTE",
        mensagem: "Priscila Melo recebeu resultado da Jornada Link. Solicite depoimento/indicação.",
      },
    ],
  });

  console.log("✅ Seed concluído!");
  console.log("\n📋 Credenciais de acesso:");
  console.log("  Admin:       admin@simplificando.com.br / admin123");
  console.log("  Coordenação: coordenacao@simplificando.com.br / coord123");
  console.log("  Mentor 1:    lucas.mentor@simplificando.com.br / mentor123");
  console.log("  Mentor 2:    ana.mentor@simplificando.com.br / mentor123");
  console.log("  Mentor 3:    rafael.mentor@simplificando.com.br / mentor123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
