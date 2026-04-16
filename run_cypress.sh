#!/bin/bash
echo "Iniciando Backend..."
cd ecommerce-api
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!

echo "Iniciando Frontend..."
cd ../ecommerce-app
CI=true BROWSER=none PORT=3000 npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!

echo "Esperando a que los servidores estén listos (45s)..."
sleep 45

echo "Ejecutando Cypress con Chrome desde ecommerce-app..."
./node_modules/.bin/cypress run --browser chrome --headless --spec cypress/e2e/flow.cy.js

EXIT_CODE=$?

echo "Limpiando procesos (PIDs: $BACKEND_PID, $FRONTEND_PID)..."
kill -9 $BACKEND_PID $FRONTEND_PID 2>/dev/null

exit $EXIT_CODE
