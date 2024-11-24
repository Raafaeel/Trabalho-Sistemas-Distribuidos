import socket
import random
import time
import json
from GeradorDados import gerarDados

PORT = 8000
HOST = "10.128.0.3"  

def simularSensores(tipo, quantidadeValores, intervaloMin, intervaloMax, codigoUsuario):

    clientSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    clientSocket.connect((HOST, PORT))

    for _ in range(quantidadeValores):

        data = gerarDados(tipo, codigoUsuario)
        print(f"Dados gerados: {data}")
        
        message = json.dumps(data).encode()
        clientSocket.send(message)
        print(f"Dados enviados: {message}")

        interval = random.uniform(intervaloMin, intervaloMax)
        time.sleep(interval)

    clientSocket.close()

tipo = int(input("Informe o tipo de sensor (1: Pressão Arterial, 2: SPO2, 3: Temperatura): "))
codigoUsuario = int(input("Informe o código do Usuario: "))
quantidadeValores = int(input("Quantidade de valores a serem gerados: "))
intervaloMin = float(input("Intervalo mínimo entre valores (em segundos): "))
intervaloMax = float(input("Intervalo máximo entre valores (em segundos): "))

simularSensores(tipo, quantidadeValores, intervaloMin, intervaloMax, codigoUsuario)  