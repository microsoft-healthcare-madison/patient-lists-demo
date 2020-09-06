#!/bin/bash
#
# Runs a dockerized hapi server, then loads the example data into it.
#

set -e
set -u

PORT="${PORT:-8080}"
DATA="example"

# Switch to the dir _above_ where this script lives.
THIS_DIR="$( dirname ${0%/*} )"
cd "${THIS_DIR}"/..

# Launch the dockerized hapi server.
docker run -p $PORT:$PORT hapiproject/hapi:latest &

# Busy-wait until the server is up.
echo "Waiting for server to start..."
while true; do
  curl http://localhost:$PORT &>/dev/null \
    && echo "HAPI IS UP" && break \
    || echo "  ... still starting"
  sleep 1
done

echo "Loading example data..."
./bin/load.py -o "${DATA}"
echo "DONE!"

echo "Press Ctrl-C to close the server process..."
wait
