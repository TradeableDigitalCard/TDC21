FROM node:14.17

WORKDIR /app
COPY src /app

RUN npm i

CMD ["npm", "run", "dev", "--", "-p", "8000"]
