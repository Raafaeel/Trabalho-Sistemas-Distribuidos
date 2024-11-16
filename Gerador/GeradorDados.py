import random
from datetime import datetime

def gerarDados(tipo, codigoUsuario):
    
    valor1 = None
    valor2 = None

    if random.randint(0, 100) <= 80: # Valores Normais
        if tipo == 1:  # Pressão Arterial
            valor1 = float(random.randint(110, 129))
            valor2 = float(random.randint(70, 84))
        
        elif tipo == 2:  # SPO2 e Frequencia Cardiaca
            valor1 = float(random.randint(95, 100))
            valor2 = float(random.randint(50, 100))
        
        elif tipo == 3:  # Temperatura Corporal
            valor1 = round(random.uniform(36, 37.5), 2)

    else: # Valores Anormais
        if tipo == 1:  # Pressão Arterial
            while valor1 == None or valor1 >= 110 and valor1 <= 129:
                valor1 = float(random.randint(0, 300))
            while valor2 == None or valor2 >= 70 and valor2 <= 84:
                valor2 = float(random.randint(0, 300))
        
        elif tipo == 2:  # SPO2 e Frequencia Cardiaca
            valor1 = float(random.randint(0, 94))
            while valor2 == None or valor2 >= 50 and valor2 <= 100:
                valor2 = float(random.randint(0, 200))
        
        elif tipo == 3:  # Temperatura Corporal
            while valor1 == None or valor1 >= 36 and valor1 <= 37.5:
                valor1 = round(random.uniform(30, 45), 2)
    
    dataHora = datetime.now()
    dataFormatada = dataHora.strftime("%Y-%m-%d %H:%M:%S")

    if(valor2 == None):
        return {"codigo" : codigoUsuario,  "Tipo" : tipo, "Valor1": valor1}
    return {"codigo" : codigoUsuario,  "Tipo" : tipo, "Valor1": valor1, "Valor2": valor2, "EmCasa": None}
