from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date
from sqlalchemy import create_engine, Column, Integer, String, Date, Float
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"DATABASE_URL: {DATABASE_URL}")  

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class UsuarioDB(Base):
    __tablename__ = "Usuario"
    codigo = Column(Integer, primary_key=True, index=True)
    Nome = Column(String(50), nullable=False)
    Nascimento = Column(Date, nullable=False)
    Sexo = Column(String(1), nullable=False)
    Latitude = Column(Float)
    Longitude = Column(Float)
    login = Column(String(100), nullable = False)
    senha = Column(String(1024), nullable = False)

Base.metadata.create_all(bind=engine)

class UsuarioBase(BaseModel):
    Nome: str = Field(..., max_length=50)
    Nascimento: date
    Sexo: str = Field(..., max_length=1)
    Latitude: Optional[float] = None
    Longitude: Optional[float] = None
    login: str = Field(..., max_length=1024)
    senha: str = Field(..., max_length=100)


class UsuarioCreate(UsuarioBase):
    pass

class UsuarioUpdate(BaseModel):
    Nome: Optional[str] = Field(None, max_length=50)
    Nascimento: Optional[date] = None
    Sexo: Optional[str] = Field(None, max_length=1)
    Latitude: Optional[float] = None
    Longitude: Optional[float] = None
    login: Optional[str] = Field(None, max_length=100)
    senha: Optional[str] = Field(None, max_length=1024)

class Usuario(UsuarioBase):
    codigo: int

    class Config:
        orm_mode = True

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
     "http://localhost:5000",
    "http://127.0.0.1:5000",
     "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/usuarios", response_model=Usuario, status_code=201)
def create_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = UsuarioDB(
        Nome=usuario.Nome,
        Nascimento=usuario.Nascimento,
        Sexo=usuario.Sexo,
        Latitude=usuario.Latitude,
        Longitude=usuario.Longitude,
        login=usuario.login,
        senha=usuario.senha
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

@app.get("/usuarios", response_model=List[Usuario])
def read_usuarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    usuarios = db.query(UsuarioDB).offset(skip).limit(limit).all()
    return usuarios

@app.get("/usuarios/{codigo}", response_model=Usuario)
def read_usuario(codigo: int, db: Session = Depends(get_db)):
    usuario = db.query(UsuarioDB).filter(UsuarioDB.codigo == codigo).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario

@app.put("/usuarios/{codigo}", response_model=Usuario)
def update_usuario(
    codigo: int, usuario_update: UsuarioUpdate, db: Session = Depends(get_db)
):
    usuario = db.query(UsuarioDB).filter(UsuarioDB.codigo == codigo).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    for var, value in usuario_update.model_dump(exclude_unset=True).items():
        setattr(usuario, var, value)
    db.commit()
    db.refresh(usuario)
    return usuario

@app.delete("/usuarios/{codigo}", status_code=204)
def delete_usuario(codigo: int, db: Session = Depends(get_db)):
    usuario = db.query(UsuarioDB).filter(UsuarioDB.codigo == codigo).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    db.delete(usuario)
    db.commit()
    return

@app.post("/usuarios/login", response_model=Usuario)
def login(login: str, senha: str, db: Session = Depends(get_db)):
    usuario = db.query(UsuarioDB).filter(UsuarioDB.login == login, UsuarioDB.senha == senha).first()
    if usuario is None:
        raise HTTPException(status_code=401, detail="Login ou senha inválidos")
    return usuario

