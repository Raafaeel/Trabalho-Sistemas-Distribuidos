import socket
import requests
import json

HOST = "apisimuladoresimagem-v2-668469425698.southamerica-east1.run.app"  

def enviarApi(message):
    url = f"https://{HOST}/dados"
    res = requests.post(url, json = message)
    print(res.json)

def start_server(host, port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(5)
    print(f"Servidor TCP aguardando conexões em {host}:{port}")
    client_socket, client_address = server_socket.accept()
    print(f"Conexão recebida de {client_address}")

    while True:
        data = client_socket.recv(1024).decode()
        if data:
            data_json = json.loads(data)
            enviarApi(data_json)
            print(f"Dados recebidos: {data}")
        else:
            client_socket, client_address = server_socket.accept()
            print(f"Conexão recebida de {client_address}")
        

start_server("localhost", 8000)
