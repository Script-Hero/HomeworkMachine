#!/bin/sh

parallel -u ::: 'cd frontend && npm start' 'cd backend && python3 server.py'
