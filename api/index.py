from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from pydantic import BaseModel
from typing import Optional
import json
import os
from datetime import datetime

app = FastAPI(title="Cultura Sergipe API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# BANCO DE DADOS EM MEMÓRIA (MVP — substituir por DB real depois)
# ============================================================

# --- Dados culturais de Sergipe ---
CULTURA_DATA = [
    {
        "id": 1,
        "nome": "Festa dos Lambe-Sujos e Caboclinhos",
        "descricao": "Manifestação folclórica que recria a luta entre negros e índios. Acontece anualmente no segundo domingo de outubro.",
        "cidade": "Laranjeiras",
        "lat": -10.8058,
        "lng": -37.1697,
        "tipo": "imaterial",
        "categoria": "festa",
        "imagem": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600",
        "curiosidade": "É reconhecida como Patrimônio Cultural e Imaterial do Brasil."
    },
    {
        "id": 2,
        "nome": "Forró Caju",
        "descricao": "Maior festa junina de Sergipe, realizada em Aracaju durante o mês de junho com shows de forró e artistas regionais e nacionais.",
        "cidade": "Aracaju",
        "lat": -10.9091,
        "lng": -37.0677,
        "tipo": "imaterial",
        "categoria": "festa",
        "imagem": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600",
        "curiosidade": "É um dos maiores festejos juninos do Nordeste."
    },
    {
        "id": 3,
        "nome": "Praça São Francisco",
        "descricao": "Patrimônio Mundial da UNESCO desde 2010. Conjunto arquitetônico colonial com igrejas e casarões históricos.",
        "cidade": "São Cristóvão",
        "lat": -11.0147,
        "lng": -37.2064,
        "tipo": "material",
        "categoria": "patrimonio",
        "imagem": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
        "curiosidade": "São Cristóvão é a 4ª cidade mais antiga do Brasil."
    },
    {
        "id": 4,
        "nome": "Taieira de Laranjeiras",
        "descricao": "Dança de origem afro-brasileira realizada em homenagem a São Benedito e Nossa Senhora do Rosário.",
        "cidade": "Laranjeiras",
        "lat": -10.8058,
        "lng": -37.1697,
        "tipo": "imaterial",
        "categoria": "danca",
        "imagem": "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600",
        "curiosidade": "A Taieira é exclusiva do estado de Sergipe."
    },
    {
        "id": 5,
        "nome": "Museu da Gente Sergipana",
        "descricao": "Museu interativo e tecnológico que celebra a cultura, história e tradições do povo sergipano.",
        "cidade": "Aracaju",
        "lat": -10.9111,
        "lng": -37.0700,
        "tipo": "material",
        "categoria": "museu",
        "imagem": "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=600",
        "curiosidade": "Inaugurado em 2011, é referência em museus interativos no Brasil."
    },
    {
        "id": 6,
        "nome": "São Gonçalo do Amarante",
        "descricao": "Dança dramática sergipana em homenagem a São Gonçalo, misturando elementos religiosos e profanos.",
        "cidade": "Laranjeiras",
        "lat": -10.8058,
        "lng": -37.1697,
        "tipo": "imaterial",
        "categoria": "danca",
        "imagem": "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600",
        "curiosidade": "Celebrada há mais de 200 anos em Sergipe."
    },
    {
        "id": 7,
        "nome": "Cânion de Xingó",
        "descricao": "Formação geológica impressionante com paredões de até 170 metros, localizado no rio São Francisco.",
        "cidade": "Canindé de São Francisco",
        "lat": -9.6317,
        "lng": -37.7892,
        "tipo": "material",
        "categoria": "natureza",
        "imagem": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
        "curiosidade": "É um dos maiores cânions navegáveis do mundo."
    },
    {
        "id": 8,
        "nome": "Quadrilhas Juninas",
        "descricao": "Grupos de dança que se apresentam nas festas juninas com coreografias elaboradas e figurinos típicos.",
        "cidade": "Aracaju",
        "lat": -10.9091,
        "lng": -37.0677,
        "tipo": "imaterial",
        "categoria": "danca",
        "imagem": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600",
        "curiosidade": "Sergipe possui campeonatos estaduais de quadrilhas juninas."
    },
    {
        "id": 9,
        "nome": "Igreja e Convento de São Francisco",
        "descricao": "Igreja do século XVII com rica ornamentação barroca, localizada na Praça São Francisco.",
        "cidade": "São Cristóvão",
        "lat": -11.0147,
        "lng": -37.2064,
        "tipo": "material",
        "categoria": "patrimonio",
        "imagem": "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=600",
        "curiosidade": "O complexo faz parte do Patrimônio Mundial da UNESCO."
    },
    {
        "id": 10,
        "nome": "Renda Irlandesa de Divina Pastora",
        "descricao": "Técnica artesanal de renda de agulha praticada por mulheres de Divina Pastora. Patrimônio Imaterial do Brasil.",
        "cidade": "Divina Pastora",
        "lat": -10.6778,
        "lng": -37.1483,
        "tipo": "imaterial",
        "categoria": "artesanato",
        "imagem": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600",
        "curiosidade": "Registrada como Patrimônio Cultural do Brasil pelo IPHAN em 2009."
    },
    {
        "id": 11,
        "nome": "Gonzagão Cultural",
        "descricao": "Complexo cultural em Aracaju dedicado à preservação e celebração do forró e da cultura nordestina.",
        "cidade": "Aracaju",
        "lat": -10.9091,
        "lng": -37.0677,
        "tipo": "material",
        "categoria": "cultural",
        "imagem": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600",
        "curiosidade": "Homenageia Luiz Gonzaga, o Rei do Baião."
    },
    {
        "id": 12,
        "nome": "Chegança de Marujos",
        "descricao": "Auto popular que dramatiza aventuras marítimas e batalhas entre cristãos e mouros.",
        "cidade": "Laranjeiras",
        "lat": -10.8058,
        "lng": -37.1697,
        "tipo": "imaterial",
        "categoria": "folclore",
        "imagem": "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600",
        "curiosidade": "Uma das mais antigas manifestações folclóricas de Sergipe."
    }
]

# --- Dados para o Duolingo cultural ---
DUOLINGO_LICOES = [
    {
        "id": 1,
        "titulo": "O que é Forró?",
        "nivel": 1,
        "perguntas": [
            {
                "tipo": "multipla_escolha",
                "enunciado": "O Forró é um gênero musical originário de qual região do Brasil?",
                "opcoes": ["Sul", "Nordeste", "Sudeste", "Norte"],
                "resposta": "Nordeste",
                "explicacao": "O Forró nasceu no Nordeste brasileiro e é uma das principais expressões culturais da região.",
                "dica": "Pense em estados como Sergipe, Pernambuco e Ceará."
            },
            {
                "tipo": "verdadeiro_falso",
                "enunciado": "Luiz Gonzaga é conhecido como o Rei do Baião.",
                "resposta": True,
                "explicacao": "Luiz Gonzaga popularizou o baião e o forró em todo o Brasil.",
                "dica": "Ele nasceu em Exu, Pernambuco."
            },
            {
                "tipo": "multipla_escolha",
                "enunciado": "Qual destes instrumentos é típico do forró?",
                "opcoes": ["Guitarra elétrica", "Sanfona", "Piano", "Violino"],
                "resposta": "Sanfona",
                "explicacao": "A sanfona (acordeão) é um dos instrumentos mais icônicos do forró.",
                "dica": "É um instrumento de fole."
            }
        ]
    },
    {
        "id": 2,
        "titulo": "Festas de Sergipe",
        "nivel": 1,
        "perguntas": [
            {
                "tipo": "multipla_escolha",
                "enunciado": "A Festa dos Lambe-Sujos e Caboclinhos acontece em qual cidade?",
                "opcoes": ["Aracaju", "Laranjeiras", "Estância", "Itabaiana"],
                "resposta": "Laranjeiras",
                "explicacao": "Acontece anualmente no segundo domingo de outubro na cidade histórica de Laranjeiras.",
                "dica": "É uma cidade conhecida por seu rico patrimônio cultural."
            },
            {
                "tipo": "verdadeiro_falso",
                "enunciado": "O Forró Caju é realizado na cidade de Estância.",
                "resposta": False,
                "explicacao": "O Forró Caju é realizado em Aracaju, capital de Sergipe.",
                "dica": "É a maior festa junina da capital."
            },
            {
                "tipo": "multipla_escolha",
                "enunciado": "Em que mês acontecem as principais festas juninas de Sergipe?",
                "opcoes": ["Março", "Junho", "Outubro", "Dezembro"],
                "resposta": "Junho",
                "explicacao": "As festas juninas acontecem tradicionalmente no mês de junho.",
                "dica": "O nome 'junina' já dá a dica!"
            }
        ]
    },
    {
        "id": 3,
        "titulo": "Patrimônios de Sergipe",
        "nivel": 2,
        "perguntas": [
            {
                "tipo": "multipla_escolha",
                "enunciado": "A Praça São Francisco é Patrimônio da UNESCO. Em qual cidade fica?",
                "opcoes": ["Aracaju", "São Cristóvão", "Laranjeiras", "Propriá"],
                "resposta": "São Cristóvão",
                "explicacao": "São Cristóvão é a 4ª cidade mais antiga do Brasil e abriga a Praça São Francisco.",
                "dica": "É uma das cidades mais antigas do Brasil."
            },
            {
                "tipo": "verdadeiro_falso",
                "enunciado": "A Renda Irlandesa de Divina Pastora é Patrimônio Imaterial do Brasil.",
                "resposta": True,
                "explicacao": "Registrada pelo IPHAN em 2009 como Patrimônio Cultural do Brasil.",
                "dica": "É uma técnica artesanal de renda de agulha."
            },
            {
                "tipo": "multipla_escolha",
                "enunciado": "O Cânion de Xingó fica às margens de qual rio?",
                "opcoes": ["Rio Sergipe", "Rio Vaza-Barris", "Rio São Francisco", "Rio Japaratuba"],
                "resposta": "Rio São Francisco",
                "explicacao": "O Cânion de Xingó é uma formação no rio São Francisco, em Canindé de São Francisco.",
                "dica": "É o maior rio totalmente brasileiro."
            }
        ]
    }
]

# --- Storage em memória ---
turmas_db = {}
alunos_db = {}
wiki_submissions = []
pontuacoes_db = []

# ============================================================
# MODELOS
# ============================================================

class TurmaCreate(BaseModel):
    nome: str
    professor: str
    escola: str

class AlunoCreate(BaseModel):
    nome: str
    turma_codigo: str

class WikiSubmission(BaseModel):
    titulo: str
    descricao: str
    cidade: str
    categoria: str
    tipo: str  # material ou imaterial
    autor: str
    fonte: Optional[str] = None

class PontuacaoCreate(BaseModel):
    aluno_nome: str
    turma_codigo: str
    jogo: str
    pontos: int

# ============================================================
# ROTAS
# ============================================================

@app.get("/api/health")
def health():
    return {"status": "ok", "app": "Cultura Sergipe MVP"}

# --- Cultura ---
@app.get("/api/cultura")
def listar_cultura():
    return {"data": CULTURA_DATA, "total": len(CULTURA_DATA)}

@app.get("/api/cultura/{id}")
def get_cultura(id: int):
    item = next((c for c in CULTURA_DATA if c["id"] == id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Não encontrado")
    return item

@app.get("/api/cultura/tipo/{tipo}")
def cultura_por_tipo(tipo: str):
    items = [c for c in CULTURA_DATA if c["tipo"] == tipo]
    return {"data": items, "total": len(items)}

# --- Jogo Onde Fica ---
@app.get("/api/jogo/onde-fica")
def jogo_onde_fica():
    import random
    items = random.sample(CULTURA_DATA, min(5, len(CULTURA_DATA)))
    resultado = []
    for item in items:
        resultado.append({
            "id": item["id"],
            "nome": item["nome"],
            "imagem": item["imagem"],
            "descricao": item["descricao"],
            "cidade": item["cidade"],
            "lat": item["lat"],
            "lng": item["lng"]
        })
    return {"perguntas": resultado}

# --- Jogo Material ou Imaterial ---
@app.get("/api/jogo/material-imaterial")
def jogo_material_imaterial():
    import random
    items = random.sample(CULTURA_DATA, min(8, len(CULTURA_DATA)))
    resultado = []
    for item in items:
        resultado.append({
            "id": item["id"],
            "nome": item["nome"],
            "imagem": item["imagem"],
            "descricao": item["descricao"],
            "tipo": item["tipo"],
            "curiosidade": item["curiosidade"]
        })
    return {"cartas": resultado}

# --- Jogo Duolingo Cultural ---
@app.get("/api/jogo/duolingo")
def jogo_duolingo():
    return {"licoes": DUOLINGO_LICOES}

@app.get("/api/jogo/duolingo/{licao_id}")
def get_licao(licao_id: int):
    licao = next((l for l in DUOLINGO_LICOES if l["id"] == licao_id), None)
    if not licao:
        raise HTTPException(status_code=404, detail="Lição não encontrada")
    return licao

# --- Turmas ---
@app.post("/api/turmas")
def criar_turma(turma: TurmaCreate):
    import random
    import string
    codigo = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    turmas_db[codigo] = {
        "codigo": codigo,
        "nome": turma.nome,
        "professor": turma.professor,
        "escola": turma.escola,
        "alunos": [],
        "criado_em": datetime.now().isoformat()
    }
    return turmas_db[codigo]

@app.get("/api/turmas/{codigo}")
def get_turma(codigo: str):
    if codigo not in turmas_db:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    return turmas_db[codigo]

@app.get("/api/turmas")
def listar_turmas():
    return {"turmas": list(turmas_db.values())}

# --- Alunos ---
@app.post("/api/alunos")
def entrar_turma(aluno: AlunoCreate):
    if aluno.turma_codigo not in turmas_db:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    aluno_data = {
        "nome": aluno.nome,
        "turma_codigo": aluno.turma_codigo,
        "pontos_total": 0,
        "jogos_completados": 0
    }
    turmas_db[aluno.turma_codigo]["alunos"].append(aluno_data)
    return aluno_data

# --- Pontuação ---
@app.post("/api/pontuacao")
def registrar_pontuacao(pontuacao: PontuacaoCreate):
    registro = {
        "aluno_nome": pontuacao.aluno_nome,
        "turma_codigo": pontuacao.turma_codigo,
        "jogo": pontuacao.jogo,
        "pontos": pontuacao.pontos,
        "data": datetime.now().isoformat()
    }
    pontuacoes_db.append(registro)
    return registro

@app.get("/api/ranking")
def get_ranking():
    ranking = {}
    for p in pontuacoes_db:
        key = f"{p['aluno_nome']}_{p['turma_codigo']}"
        if key not in ranking:
            ranking[key] = {
                "aluno": p["aluno_nome"],
                "turma": p["turma_codigo"],
                "total": 0,
                "jogos": 0
            }
        ranking[key]["total"] += p["pontos"]
        ranking[key]["jogos"] += 1
    sorted_ranking = sorted(ranking.values(), key=lambda x: x["total"], reverse=True)
    return {"ranking": sorted_ranking[:20]}

@app.get("/api/ranking/{turma_codigo}")
def get_ranking_turma(turma_codigo: str):
    ranking = {}
    for p in pontuacoes_db:
        if p["turma_codigo"] == turma_codigo:
            nome = p["aluno_nome"]
            if nome not in ranking:
                ranking[nome] = {"aluno": nome, "total": 0, "jogos": 0}
            ranking[nome]["total"] += p["pontos"]
            ranking[nome]["jogos"] += 1
    sorted_ranking = sorted(ranking.values(), key=lambda x: x["total"], reverse=True)
    return {"ranking": sorted_ranking}

# --- Wiki Sergipana ---
@app.post("/api/wiki")
def submeter_wiki(sub: WikiSubmission):
    entry = {
        "id": len(wiki_submissions) + 1,
        "titulo": sub.titulo,
        "descricao": sub.descricao,
        "cidade": sub.cidade,
        "categoria": sub.categoria,
        "tipo": sub.tipo,
        "autor": sub.autor,
        "fonte": sub.fonte,
        "status": "pendente",
        "data": datetime.now().isoformat()
    }
    wiki_submissions.append(entry)
    return entry

@app.get("/api/wiki")
def listar_wiki():
    return {"submissions": wiki_submissions, "total": len(wiki_submissions)}

@app.get("/api/wiki/aprovados")
def wiki_aprovados():
    aprovados = [w for w in wiki_submissions if w["status"] == "aprovado"]
    return {"submissions": aprovados, "total": len(aprovados)}

@app.put("/api/wiki/{wiki_id}/aprovar")
def aprovar_wiki(wiki_id: int):
    for w in wiki_submissions:
        if w["id"] == wiki_id:
            w["status"] = "aprovado"
            return w
    raise HTTPException(status_code=404, detail="Submissão não encontrada")

# --- Handler para Vercel ---
handler = Mangum(app)