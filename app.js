const express = require('express');
const { returnQueryAsIntOrDefault, searchAndDownloadPDFs } = require('./handler.js');

const app = express();
const PORT = 3000;
const queryToSearch = 'how to build an app';

app.get('/get_documents', async (req, res) => {
    let fileAmount = returnQueryAsIntOrDefault(req.query.fileAmount);
    const result = await searchAndDownloadPDFs(queryToSearch, fileAmount);
    if (result.pdfFilesFound === 0) {
        res.status(404).send({ message: "No PDF files found" });
    } else {
        res.status(200).send({ message: "ok", ...result });
    }
});

app.listen(PORT, () => {
    console.log(`Crawler server running on http://localhost:${PORT}`);
});
