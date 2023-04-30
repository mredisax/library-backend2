FROM node:16 as builder

RUN apt-get update && apt-get install -y curl 
#    && rm -rf /va/lib/apt/lists/*
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm install

FROM node:16
WORKDIR /app
COPY --from=builder /app /app
COPY . .
#RUN npm install
#RUN npm ci --only=production

#COPY . /app

EXPOSE 3000
CMD ["node", "./src/index.js"]
