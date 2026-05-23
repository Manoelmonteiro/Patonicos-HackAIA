from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import random
import string

app = FastAPI(title="Sergipe Quiz API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# BASE DE QUESTÕES
# ============================================================

QUIZ_DB = [
    {
        "id": 1,
        "categoria": "patrimonio_imaterial",
        "descricao": "Reconhecido como Patrimônio Cultural do Brasil pelo IPHAN, este modo de fazer artesanal é uma tradição secular das mulheres da cidade de Divina Pastora. Trata-se de uma técnica têxtil sofisticada que produz peças requintadas usando agulha, linha e lacê.",
        "opcoes": ["Renda de Bilro", "Renda Irlandesa", "Bordado Filé", "Renda Renascença"],
        "resposta_correta": "Renda Irlandesa",
        "explicacao": "A Renda Irlandesa de Divina Pastora é um patrimônio imaterial. Originalmente ensinada por freiras irlandesas, foi adaptada pelas mulheres sergipanas ganhando traços locais."
    },
    {
        "id": 2,
        "categoria": "patrimonio_imaterial",
        "descricao": "É uma manifestação folclórica típica das festas juninas da cidade de Estância. Trata-se de um artefato pirotécnico, construído em madeira e papelão, que desliza velozmente sobre um arame impulsionado pela força de foguetes.",
        "opcoes": ["Balão Luminoso", "Guerra de Espadas", "Barco de Fogo", "Bumba Meu Boi Festivo"],
        "resposta_correta": "Barco de Fogo",
        "explicacao": "O Barco de Fogo é o maior símbolo do São João de Estância (SE) e representa a criatividade pirotécnica do povo local."
    },
    {
        "id": 3,
        "categoria": "patrimonio_imaterial",
        "descricao": "Festa folclórica tradicionalíssima da cidade de Laranjeiras, realizada em outubro. A celebração é um teatro a céu aberto que simula a batalha entre negros escravizados (que pintam o corpo de preto misturado com melaço) e os indígenas, que atuam como capitães do mato.",
        "opcoes": ["Congada e Moçambique", "Maracatu Rural", "Festa de Iemanjá", "Lambe-Sujos e Caboclinhos"],
        "resposta_correta": "Lambe-Sujos e Caboclinhos",
        "explicacao": "A festa celebra a resistência negra, recriando a dinâmica dos quilombos na região canavieira do Vale do Cotinguiba."
    },
    {
        "id": 4,
        "categoria": "patrimonio_material",
        "descricao": "Localizado na 4ª cidade mais antiga do Brasil, este complexo arquitetônico foi chancelado pela UNESCO como Patrimônio Mundial da Humanidade em 2010. Ele representa uma fusão ímpar das arquiteturas portuguesa e espanhola devido à União Ibérica.",
        "opcoes": ["Praça São Francisco (São Cristóvão)", "Mercado Antônio Franco (Aracaju)", "Igreja Matriz de Nossa Senhora da Vitória", "Forte de São Romédio"],
        "resposta_correta": "Praça São Francisco (São Cristóvão)",
        "explicacao": "A Praça São Francisco é um conjunto monumental excepcional que atesta o período em que Portugal e Espanha estavam sob a mesma coroa."
    },
    {
        "id": 5,
        "categoria": "patrimonio_material",
        "descricao": "Situado em Aracaju, no prédio de um antigo colégio, este é um dos mais modernos museus interativos do Brasil, criado nos mesmos moldes do Museu da Língua Portuguesa. Seu foco é a valorização da identidade, arte e folclore locais.",
        "opcoes": ["Museu de Arqueologia de Xingó", "Museu da Gente Sergipana", "Palácio Museu Olímpio Campos", "Museu Histórico de Sergipe"],
        "resposta_correta": "Museu da Gente Sergipana",
        "explicacao": "O Museu da Gente Sergipana Gov. Marcelo Déda é referência em tecnologia interativa voltada à imersão cultural."
    },
    {
        "id": 6,
        "categoria": "personalidades",
        "descricao": "Nascido em Japaratuba (SE) no início do século XX, este homem passou grande parte da vida internado em uma colônia psiquiátrica no Rio de Janeiro. Acreditando ter uma missão divina, produziu mantos e estandartes com sucata e linhas desfiadas, sendo hoje considerado um dos maiores artistas contemporâneos do Brasil.",
        "opcoes": ["Cândido Portinari", "Mestre Vitalino", "Arthur Bispo do Rosário", "Sílvio Romero"],
        "resposta_correta": "Arthur Bispo do Rosário",
        "explicacao": "Bispo do Rosário rompeu as barreiras entre a loucura e a arte, tendo suas obras expostas na Bienal de Veneza e em museus do mundo todo."
    },
    {
        "id": 7,
        "categoria": "personalidades",
        "descricao": "Nascido na antiga Vila de Campos (que hoje leva seu nome) em 1839, foi um dos intelectuais mais brilhantes do Brasil Imperial. Filósofo, poeta, jurista e figura central da 'Escola do Recife', introduziu o estudo da filosofia alemã no Brasil.",
        "opcoes": ["Tobias Barreto", "Gilberto Freyre", "Castro Alves", "João Ribeiro"],
        "resposta_correta": "Tobias Barreto",
        "explicacao": "Tobias Barreto de Meneses é o patrono da cadeira 38 da Academia Brasileira de Letras e um marco na emancipação filosófica brasileira."
    },
    {
        "id": 8,
        "categoria": "personalidades",
        "descricao": "Conhecida como a 'Rainha do Forró', esta cantora pernambucana radicou-se em Aracaju e tornou-se a maior voz feminina da música sergipana, imortalizando sucessos como 'Prenda o Tadeu' e 'Forró Cheiroso'.",
        "opcoes": ["Marinês", "Anastácia", "Elba Ramalho", "Clemilda"],
        "resposta_correta": "Clemilda",
        "explicacao": "Clemilda apresentou por anos o programa 'Forró no Asfalto' na TV Aperipê em Sergipe, sendo um ícone da cultura popular."
    },
    {
        "id": 9,
        "categoria": "dialeto",
        "descricao": "No linguajar popular sergipano (o famoso Sergipanês), se um objeto, como uma roupa ou um parafuso, está muito largo, bambo ou sem dar aperto, a pessoa dirá que ele está:",
        "opcoes": ["Avexado", "Foló", "Estribado", "Troncho"],
        "resposta_correta": "Foló",
        "explicacao": "No dicionário de Sergipanês, 'Foló' significa algo afrouxado ou largo. 'Ele vestiu a calça, mas ficou foló no corpo'."
    },
    {
        "id": 10,
        "categoria": "dialeto",
        "descricao": "Imagine a seguinte situação: Um sergipano conta uma piada extremamente engraçada numa roda de amigos. A reação natural das pessoas ao rir bem alto e de forma escandalosa é dar uma:",
        "opcoes": ["Gaitada", "Munganga", "Zoada", "Xitada"],
        "resposta_correta": "Gaitada",
        "explicacao": "'Dar uma gaitada' no dialeto sergipano significa rir alto, soltar uma gargalhada."
    },
    {
        "id": 11,
        "categoria": "povos_comunidades",
        "descricao": "Localizados principalmente nas margens do Rio São Francisco, no município de Porto da Folha, eles representam o único povo indígena demarcado e reconhecido oficialmente no estado de Sergipe. Estamos falando da etnia:",
        "opcoes": ["Tupinambá", "Xocó", "Pataxó", "Guarani Kaiowá"],
        "resposta_correta": "Xocó",
        "explicacao": "O Povo Xocó resistiu por séculos à colonização e invasões na Ilha de São Pedro, e é um símbolo fundamental da resistência indígena sergipana."
    }
]

CATEGORIAS_VALIDAS = [
    "personalidades",
    "patrimonio_material",
    "patrimonio_imaterial",
    "dialeto",
    "povos_comunidades"
]

# ============================================================
# STORAGE EM MEMÓRIA (substituir por DB em produção)
# ============================================================

professores_db: dict = {}   # { professor_id: {...} }
turmas_db: dict = {}        # { turma_codigo: {...} }
alunos_db: dict = {}        # { aluno_id: {...} }
sessoes_db: dict = {}       # { sessao_id: {...} }
pontuacoes_db: list = []    # [ {...} ]

# ============================================================
# HELPERS
# ============================================================

def gerar_codigo(tamanho: int = 6) -> str:
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=tamanho))

