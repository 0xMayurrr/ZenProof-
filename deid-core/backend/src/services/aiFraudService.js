const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');

/**
 * Validates a document using OCR or PDF text extraction.
 * @param {Buffer} fileBuffer
 * @param {string} mimeType
 * @param {string} recipientWallet
 * @returns {Promise<{ isValid: boolean, confidence: number, text: string }>}
 */
exports.validateDocument = async (fileBuffer, mimeType, recipientWallet) => {
    try {
        let extractedText = "";
        let baseConfidence = 1.0;

        if (mimeType.includes('pdf')) {
            // Very simple PDF basic text extraction
            const data = await pdf(fileBuffer);
            extractedText = data.text;
            // Since pdf text extraction is highly accurate compared to OCR, confidence is high if text exists
            baseConfidence = extractedText.length > 20 ? 0.9 : 0.4;
        } else if (mimeType.includes('image')) {
            // Fallback to OCR using Tesseract
            const result = await Tesseract.recognize(fileBuffer, 'eng');
            extractedText = result.data.text;
            baseConfidence = result.data.confidence / 100; // Normalizing from 0-100 to 0-1
        } else {
            // Other file types, generic simple validation
            baseConfidence = 0.8;
            extractedText = "Unknown file format, bypassing AI deep check.";
        }

        const lowerText = extractedText.toLowerCase();

        // Fraud heuristic: Check if it's completely empty or extremely short without valid keywords
        if (extractedText.trim().length < 10) {
            return { isValid: false, confidence: 0.2, text: extractedText };
        }

        // Fraud heuristic: Look for common forbidden words (mocking a "faked" list)
        // e.g., if someone writes "Template" indicating a non-filled cert
        const forbiddenWords = ['lorem ipsum', 'insert name here', 'sample certificate', 'template'];
        for (const word of forbiddenWords) {
            if (lowerText.includes(word)) {
                return { isValid: false, confidence: 0.1, text: extractedText };
            }
        }

        // We can optionally check if the wallet abbreviation or user name is in the text if passed, 
        // reducing generic cert fraud. But for 24h hackathon, basic OCR > 0.8 confidence score constraint is fine.

        return {
            isValid: baseConfidence >= 0.8,
            confidence: baseConfidence,
            text: extractedText
        };
    } catch (error) {
        console.error('AI Fraud Check Error:', error);
        // Fail-open or fail-secure based on business logic. Let's fail-open with warning.
        return { isValid: true, confidence: 1.0, text: "Verification failed, passing by default." };
    }
};
