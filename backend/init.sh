#!/usr/bin/env sh

# Run the migrations first
/pb/surmai-backend migrate up

# Start the server with automigrate off
/pb/surmai-backend serve --http=0.0.0.0:8080
