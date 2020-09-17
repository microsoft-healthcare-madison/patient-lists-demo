#!/bin/bash
#
# Runs a dockerized hapi server, then loads the example data into it.
#

set -e
set -m
set -u

PORT="${PORT:-8080}"
DATA="${DATA:-example}"

# Switch to the dir _above_ where this script lives.
SCRIPT_DIR="$( dirname ${0} )"
cd "${SCRIPT_DIR}"/..

# Launch the dockerized hapi server.
docker run -p $PORT:$PORT hapiproject/hapi:latest &>/dev/null &

# Busy-wait until the server is up.
echo "Waiting for server to start..."
while true; do
  curl http://localhost:$PORT &>/dev/null \
    && echo "HAPI IS UP" && break \
    || echo "  ... still starting"
  sleep 1
done

echo "Loading ${DATA} data..."
time ./bin/load.py -d "${DATA}"
time ./bin/load.py -d "${DATA}/lists"
echo 'DONE!'

echo "Press Ctrl-C to close the server process..."
echo
fg