def questoes_por_categorias(categorias: List[str]) -> list:
    return [q for q in QUIZ_DB if q["categoria"] in categorias]

# ============================================================
# MODELOS
# ============================================================

class ProfessorCreate(BaseModel):
    nome: str
    email: str
    escola: str

class TurmaCreate(BaseModel):
    nome: str
    professor_id: str

class TurmaConfig(BaseModel):
    categorias: List[str]           # categorias habilitadas para a turma
    quantidade_questoes: Optional[int] = 10

class AlunoEntrar(BaseModel):
    nome: str
    turma_codigo: str

class RespostaQuiz(BaseModel):
    aluno_id: str
    sessao_id: str
    questao_id: int
    resposta: str

class PontuacaoCreate(BaseModel):
    aluno_id: str
    turma_codigo: str
    pontos: int
    total_questoes: int
    acertos: int

# ============================================================
# ROTAS — HEALTH
# ============================================================

@app.get("/api/health")
def health():
    return {"status": "ok", "versao": "1.0.0"}

# ============================================================
# ROTAS — CATEGORIAS
# ============================================================

@app.get("/api/categorias")
def listar_categorias():
    """Retorna todas as categorias disponíveis."""
    resumo = []
    for cat in CATEGORIAS_VALIDAS:
        total = len([q for q in QUIZ_DB if q["categoria"] == cat])
        resumo.append({"categoria": cat, "total_questoes": total})
    return {"categorias": resumo}

