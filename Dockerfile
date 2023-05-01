FROM node:18-slim


WORKDIR /home/app
COPY package*.json ./
RUN npm i
COPY . .

CMD ["tail", "-f", "/dev/null"]