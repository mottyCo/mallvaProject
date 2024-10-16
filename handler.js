const axios = require('axios');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const fileAmountDefault = 1000
const resultPerPage = 100

/* 
    test for returnQueryAsIntOrDefault
    returnQueryAsIntOrDefault('string') should return 1000 (default)
    returnQueryAsIntOrDefault(-5) should return 1000 (default)
    returnQueryAsIntOrDefault(10.5) should return 1000 (default)
    returnQueryAsIntOrDefault('3') should return 3 
*/

const returnQueryAsIntOrDefault = (queryString) => {
    let fileAmount = queryString ? queryString.toString() : fileAmountDefault;
    if (isNaN(fileAmount) || !Number.isInteger(parseFloat(fileAmount)) || (parseFloat(fileAmount)) < 1) {
        return fileAmountDefault;
    } else {
        return parseFloat(fileAmount);
    }
}

const searchAndDownloadPDFs = async (searchQuery, fileAmount) => {
    const maxFileAmount = fileAmount;
    const maxPages = Math.ceil(maxFileAmount / resultPerPage);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let pdfLinks = [];

    for (let i = 0; i < maxPages; i++) {
        const startSearchFrom = i * resultPerPage;
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}+filetype:pdf&num=${resultPerPage}&start=${startSearchFrom}`;
        await page.goto(googleSearchUrl);
        const pdfLinksThisPage = await page.evaluate(() => {
            const links = [];
            const results = document.querySelectorAll('a');
            results.forEach((result) => {
                const href = result.href;
                if (href && href.endsWith('.pdf')) {
                    links.push(href);
                }
            });
            return links;
        });
        pdfLinks = pdfLinks.concat(pdfLinksThisPage);
        if (pdfLinks.length >= maxFileAmount) break;
    }
    if (pdfLinks.length === 0)
        return { pdfFilesFound: 0 };
    createDownloadFolder();
    const downloadsResult = await downloadFiles(pdfLinks, maxFileAmount);
    await browser.close();
    return downloadsResult;
};

const downloadPDF = async (url, filename) => {
    try {
        const response = await axios({
            method: 'GET',
            url,
            responseType: 'stream'
        });
        const filePath = path.resolve(__dirname, 'PDF downloads', filename);
        response.data.pipe(fs.createWriteStream(filePath));
        return true;
    } catch (error) {
        console.log('canot download file', error);
        return false;
    }
};

const createDownloadFolder = () => {
    if (!fs.existsSync(path.resolve(__dirname, 'PDF downloads'))) {
        fs.mkdirSync(path.resolve(__dirname, 'PDF downloads'));
    }
};

const downloadFiles = async (pdfLinks, maxFileAmount) => {
    let successToDownload = 0;
    let failedToDownload = 0;
    for (let i = 0; i < pdfLinks.length && i < maxFileAmount; i++) {
        const pdfUrl = pdfLinks[i];
        const filename = `file_${i + 1}.pdf`;
        console.log(`Downloading ${pdfUrl}`);
        await downloadPDF(pdfUrl, filename) ? successToDownload++ : failedToDownload++;
    }
    return { pdfFilesFound: pdfLinks.length > maxFileAmount ? maxFileAmount : pdfLinks.length, successToDownload, failedToDownload };
};


module.exports = {
    returnQueryAsIntOrDefault,
    searchAndDownloadPDFs,
    downloadPDF,
    createDownloadFolder,
    downloadFiles
};
