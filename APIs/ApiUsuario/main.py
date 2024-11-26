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
from google.oauth2 import id_token
from google.auth.transport import requests


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"DATABASE_URL: {DATABASE_URL}")  

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class LoginRequest(BaseModel):
    login: str
    senha: str


class UsuarioDB(Base):
    __tablename__ = "Usuario"
    codigo = Column(Integer, primary_key=True, index=True)
    Nome = Column(String(50), nullable=False)
    Nascimento = Column(Date, nullable=False)
    Sexo = Column(String(1), nullable=True)
    Latitude = Column(Float, nullable = True)
    Longitude = Column(Float, nullable = True)
    login = Column(String(100), nullable = False)
    senha = Column(String(1024), nullable=True)

Base.metadata.create_all(bind=engine)

class UsuarioBase(BaseModel):
    Nome: str = Field(..., max_length=50)
    Nascimento: Optional[date] = None
    Sexo: Optional[str] = Field(None, max_length=1)
    Latitude: Optional[float] = None
    Longitude: Optional[float] = None
    login: str = Field(..., max_length=1024)
    senha: Optional[str] = Field(None, max_length=100)


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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing; restrict in production
    allow_credentials=True,  # Allow cookies or authorization headers
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all HTTP headers
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

@app.post("/usuarios/login", response_model=Usuario)
def login(login: str, senha: str, db: Session = Depends(get_db)):
    usuario = db.query(UsuarioDB).filter(UsuarioDB.login == login, UsuarioDB.senha == senha).first()
    if usuario is None:
        raise HTTPException(status_code=401, detail="Login ou senha inválidos")
    return usuario

@app.post("/usuarios/loginJson", response_model=Usuario)
def loginJson(request: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(UsuarioDB).filter(
        UsuarioDB.login == request.login,
        UsuarioDB.senha == request.senha
    ).first()
    if usuario is None:
        raise HTTPException(status_code=401, detail="Login ou senha inválidos")
    return usuario

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



class GoogleAuthRequest(BaseModel):
    token: str

@app.post("/auth/google")
def google_auth(request: GoogleAuthRequest, db: Session = Depends(get_db)):
    client_ids = [
        "668469425698-17ulsbs51rvuejdd1pkco6bhtilotqs5.apps.googleusercontent.com", 
        "668469425698-139ftmp7dkubcvs0q6hv9r8ftt5iklsp.apps.googleusercontent.com",  
    ]

    idinfo = None
    for client_id in client_ids:
        try:
            # Verify token against the current Client ID
            idinfo = id_token.verify_oauth2_token(
                request.token, requests.Request(), client_id
            )
            break  # If successful, exit the loop
        except ValueError:
            continue  # Try the next Client ID

    if not idinfo:
        raise HTTPException(status_code=400, detail="Invalid Google token")

    # Validate the issuer
    if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
        raise HTTPException(status_code=400, detail="Wrong issuer")

    google_id = idinfo["sub"]
    email = idinfo["email"]
    name = idinfo.get("name", "Unknown User")

    # Check if user exists
    user = db.query(UsuarioDB).filter(UsuarioDB.login == email).first()
    if not user:
        # Create user if not found
        user = UsuarioDB(
            Nome=name,
            Nascimento=date.today(),
            Sexo="",
            Latitude=None,
            Longitude=None,
            login=email,
            senha=None,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Return the user
    return {
        "message": "Login successful",
        "user": {
            "id": user.codigo,
            "name": user.Nome,
            "email": user.login,
        },
    }


