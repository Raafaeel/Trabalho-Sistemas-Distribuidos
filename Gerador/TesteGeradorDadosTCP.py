import socket

def start_server(host, port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(5)
    print(f"Servidor TCP aguardando conexões em {host}:{port}")
    client_socket, client_address = server_socket.accept()
    print(f"Conexão recebida de {client_address}")

    while True:
        data = client_socket.recv(1024).decode('utf-8')
        if data:
            print(f"Dados recebidos: {data}")
        else:
            client_socket, client_address = server_socket.accept()
            print(f"Conexão recebida de {client_address}")
        

start_server("localhost", 3000)
