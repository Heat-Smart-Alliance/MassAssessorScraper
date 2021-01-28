#!/bin/bash

npm install --loglevel=error && docker-compose build && docker-compose up -d
