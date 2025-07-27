// Simple Express server exposing a few banking API endpoints.
//
// This server stores all data in memory.  A real production system
// would persist data in a database and implement proper
// authentication/authorization.  Here we keep things simple so the
// frontend can interact with a working API without any build tools.

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow cross‑origin requests from any origin so the React frontend
// running on a different port can talk to this API.  In production
// you would restrict this to trusted domains.
app.use(cors());
app.use(bodyParser.json());

// In‑memory data store.  Each account has an id, name and balance.
// The seed data below gives the frontend something to render.
let accounts = [
  { id: 1, name: 'Checking', balance: 1500.0 },
  { id: 2, name: 'Savings', balance: 4200.0 },
  { id: 3, name: 'Investment', balance: 12000.0 }
];

// Helper to find account by id.
function findAccount(id) {
  return accounts.find(acc => acc.id === id);
}

// GET /api/accounts
// Returns a list of all accounts.
app.get('/api/accounts', (req, res) => {
  res.json(accounts);
});

// GET /api/accounts/:id
// Returns details for a single account by id.
app.get('/api/accounts/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const acc = findAccount(id);
  if (!acc) {
    return res.status(404).json({ error: 'Account not found' });
  }
  res.json(acc);
});

// POST /api/accounts
// Creates a new account.  Expects a JSON body with a name and
// optional initial balance.  Returns the newly created account.
app.post('/api/accounts', (req, res) => {
  const { name, balance } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' });
  }
  const newId = accounts.length ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
  const acc = {
    id: newId,
    name,
    balance: typeof balance === 'number' ? balance : 0
  };
  accounts.push(acc);
  res.status(201).json(acc);
});

// POST /api/accounts/:id/deposit
// Deposits an amount into an account.  Expects a JSON body with
// { amount: number }.  Returns the updated account.
app.post('/api/accounts/:id/deposit', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const acc = findAccount(id);
  if (!acc) {
    return res.status(404).json({ error: 'Account not found' });
  }
  const amount = parseFloat(req.body.amount);
  if (Number.isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid deposit amount' });
  }
  acc.balance += amount;
  res.json(acc);
});

// POST /api/accounts/:id/withdraw
// Withdraws an amount from an account.  Expects a JSON body with
// { amount: number }.  Returns the updated account.
app.post('/api/accounts/:id/withdraw', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const acc = findAccount(id);
  if (!acc) {
    return res.status(404).json({ error: 'Account not found' });
  }
  const amount = parseFloat(req.body.amount);
  if (Number.isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid withdrawal amount' });
  }
  if (acc.balance < amount) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }
  acc.balance -= amount;
  res.json(acc);
});

// Serve the frontend static files if they exist.  By default Express
// will look for files inside the directory passed to express.static().
const path = require('path');
const publicDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(publicDir));

// Catch‑all handler to serve index.html for any unknown routes.  This
// allows client‑side routing to work in the React frontend.
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Bank API server running on http://localhost:${PORT}`);
});
