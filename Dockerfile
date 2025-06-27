FROM ghcr.io/oscarcalcados/docker-boilerplates:node22oc

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]