# CasperJS
# http://casperjs.org/
# Docker Hub: lbalmaceda/casperqs
#
# Usage
#  exec mode
#    docker run --rm lbalmaceda/casperjs casperjs --version
#    docker run --rm lbalmaceda/casperjs phantomjs --version
#
#  daemon mode
#    docker run -d --name casperjs-daemon -v /home/ubuntu/test:/mnt/test --restart always lbalmaceda/casperjs

FROM vitr/casperjs

MAINTAINER lbalmaceda http://github.com/lbalmaceda

WORKDIR /root

# basic binaries
RUN apt-get update \
  && apt-get install -y sudo netcat curl tar

# docker
RUN set -ex \
  && export DOCKER_VERSION=$(curl --silent --fail --retry 3 https://download.docker.com/linux/static/stable/x86_64/ | grep -o -e 'docker-[.0-9]*-ce\.tgz' | sort -r | head -n 1) \
  && DOCKER_URL="https://download.docker.com/linux/static/stable/x86_64/${DOCKER_VERSION}" \
  && echo Docker URL: $DOCKER_URL \
  && curl --silent --show-error --location --fail --retry 3 --output /tmp/docker.tgz "${DOCKER_URL}" \
  && ls -lha /tmp/docker.tgz \
  && tar -xz -C /tmp -f /tmp/docker.tgz \
  && mv /tmp/docker/* /usr/bin \
  && rm -rf /tmp/docker /tmp/docker.tgz \
  && which docker \
  && (docker version || true)

# docker compose
RUN COMPOSE_URL="https://circle-downloads.s3.amazonaws.com/circleci-images/cache/linux-amd64/docker-compose-latest" \
  && curl --silent --show-error --location --fail --retry 3 --output /usr/bin/docker-compose $COMPOSE_URL \
  && chmod +x /usr/bin/docker-compose \
  && docker-compose version

# wait
COPY scripts/wait /usr/local/bin/wait
RUN chmod +x /usr/local/bin/wait

# credentials replacer
# TO-DO

# casperjs web-app tests
COPY casperjs/webapp-tests.js webapp-tests.js

# reset from parent image
ENTRYPOINT []

# run as daemon
CMD echo "casperjs available.." && tail -f /dev/null