# ============================================================
# ROTAS — PROFESSORES
# ============================================================

@app.post("/api/professores", status_code=201)
def criar_professor(professor: ProfessorCreate):
    """Cadastra um novo professor."""
    # Verifica duplicidade de e-mail
    existe = next((p for p in professores_db.values() if p["email"] == professor.email), None)
    if existe:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")

    prof_id = gerar_codigo(8)
    professores_db[prof_id] = {
        "id": prof_id,
        "nome": professor.nome,
        "email": professor.email,
        "escola": professor.escola,
        "criado_em": datetime.now().isoformat()
    }
    return professores_db[prof_id]

@app.get("/api/professores/{professor_id}")
def get_professor(professor_id: str):
    if professor_id not in professores_db:
        raise HTTPException(status_code=404, detail="Professor não encontrado.")
    prof = professores_db[professor_id]
    turmas = [t for t in turmas_db.values() if t["professor_id"] == professor_id]
    return {**prof, "turmas": turmas}

# ============================================================
# ROTAS — TURMAS
# ============================================================

@app.post("/api/turmas", status_code=201)
def criar_turma(turma: TurmaCreate):
    """Professor cria uma nova turma."""
    if turma.professor_id not in professores_db:
        raise HTTPException(status_code=404, detail="Professor não encontrado.")

    codigo = gerar_codigo(6)
    # Garante código único
    while codigo in turmas_db:
        codigo = gerar_codigo(6)

    turmas_db[codigo] = {
        "codigo": codigo,
        "nome": turma.nome,
        "professor_id": turma.professor_id,
        "professor_nome": professores_db[turma.professor_id]["nome"],
        "categorias_habilitadas": list(CATEGORIAS_VALIDAS),  # todas por padrão
        "quantidade_questoes": 10,
        "alunos": [],
        "criado_em": datetime.now().isoformat()
    }
    return turmas_db[codigo]

@app.get("/api/turmas/{codigo}")
def get_turma(codigo: str):
    if codigo not in turmas_db:
        raise HTTPException(status_code=404, detail="Turma não encontrada.")
    return turmas_db[codigo]

