FROM node:18-slim

WORKDIR /home/app
COPY package*.json ./
RUN npm i
RUN ln -snf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && echo America/Sao_Paulo > /etc/timezone
COPY . .

CMD ["tail", "-f", "/dev/null"]