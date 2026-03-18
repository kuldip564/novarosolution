export function getHealth(req, res) {
  res.status(200).json({ ok: true, message: 'Server is running' });
}

