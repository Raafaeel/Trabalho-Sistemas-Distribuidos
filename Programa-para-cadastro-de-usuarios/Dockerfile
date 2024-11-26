FROM node:22-alpine

WORKDIR /react-dados

COPY . /react-dados

RUN npm install

ENV NEXT_PUBLIC_API_URL_LOGIN=https://myfastapiapp-v3-668469425698.southamerica-east1.run.app
ENV NEXT_PUBLIC_API_URL_DADOS=https://apisimuladoresimagem-v2-668469425698.southamerica-east1.run.app

ENV PORT=3000

EXPOSE 3000

RUN npm run build

CMD ["npm", "run", "start"]
