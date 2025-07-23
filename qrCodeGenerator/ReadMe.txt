# QR Code Generator API (Node.js & Express)

## Backend Features
- REST API endpoint to generate QR codes based on ID and Price inputs
- Input validation and error handling for required fields
- Generates QR code as PNG file saved to `data/` directory
- Generates QR code as Base64 Data URL for frontend display
- Asynchronous logging middleware for request tracking
- Uses `multer` for handling form data
- Directory creation handled at startup
- CORS enabled for cross-origin requests
-server.js is a normal Code without Folder Structure
-servermain.js is up to professional standards

## Tech Stack
- Node.js
- Express.js
- Multer (multipart/form-data handling)
- QRCode npm package
- File system operations
- Custom logging middleware
- CORS middleware