@app.put("/api/turmas/{codigo}/config")
def configurar_turma(codigo: str, config: TurmaConfig):
    """
    Professor define quais categorias e quantas questões
    serão usadas nos jogos da turma.
    """
    if codigo not in turmas_db:
        raise HTTPException(status_code=404, detail="Turma não encontrada.")

    invalidas = [c for c in config.categorias if c not in CATEGORIAS_VALIDAS]
    if invalidas:
        raise HTTPException(
            status_code=400,
            detail=f"Categorias inválidas: {invalidas}. Use: {CATEGORIAS_VALIDAS}"
        )

    questoes_disponiveis = len(questoes_por_categorias(config.categorias))
    qtd = min(config.quantidade_questoes or 10, questoes_disponiveis)

    turmas_db[codigo]["categorias_habilitadas"] = config.categorias
    turmas_db[codigo]["quantidade_questoes"] = qtd

    return {
        "mensagem": "Configuração salva.",
        "categorias_habilitadas": config.categorias,
        "quantidade_questoes": qtd,
        "questoes_disponiveis": questoes_disponiveis
    }

@app.get("/api/professores/{professor_id}/turmas")
def listar_turmas_professor(professor_id: str):
    if professor_id not in professores_db:
        raise HTTPException(status_code=404, detail="Professor não encontrado.")
    turmas = [t for t in turmas_db.values() if t["professor_id"] == professor_id]
    return {"turmas": turmas, "total": len(turmas)}

# ============================================================
# ROTAS — ALUNOS
# ============================================================

@app.post("/api/alunos/entrar", status_code=201)
def aluno_entrar_turma(dados: AlunoEntrar):
    """Aluno entra na turma pelo código."""
    if dados.turma_codigo not in turmas_db:
        raise HTTPException(status_code=404, detail="Turma não encontrada. Verifique o código.")

    aluno_id = gerar_codigo(8)
    aluno = {
        "id": aluno_id,
        "nome": dados.nome,
        "turma_codigo": dados.turma_codigo,
        "pontos_total": 0,
        "partidas_jogadas": 0,
        "entrou_em": datetime.now().isoformat()
    }
    alunos_db[aluno_id] = aluno
    turmas_db[dados.turma_codigo]["alunos"].append({
        "id": aluno_id,
        "nome": dados.nome
    })
    return aluno

@app.get("/api/alunos/{aluno_id}")
def get_aluno(aluno_id: str):
    if aluno_id not in alunos_db:
        raise HTTPException(status_code=404, detail="Aluno não encontrado.")
    return alunos_db[aluno_id]

# ============================================================
# ROTAS — QUIZ (o jogo em si)
# ============================================================

@app.get("/api/quiz/{turma_codigo}/iniciar")
def iniciar_quiz(turma_codigo: str, aluno_id: str):
    """
    Inicia uma sessão de quiz para um aluno.
    Retorna questões embaralhadas com base nas categorias da turma.
    As opções de cada questão também são embaralhadas.
    A resposta correta NÃO é enviada ao frontend.
    """
    if turma_codigo not in turmas_db:
        raise HTTPException(status_code=404, detail="Turma não encontrada.")
    if aluno_id not in alunos_db:
        raise HTTPException(status_code=404, detail="Aluno não encontrado.")

    turma = turmas_db[turma_codigo]
    categorias = turma["categorias_habilitadas"]
    quantidade = turma["quantidade_questoes"]

    pool = questoes_por_categorias(categorias)
    if not pool:
        raise HTTPException(status_code=400, detail="Nenhuma questão disponível para as categorias selecionadas.")

    selecionadas = random.sample(pool, min(quantidade, len(pool)))

    # Monta questões SEM a resposta correta (enviada só na validação)
    questoes_para_frontend = []
    for q in selecionadas:
        opcoes_embaralhadas = q["opcoes"][:]
        random.shuffle(opcoes_embaralhadas)
        questoes_para_frontend.append({
            "id": q["id"],
            "categoria": q["categoria"],
            "descricao": q["descricao"],
            "opcoes": opcoes_embaralhadas
        })

    sessao_id = gerar_codigo(10)
    sessoes_db[sessao_id] = {
        "sessao_id": sessao_id,
        "aluno_id": aluno_id,
        "turma_codigo": turma_codigo,
        "questoes_ids": [q["id"] for q in selecionadas],
        "respostas": {},           # { questao_id: resposta_do_aluno }
        "iniciada_em": datetime.now().isoformat(),
        "finalizada": False
    }

    return {
        "sessao_id": sessao_id,
        "total_questoes": len(questoes_para_frontend),
        "questoes": questoes_para_frontend
    }

