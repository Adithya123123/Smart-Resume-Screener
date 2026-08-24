package com.resumescreener.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PdfService {

    /**
     * Extracts plain text content from an uploaded PDF file using Apache PDFBox.
     * 
     * @param file Uploaded PDF file
     * @return Extracted text string
     */
    public String extractText(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }

        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are supported");
        }

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String extractedText = stripper.getText(document);

            if (extractedText == null || extractedText.trim().isEmpty()) {
                throw new IllegalArgumentException("The uploaded PDF contains no readable text");
            }

            return extractedText.trim();
        } catch (IOException e) {
            throw new IllegalArgumentException("Failed to process or parse the PDF file: " + e.getMessage(), e);
        }
    }
}
