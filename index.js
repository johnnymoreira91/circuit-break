const delayedFunction = require("./delayedFunction");
const circuitBreaker = require('opossum');
const express = require('express')

const app = express()
app.use(express.json())

const circuitBreakerOptions = {
  errorThresholdPercentage: 50,
  timeout: 1000,
  resetTimeout: 5000
};
const circuit = new circuitBreaker(delayedFunction, circuitBreakerOptions);
circuit.fallback((error) => {
  if (error) {
    console.log(error.message)
    return error.message;
  }
  console.log("Fallback")
  return "Fallback";
});
circuit.on('halfOpen', () => {
  console.log('Circuit breaker is halfOpen');
});
circuit.on('open', () => {
  console.log('Circuit breaker is open');
});
circuit.on('close', () => {
  console.log('Circuit breaker is closed');
});

let counter = 0

app.get('/', async (req, res) => {
  try {
    // let resp = await circuit.fire()
    // if (resp === 'Service failing' || resp === 'Breaker is open' || resp === 'Circuit breaker is halfOpen' || resp === 'Breaker is open') {
    //   console.log('estaaa entrando aqui')
    //   return res.redirect('/backup')
    // }
    await circuit.fire()
    counter ++
    process.stdout.write(counter + '\r')
    return res.status(200).json(req.body)
  } catch (error) {
    return res.status(400).json('error')
  }
});

app.get('/backup', async (req, res) => {
  try {
    counter ++
    process.stdout.write(counter + '\r')
    return res.status(200).json('backup')
  } catch (error) {
    return res.status(400).json('error')
  }
});

app.listen(3000, () => {
  console.log('server on')
})