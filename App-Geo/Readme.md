
# Aplicativo georeferenciado para dispositivos móveis

O **App-Geo** é um aplicativo desenvolvido com React Native, utilizando o Expo, que permite inserir dados sobre a saúde do usuário, além de realizar funcionalidades como login e verificação de proximidade caso esteja em casa ou não.

## Como Rodar o Aplicativo

Para rodar o **App-Geo**, siga os passos abaixo:

### Requisitos

- **Node.js**: Certifique-se de ter o Node.js instalado em seu sistema. Você pode verificar se o Node.js está instalado com o comando:

    ```bash
    node -v

- **Expo CLI**: O Expo CLI é necessário para rodar o projeto. Se você ainda não tem o Expo CLI instalado, pode instalar globalmente utilizando o comando:

    ```bash
    npm install -g expo-cli

- **Aplicativo Expo**: Instale o Expo Go no seu dispositivo móvel. O Expo Go está disponível para Android e iOS e será necessário para visualizar o aplicativo no seu celular.

### Passos para rodar o App

- Clone o repositório: Clone o repositório do App-Geo em sua máquina local:

    ```bash
    git clone https://github.com/seu-usuario/app-geo.git

- Instale as dependências: Navegue até o diretório do projeto e instale as dependências:

    ```bash
    cd app-geo
    npm install

- Inicie o servidor com tunel: Para rodar o aplicativo, use o Expo CLI com a opção --tunnel para garantir que o aplicativo funcione corretamente, mesmo em redes diferentes:

    ```bash
    npx expo start --tunnel

- Abra o aplicativo Expo no seu celular: Abra o aplicativo Expo Go no seu celular (disponível na Play Store ou App Store) e escaneie o QR code gerado no terminal.

## Como Funciona

O **App-Geo** permite que o usuário faça login e visualize dados relacionados à sua saúde, com as seguintes informações disponíveis:

- Tipo 1: Pressão Arterial
- Tipo 2: SPO2 e Frequência Cardíaca
- Tipo 3: Temperatura Corporal

O usuário também pode incluir novas informações relacionadas à sua saúde diretamente no aplicativo.

O aplicativo verifica se o usuário está em casa ou não, com base em sua localização atual (latitude e longitude). Se a localização do usuário estiver dentro de um raio determinado, o dispositivo informará que ele está em casa.
