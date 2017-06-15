FROM node:6-slim
# Working directory for application

RUN mkdir -p /mail
WORKDIR /mail
ADD . /mail

EXPOSE 3412

CMD ['npm', 'start']