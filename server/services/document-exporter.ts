import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { marked } from "marked";
import fs from "fs/promises";
import path from "path";

export type ExportableDocument = {
  slug: string;
  title: string;
  body: string;
};

export class DocumentExporter {
  private buildWordDocParagraphs(title: string, body: string): Paragraph[] {
    const sections: Paragraph[] = [];

    sections.push(
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      })
    );

    const lines = body.split("\n");
    for (const line of lines) {
      if (line.startsWith("**") && line.endsWith("**")) {
        sections.push(
          new Paragraph({
            text: line.replace(/\*\*/g, ""),
            heading: HeadingLevel.HEADING_2,
          })
        );
      } else if (line.startsWith("*") && line.endsWith("*")) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.replace(/\*/g, ""),
                italics: true,
              }),
            ],
          })
        );
      } else if (line.trim()) {
        sections.push(
          new Paragraph({
            text: line,
          })
        );
      }
    }

    return sections;
  }

  async exportMarkdownSet(
    docs: ExportableDocument[],
    baseFilename: string,
    outputDir: string
  ): Promise<Record<string, string>> {
    await fs.mkdir(outputDir, { recursive: true });

    const entries = await Promise.all(
      docs.map(async (doc) => {
        const safeSlug = doc.slug.replace(/[^a-zA-Z0-9\-_]/g, "");
        const outPath = path.join(outputDir, `${baseFilename}-${safeSlug}.md`);
        await fs.writeFile(outPath, doc.body, "utf-8");
        return [doc.slug, outPath] as const;
      })
    );

    return Object.fromEntries(entries);
  }

  async exportWordSet(
    docs: ExportableDocument[],
    baseFilename: string,
    outputDir: string
  ): Promise<Record<string, string>> {
    await fs.mkdir(outputDir, { recursive: true });

    const entries = await Promise.all(
      docs.map(async (doc) => {
        const safeSlug = doc.slug.replace(/[^a-zA-Z0-9\-_]/g, "");
        const outPath = path.join(outputDir, `${baseFilename}-${safeSlug}.docx`);
        const wordDoc = new Document({
          sections: [
            {
              properties: {},
              children: this.buildWordDocParagraphs(doc.title, doc.body),
            },
          ],
        });
        const buffer = await (wordDoc as any).toBuffer();
        await fs.writeFile(outPath, buffer);
        return [doc.slug, outPath] as const;
      })
    );

    return Object.fromEntries(entries);
  }

  async exportDocumentSet(
    docs: ExportableDocument[],
    baseFilename: string,
    outputDir: string,
    format: "docx" | "md"
  ): Promise<Record<string, string>> {
    if (format === "md") {
      return this.exportMarkdownSet(docs, baseFilename, outputDir);
    }
    return this.exportWordSet(docs, baseFilename, outputDir);
  }

  /**
   * Export PRD and SOW as Markdown file
   */
  async exportAsMarkdown(prd: string, sow: string, outputPath: string): Promise<string> {
    const content = `${prd}\n\n---\n\n${sow}`;
    await fs.writeFile(outputPath, content, "utf-8");
    return outputPath;
  }

  /**
   * Export PRD and SOW as Word document
   */
  async exportAsWord(prd: string, sow: string, outputPath: string): Promise<string> {
    const sections: Paragraph[] = [];

    // Parse PRD
    sections.push(
      new Paragraph({
        text: "PRODUCT REQUIREMENTS DOCUMENT (PRD)",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      })
    );

    const prdLines = prd.split("\n");
    for (const line of prdLines) {
      if (line.startsWith("**") && line.endsWith("**")) {
        // Heading
        sections.push(
          new Paragraph({
            text: line.replace(/\*\*/g, ""),
            heading: HeadingLevel.HEADING_2,
          })
        );
      } else if (line.startsWith("*") && line.endsWith("*")) {
        // Italic (explanation)
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.replace(/\*/g, ""),
                italics: true,
              }),
            ],
          })
        );
      } else if (line.trim()) {
        // Regular text
        sections.push(
          new Paragraph({
            text: line,
          })
        );
      }
    }

    // Add page break
    sections.push(
      new Paragraph({
        text: "",
        pageBreakBefore: true,
      })
    );

    // Parse SOW
    sections.push(
      new Paragraph({
        text: "STATEMENT OF WORK (SOW)",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      })
    );

    const sowLines = sow.split("\n");
    for (const line of sowLines) {
      if (line.startsWith("**") && line.endsWith("**")) {
        sections.push(
          new Paragraph({
            text: line.replace(/\*\*/g, ""),
            heading: HeadingLevel.HEADING_2,
          })
        );
      } else if (line.startsWith("*") && line.endsWith("*")) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.replace(/\*/g, ""),
                italics: true,
              }),
            ],
          })
        );
      } else if (line.trim()) {
        sections.push(
          new Paragraph({
            text: line,
          })
        );
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: sections,
        },
      ],
    });

    const buffer = await (doc as any).toBuffer();
    await fs.writeFile(outputPath, buffer);
    return outputPath;
  }

  async exportMarkdownPair(prd: string, sow: string, baseFilename: string, outputDir: string): Promise<{ prdPath: string; sowPath: string }> {
    await fs.mkdir(outputDir, { recursive: true });

    const prdPath = path.join(outputDir, `${baseFilename}-PRD.md`);
    const sowPath = path.join(outputDir, `${baseFilename}-SOW.md`);

    await Promise.all([
      fs.writeFile(prdPath, prd, "utf-8"),
      fs.writeFile(sowPath, sow, "utf-8"),
    ]);

    return { prdPath, sowPath };
  }

  async exportWordPair(prd: string, sow: string, baseFilename: string, outputDir: string): Promise<{ prdPath: string; sowPath: string }> {
    await fs.mkdir(outputDir, { recursive: true });

    const prdPath = path.join(outputDir, `${baseFilename}-PRD.docx`);
    const sowPath = path.join(outputDir, `${baseFilename}-SOW.docx`);

    const prdDoc = new Document({
      sections: [
        {
          properties: {},
          children: this.buildWordDocParagraphs("PRODUCT REQUIREMENTS DOCUMENT (PRD)", prd),
        },
      ],
    });

    const sowDoc = new Document({
      sections: [
        {
          properties: {},
          children: this.buildWordDocParagraphs("STATEMENT OF WORK (SOW)", sow),
        },
      ],
    });

    const [prdBuffer, sowBuffer] = await Promise.all([
      (prdDoc as any).toBuffer(),
      (sowDoc as any).toBuffer(),
    ]);

    await Promise.all([
      fs.writeFile(prdPath, prdBuffer),
      fs.writeFile(sowPath, sowBuffer),
    ]);

    return { prdPath, sowPath };
  }

  async exportBlueprint(
    prd: string,
    sow: string,
    baseFilename: string,
    outputDir: string,
    format: "docx" | "md"
  ): Promise<{ prdPath: string; sowPath: string }> {
    if (format === "md") {
      return this.exportMarkdownPair(prd, sow, baseFilename, outputDir);
    }

    return this.exportWordPair(prd, sow, baseFilename, outputDir);
  }

  /**
   * Export PRD and SOW as PDF (using markdown-pdf)
   * Note: For production, consider using puppeteer or a dedicated PDF library
   */
  async exportAsPDF(prd: string, sow: string, outputPath: string): Promise<string> {
    // For now, we'll export as Markdown and let the user convert
    // In production, you'd use puppeteer or similar to generate PDF
    const mdPath = outputPath.replace(".pdf", ".md");
    await this.exportAsMarkdown(prd, sow, mdPath);
    
    // TODO: Implement PDF generation with puppeteer or similar
    // For now, return the markdown path
    return mdPath;
  }

  /**
   * Generate all formats and return paths
   */
  async exportAll(
    prd: string,
    sow: string,
    baseFilename: string,
    outputDir: string
  ): Promise<{
    markdown: string;
    word: string;
    pdf: string;
  }> {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    const mdPath = path.join(outputDir, `${baseFilename}.md`);
    const wordPath = path.join(outputDir, `${baseFilename}.docx`);
    const pdfPath = path.join(outputDir, `${baseFilename}.pdf`);

    await Promise.all([
      this.exportAsMarkdown(prd, sow, mdPath),
      this.exportAsWord(prd, sow, wordPath),
      this.exportAsPDF(prd, sow, pdfPath),
    ]);

    return {
      markdown: mdPath,
      word: wordPath,
      pdf: pdfPath,
    };
  }
}
