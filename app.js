require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const decodeQR = require('./services/qrDecode');
const checkURLWithGoogle = require('./services/safeBrowsing');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

// Configuración de multer para recibir archivos
const upload = multer({ dest: 'uploads/' });

// Ruta para analizar QR
app.post('/api/check-qr', upload.single('qr'), async (req, res) => {
  try {
    const qrPath = req.file.path;

    // Leer y decodificar QR
    const decodedURL = await decodeQR(qrPath);

    if (!decodedURL || !decodedURL.startsWith('http')) {
      return res.status(400).json({ error: 'El QR no contiene una URL válida.' });
    }

    // Verificar si es malicioso
    const isMalicious = await checkURLWithGoogle(decodedURL);

    res.json({
      url: decodedURL,
      isMalicious: isMalicious
    });
  } catch (err) {
    console.error('Error procesando el QR:', err.message);
    res.status(500).json({ error: 'Error al analizar el código QR.' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
