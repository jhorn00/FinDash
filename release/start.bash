#!/bin/bash

# Start the containers (Must press Ctrl+C to stop)
docker-compose up --build
# Remove the volume so it doesn't persist
# docker-compose down -v
