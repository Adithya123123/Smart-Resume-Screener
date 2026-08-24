package com.resumescreener.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

class PdfServiceTest {

    private final PdfService pdfService = new PdfService();

    @Test
    void testExtractTextFromValidPdf() throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                contentStream.newLineAtOffset(100, 700);
                contentStream.showText("John Doe - Senior Java Developer");
                contentStream.endText();
            }
            document.save(out);
        }

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "resume.pdf",
                "application/pdf",
                out.toByteArray()
        );

        String extractedText = pdfService.extractText(file);
        assertNotNull(extractedText);
        assertTrue(extractedText.contains("John Doe"));
        assertTrue(extractedText.contains("Senior Java Developer"));
    }

    @Test
    void testInvalidFileExtensionThrowsException() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "resume.txt",
                "text/plain",
                "Hello World".getBytes()
        );

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            pdfService.extractText(file);
        });

        assertTrue(exception.getMessage().contains("Only PDF files are supported"));
    }
}
