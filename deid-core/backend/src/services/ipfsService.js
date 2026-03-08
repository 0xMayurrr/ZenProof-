const axios = require('axios');
const FormData = require('form-data');

exports.uploadToIPFS = async (fileBuffer, fileName, fileMimeType) => {
    try {
        const formData = new FormData();
        formData.append('file', fileBuffer, {
            filename: fileName,
            contentType: fileMimeType
        });

        // Add metadata
        const metadata = JSON.stringify({
            name: `DeID Credential: ${fileName}`
        });
        formData.append('pinataMetadata', metadata);

        // Add options
        const options = JSON.stringify({
            cidVersion: 1
        });
        formData.append('pinataOptions', options);

        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer ${process.env.PINATA_JWT}`
            }
        });

        return res.data.IpfsHash;
    } catch (error) {
        console.error('Error uploading file to IPFS:', error);
        throw new Error('Failed to upload file to IPFS');
    }
};
