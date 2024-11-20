import random
import time
import json
import requests
from GeradorDados import gerarDados

HOST = "apisimuladoresimagem-v2-668469425698.southamerica-east1.run.app"  

def enviarApi(message):
    url = f"https://{HOST}/dados"
    res = requests.post(url, json = message)
    print(res.json)

def simularSensores(tipo, quantidadeValores, intervaloMin, intervaloMax, codigoUsuario):

    for _ in range(quantidadeValores):

        data = gerarDados(tipo, codigoUsuario)
        print(f"Dados gerados: {data}")
        
        message = json.dumps(data)
        enviarApi(data)
        print(f"Dados enviados: {message}")

        interval = random.uniform(intervaloMin, intervaloMax)
        time.sleep(interval)

tipo = int(input("Informe o tipo de sensor (1: Pressão Arterial, 2: SPO2, 3: Temperatura): "))
codigoUsuario = int(input("Informe o código do Usuario: "))
quantidadeValores = int(input("Quantidade de valores a serem gerados: "))
intervaloMin = float(input("Intervalo mínimo entre valores (em segundos): "))
intervaloMax = float(input("Intervalo máximo entre valores (em segundos): "))

simularSensores(tipo, quantidadeValores, intervaloMin, intervaloMax, codigoUsuario)  