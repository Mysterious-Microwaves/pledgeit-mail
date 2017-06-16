FROM node:6-slim
# Working directory for application

RUN mkdir -p /mail
WORKDIR /mail
ADD . /mail

# # Download nodemon for development
# RUN npm install --global nodemon

RUN npm install -g yarn
RUN npm install -g nodemon
RUN npm install webpack -g
RUN npm install babel -g
RUN npm install knex -g

RUN yarn
RUN yarn global add grunt-cli knex

EXPOSE 3412

CMD ['npm', 'start']