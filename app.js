const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { decodeQR } = require('./services/qrDecode');
const { checkUrlSafety } = require('./services/safeBrowsing');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

const upload = multer({ dest: 'uploads/' });

app.post('/scan', upload.single('qr'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const result = await decodeQR(filePath);
    fs.unlinkSync(filePath);

    if (!result) return res.json({ success: false, message: 'No se pudo leer el código QR.' });

    let analysis = { type: 'text', value: result, safety: 'safe' };
    if (result.startsWith('http')) {
      analysis.type = 'url';
      const isSafe = await checkUrlSafety(result);
      analysis.safety = isSafe ? 'safe' : 'malicious';
    } else if (/(javascript:|data:|<script>)/i.test(result)) {
      analysis.safety = 'suspicious';
    }

    res.json({ success: true, data: analysis });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error procesando el código QR.' });
  }
});

app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
