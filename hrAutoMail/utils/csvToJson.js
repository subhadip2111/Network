
const csv = require('csvtojson');
const fs = require('fs');

const csvToJson = async (filePath) => {
    try {
        // Create a readable stream from the uploaded file
        const fileStream = fs.createReadStream(filePath);
    
        // Use csvtojson to convert the stream to JSON
        const jsonArray = await csv().fromStream(fileStream);
    
        // Close the stream after processing
        fileStream.close();
    
        return jsonArray;
      } catch (error) {
        console.error('Error converting CSV to JSON:', error);
        throw error;
      }
};

module.exports = csvToJson