@app.post("/api/quiz/responder")
def responder_questao(resposta: RespostaQuiz):
    """
    Valida uma resposta individual e retorna se está correta + explicação.
    """
    if resposta.sessao_id not in sessoes_db:
        raise HTTPException(status_code=404, detail="Sessão não encontrada.")

    sessao = sessoes_db[resposta.sessao_id]

    if sessao["finalizada"]:
        raise HTTPException(status_code=400, detail="Esta sessão já foi finalizada.")

    if resposta.aluno_id != sessao["aluno_id"]:
        raise HTTPException(status_code=403, detail="Aluno não pertence a esta sessão.")

    if resposta.questao_id not in sessao["questoes_ids"]:
        raise HTTPException(status_code=400, detail="Questão não pertence a esta sessão.")

    questao = next((q for q in QUIZ_DB if q["id"] == resposta.questao_id), None)
    if not questao:
        raise HTTPException(status_code=404, detail="Questão não encontrada.")

    correta = resposta.resposta.strip() == questao["resposta_correta"].strip()

    # Salva resposta na sessão
    sessao["respostas"][resposta.questao_id] = {
        "resposta_aluno": resposta.resposta,
        "correta": correta
    }

    return {
        "questao_id": resposta.questao_id,
        "correta": correta,
        "resposta_correta": questao["resposta_correta"],
        "explicacao": questao["explicacao"]
    }

@app.post("/api/quiz/{sessao_id}/finalizar")
def finalizar_quiz(sessao_id: str):
    """
    Finaliza a sessão, calcula pontuação e registra no ranking.
    """
    if sessao_id not in sessoes_db:
        raise HTTPException(status_code=404, detail="Sessão não encontrada.")

    sessao = sessoes_db[sessao_id]

    if sessao["finalizada"]:
        raise HTTPException(status_code=400, detail="Sessão já finalizada.")

    total = len(sessao["questoes_ids"])
    acertos = sum(1 for r in sessao["respostas"].values() if r["correta"])
    pontos = acertos * 10  # 10 pontos por acerto

    sessao["finalizada"] = True
    sessao["acertos"] = acertos
    sessao["pontos"] = pontos
    sessao["finalizada_em"] = datetime.now().isoformat()

    # Atualiza totais do aluno
    aluno_id = sessao["aluno_id"]
    if aluno_id in alunos_db:
        alunos_db[aluno_id]["pontos_total"] += pontos
        alunos_db[aluno_id]["partidas_jogadas"] += 1

    # Registra na lista de pontuações
    pontuacoes_db.append({
        "aluno_id": aluno_id,
        "aluno_nome": alunos_db[aluno_id]["nome"] if aluno_id in alunos_db else "Desconhecido",
        "turma_codigo": sessao["turma_codigo"],
        "pontos": pontos,
        "acertos": acertos,
        "total_questoes": total,
        "data": datetime.now().isoformat()
    })

    return {
        "sessao_id": sessao_id,
        "total_questoes": total,
        "acertos": acertos,
        "erros": total - acertos,
        "pontos": pontos,
        "percentual": round((acertos / total) * 100, 1) if total > 0 else 0
    }

# ============================================================
# ROTAS — RANKING
# ============================================================

@app.get("/api/ranking/{turma_codigo}")
def ranking_turma(turma_codigo: str):
    """Ranking de pontuação de uma turma específica."""
    if turma_codigo not in turmas_db:
        raise HTTPException(status_code=404, detail="Turma não encontrada.")

    agregado: dict = {}
    for p in pontuacoes_db:
        if p["turma_codigo"] != turma_codigo:
            continue
        aid = p["aluno_id"]
        if aid not in agregado:
            agregado[aid] = {
                "aluno_id": aid,
                "aluno_nome": p["aluno_nome"],
                "pontos_total": 0,
                "partidas": 0,
                "acertos_total": 0
            }
        agregado[aid]["pontos_total"] += p["pontos"]
        agregado[aid]["partidas"] += 1
        agregado[aid]["acertos_total"] += p["acertos"]

    ranking = sorted(agregado.values(), key=lambda x: x["pontos_total"], reverse=True)
    return {"turma_codigo": turma_codigo, "ranking": ranking}

# ============================================================
# HANDLER VERCEL
# ============================================================

handler = Mangum(app)