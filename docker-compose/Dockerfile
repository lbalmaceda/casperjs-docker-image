# CircleCI/node
# https://github.com/CircleCI-Public/circleci-dockerfiles
# Docker Hub: lbalmaceda/nodeqs

FROM circleci/node:8

MAINTAINER lbalmaceda http://github.com/lbalmaceda

WORKDIR /home/circleci/

# credentials replacer
# TO-DO

# casperjs web-app tests
COPY ./casperjs/webapp-tests.js tests/webapp-tests.js

# copy compose file
COPY compose.yml docker-compose.yml

# print dev info
RUN echo "Docker Compose file:  /home/circleci/docker-compose.yml"
RUN echo "CasperJS Tests file:  /home/circleci/tests/webapp-tests.js"
RUN echo "Move the dockerized sample contents to /home/circleci/sample/ and run 'docker-compose up'"


CMD /bin/sh
