
# PDF Crawler and Downloader

This Node.js project is a web crawler that searches Google for PDF files based on a query string, then downloads the PDF files to your local machine. The app allows you to specify the number of PDFs you want to download (up to 1000).

## Features

- Searches Google for PDFs related to a specified search query.
- Paginates through Google results to collect up to 1000 PDF files.
- Downloads PDF files and stores them in the local filesystem.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [npm](https://www.npmjs.com/) (usually installed with Node.js)

## Installation

1. **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Create a `downloads` folder for the PDF files** (optional, the script will create it automatically if it doesn't exist):

    ```bash
    mkdir PDF\ downloads
    ```

## Usage

1. **Run the server**:

    ```bash
    node app.js
    ```

2. **Access the crawler endpoint**:

    The crawler is available at the following endpoint:

    ```
    GET /get_documents?fileAmount=<number-of-files>
    ```

    For example:

    ```
    http://localhost:3000/get_documents?fileAmount=50
    ```

    This will search for up to 50 PDF files based on the predefined search query in the code and download them.

## Configuration

- The search query is set to `'how to build an app'` in the code. You can modify the variable `queryToSearch` in `app.js` to customize the search query.
  
- By default, the app downloads up to 1000 PDF files. You can pass a custom `fileAmount` query parameter to limit the number of files to download.

## Code Overview

### Key Files

- **app.js**: Main application file that runs the Express server and handles the crawling and downloading logic.
  
- **Dependencies**:
  - `express`: Handles the web server.
  - `axios`: Used to download PDF files.
  - `puppeteer`: Used for web scraping (navigating Google search and extracting PDF links).
  - `fs`: Node.js filesystem module for file operations.
  - `path`: Used for resolving file paths.

### Core Functions

- `returnQueryAsIntOrDefault`: Validates and returns the `fileAmount` from the query string.
  
- `searchAndDownloadPDFs`: Main function to perform Google search, extract PDF links, and download them.
  
- `downloadPDF`: Downloads a PDF from a given URL.
  
- `createDownloadFolder`: Creates the `PDF downloads` directory if it doesn’t exist.

### Error Handling

- If no PDF files are found, the server will respond with a 404 status code and the message `No PDF files found`.
  
- If some downloads fail, the response will contain the number of successful and failed downloads.

## Example

To download 100 PDF files related to building an app, you can run:

```
http://localhost:3000/get_documents?fileAmount=100
```

The downloaded PDFs will be saved in the `PDF downloads` folder.

## Notes

- The project uses Puppeteer to navigate Google search. Be mindful of Google's rate limits and CAPTCHA challenges.
- Google search results are capped at around 1000 results. You cannot scrape beyond this limit using standard search queries.

## License

This project is licensed under the MIT License.
