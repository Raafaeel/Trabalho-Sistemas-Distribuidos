from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
from sqlalchemy import create_engine, Column, Integer, Float, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
import os

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")
print(f"DATABASE_URL: {DATABASE_URL}")
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

# SQLAlchemy model
class DadosColetados(Base):
    __tablename__ = "DadosColetados"
    seq = Column(Integer, primary_key=True, index=True)
    codigo = Column(Integer, nullable=False)
    DataHora = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    Tipo = Column(Integer, nullable=False)
    Valor1 = Column(Float, nullable=False)
    Valor2 = Column(Float)
    EmCasa = Column(Boolean, default=False)

Base.metadata.create_all(bind=engine)

# Pydantic models
class DadosColetadosBase(BaseModel):
    codigo: int
    Tipo: int
    Valor1: float
    Valor2: Optional[float] = None
    EmCasa: Optional[bool] = None

class DadosColetadosCreate(DadosColetadosBase):
    pass

class DadosColetadosResponse(DadosColetadosBase):
    seq: int
    DataHora: datetime

    class Config:
        from_attributes = True  # Updated for Pydantic v2

# Dependency injection function
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Route to add new data (POST)
@app.post("/dados", response_model=DadosColetadosResponse)
def adicionar_dados(dado: DadosColetadosCreate, db: Session = Depends(get_db)):
    novo_dado = DadosColetados(**dado.model_dump())
    db.add(novo_dado)
    db.commit()
    db.refresh(novo_dado)
    return novo_dado

# Route to list all collected data (GET)
@app.get("/dados", response_model=List[DadosColetadosResponse])
def listar_dados(codigo: Optional[int] = None, db: Session = Depends(get_db)):
    if codigo is not None:
        dados = db.query(DadosColetados).filter(DadosColetados.codigo == codigo).all()
    else:
        dados = db.query(DadosColetados).all()
    return dados

# Route to get a specific record by ID (seq) (GET)
@app.get("/dados/{seq}", response_model=DadosColetadosResponse)
def obter_dado(seq: int, db: Session = Depends(get_db)):
    dado = db.query(DadosColetados).filter(DadosColetados.seq == seq).first()
    if dado is None:
        raise HTTPException(status_code=404, detail="Dado não encontrado")
    return dado

# Route to update an existing record by ID (seq) (PUT)
@app.put("/dados/{seq}", response_model=DadosColetadosResponse)
def atualizar_dado(seq: int, dado_update: DadosColetadosCreate, db: Session = Depends(get_db)):
    dado = db.query(DadosColetados).filter(DadosColetados.seq == seq).first()
    if dado is None:
        raise HTTPException(status_code=404, detail="Dado não encontrado")
    for key, value in dado_update.model_dump().items():
        setattr(dado, key, value)
    db.commit()
    db.refresh(dado)
    return dado

# Define a response model for the DELETE route
class MessageResponse(BaseModel):
    mensagem: str

# Route to delete a record by ID (seq) (DELETE)
@app.delete("/dados/{seq}", response_model=MessageResponse)
def excluir_dado(seq: int, db: Session = Depends(get_db)):
    dado = db.query(DadosColetados).filter(DadosColetados.seq == seq).first()
    if dado is None:
        raise HTTPException(status_code=404, detail="Dado não encontrado")
    db.delete(dado)
    db.commit()
    return {"mensagem": "Dado excluído com sucesso"}
