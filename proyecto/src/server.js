import http from 'http';
import { Server as IOServer } from 'socket.io';
import { ProductManager } from './managers/productManager.js';
import app from './app.js';

const server = http.createServer(app);
const io = new IOServer(server);

const pm = new ProductManager();

app.set('io', io);

io.on('connection', async (socket) => {
  console.log('Cliente conectado');

  const list = await pm.getAll();
  socket.emit('products:init', list);

  socket.on('products:create', async (payload, ack) => {
    try {
      const created = await pm.add(payload);
      io.emit('products:update', { type: 'created', product: created });
      ack?.({ ok: true });
    } catch (err) {
      ack?.({ error: err.message });
    }
  });

  socket.on('products:delete', async ({ id }, ack) => {
    try {
      const ok = await pm.deleteById(id);
      if (!ok) return ack?.({ error: 'Not found' });
      io.emit('products:update', { type: 'deleted', productId: Number(id) });
      ack?.({ ok: true });
    } catch (err) {
      ack?.({ error: err.message });
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Servidor con Socket.IO en http://localhost:${PORT}`);
});