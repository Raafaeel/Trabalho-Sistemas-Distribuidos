import socket
import random
import time

# Configuração do simulador de sensores
def gerar_valor_sensor(tipo_sensor):
    # Configurações para cada tipo de sensor
    if tipo_sensor == 1:  # Pressão Arterial
        valor1 = random.randint(0, 300)  # Sistólica
        valor2 = random.randint(0, 300)  # Diastólica
        if 110 <= valor1 <= 129 and 70 <= valor2 <= 84:
            return valor1, valor2, "Normal"
        else:
            return valor1, valor2, "Anormal"
    
    elif tipo_sensor == 2:  # SPO2
        valor1 = random.randint(0, 100)  # Saturação de oxigênio
        valor2 = random.randint(0, 200)  # Frequência cardíaca
        if 95 <= valor1 <= 100 and 50 <= valor2 <= 100:
            return valor1, valor2, "Normal"
        else:
            return valor1, valor2, "Anormal"
    
    elif tipo_sensor == 3:  # Temperatura Corporal
        valor1 = round(random.uniform(30, 45), 1)  # Temperatura em float
        if 36.0 <= valor1 <= 37.5:
            return valor1, "", "Normal"
        else:
            return valor1, "", "Anormal"

def simulador_sensor(tipo_sensor, num_valores, intervalo_min, intervalo_max):
    server_address = ('localhost', 4000)
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        for _ in range(num_valores):
            valor1, valor2, status = gerar_valor_sensor(tipo_sensor)
            dados = f"{tipo_sensor},{valor1},{valor2},{status}"
            s.sendto(dados.encode(), server_address)
            print(f"Enviado: {dados}")
            intervalo = random.uniform(intervalo_min, intervalo_max)
            time.sleep(intervalo)

# Configurações iniciais do simulador
tipo_sensor = int(input("Informe o tipo de sensor (1: Pressão Arterial, 2: SPO2, 3: Temperatura): "))
num_valores = int(input("Quantidade de valores a serem gerados: "))
intervalo_min = float(input("Intervalo mínimo entre valores (em segundos): "))
intervalo_max = float(input("Intervalo máximo entre valores (em segundos): "))

simulador_sensor(tipo_sensor, num_valores, intervalo_min, intervalo_max)
