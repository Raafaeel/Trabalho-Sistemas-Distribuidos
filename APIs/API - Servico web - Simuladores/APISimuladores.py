from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, Float, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Configuração do banco de dados
DATABASE_URL = os.getenv("DATABASE_URL")
print(f"DATABASE_URL: {DATABASE_URL}")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Inicialização da base de dados e criação de sessão
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Inicialização do aplicativo FastAPI
app = FastAPI()

# Definição do modelo de dados para a tabela DadosColetados usando SQLAlchemy
class DadosColetados(Base):
    __tablename__ = "dados_coletados"
    seq = Column(Integer, primary_key=True, index=True)      # Chave primária
    codigo = Column(Integer, nullable=False)                 # ID do usuário
    data_hora = Column(DateTime, default=datetime.utc)    # Data e hora da coleta dos dados
    tipo = Column(Integer, nullable=False)                   # Tipo da medida (1: Pressão Arterial, 2: SPO2, 3: Temperatura)
    valor1 = Column(Float, nullable=False)                   # Valor principal
    valor2 = Column(Float)                                   # Valor secundário (opcional)
    em_casa = Column(Boolean, default=False)                 # Indica se o dado foi coletado em casa

# Criação da tabela no banco de dados
Base.metadata.create_all(bind=engine)

# Definição dos modelos Pydantic para validação de entrada e saída
class DadosColetadosBase(BaseModel):
    codigo: int
    tipo: int
    valor1: float
    valor2: Optional[float] = None
    em_casa: Optional[bool] = False

class DadosColetadosCreate(DadosColetadosBase):
    pass

class DadosColetadosResponse(DadosColetadosBase):
    seq: int
    data_hora: datetime

    class Config:
        orm_mode = True  # Configuração para leitura direta dos dados do ORM

# Função para obter uma nova sessão de banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rota para adicionar um novo registro de dados (POST)
@app.post("/dados", response_model=DadosColetadosResponse)
def adicionar_dados(dado: DadosColetadosCreate, db: SessionLocal = next(get_db())):
    novo_dado = DadosColetados(**dado.model_dump())
    db.add(novo_dado)     # Adiciona o novo registro ao banco de dados
    db.commit()            # Confirma a transação
    db.refresh(novo_dado)  # Atualiza a instância com os dados salvos
    return novo_dado       # Retorna o registro criado

# Rota para listar todos os dados coletados (GET)
@app.get("/dados", response_model=List[DadosColetadosResponse])
def listar_dados(db: SessionLocal = next(get_db())):
    dados = db.query(DadosColetados).all()  # Busca todos os registros na tabela
    return dados                            # Retorna a lista de dados

# Rota para obter um registro específico pelo seu ID (seq) (GET)
@app.get("/dados/{seq}", response_model=DadosColetadosResponse)
def obter_dado(seq: int, db: SessionLocal = next(get_db())):
    dado = db.query(DadosColetados).filter(DadosColetados.seq == seq).first()
    if dado is None:
        raise HTTPException(status_code=404, detail="Dado não encontrado")  # Erro 404 se não encontrado
    return dado  # Retorna o dado encontrado

# Rota para atualizar um registro existente pelo seu ID (seq) (PUT)
@app.put("/dados/{seq}", response_model=DadosColetadosResponse)
def atualizar_dado(seq: int, dado_update: DadosColetadosCreate, db: SessionLocal = next(get_db())):
    dado = db.query(DadosColetados).filter(DadosColetados.seq == seq).first()
    if dado is None:
        raise HTTPException(status_code=404, detail="Dado não encontrado")
    
    # Atualiza os campos do registro com os novos valores recebidos
    for key, value in dado_update.model_dump().items():
        setattr(dado, key, value)
    db.commit()   # Salva as alterações no banco de dados
    db.refresh(dado)  # Atualiza a instância com os dados salvos
    return dado       # Retorna o registro atualizado

# Rota para excluir um registro pelo seu ID (seq) (DELETE)
@app.delete("/dados/{seq}", response_model=model_dump)
def excluir_dado(seq: int, db: SessionLocal = next(get_db())):
    dado = db.query(DadosColetados).filter(DadosColetados.seq == seq).first()
    if dado is None:
        raise HTTPException(status_code=404, detail="Dado não encontrado")
    
    db.delete(dado)  # Remove o registro do banco de dados
    db.commit()      # Confirma a exclusão
    return {"mensagem": "Dado excluído com sucesso"}  # Retorna confirmação de sucesso
