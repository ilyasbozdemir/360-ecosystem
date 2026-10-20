import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  EditableField,
  extractCleanText,
  setElementText,
} from "../document/EditableField";
import { TemplateEditProvider } from "../document/TemplateEditContext";

describe("Word Benzeri Doğrudan Belge Düzenleme (EditableField) Testleri", () => {
  describe("1. extractCleanText ve setElementText Düz Metin / Paragraf Doğrulaması", () => {
    it("Çok satırlı paragrafları, satır sonlarını (\\n) ve boşlukları temizce korur", () => {
      const mockElement = {
        innerText: "Paragraf 1: İhtiyaç özeti.\n\nParagraf 2: Şartname ve usul gerekçesi.",
      } as HTMLElement;

      const clean = extractCleanText(mockElement);
      expect(clean).toBe(
        "Paragraf 1: İhtiyaç özeti.\n\nParagraf 2: Şartname ve usul gerekçesi."
      );
    });

    it("Windows CRLF (\\r\\n) satır sonlarını standart LF (\\n) formatına normalize eder", () => {
      const mockElement = {
        innerText: "Satır 1\r\nSatır 2\r\n\r\nSatır 3",
      } as HTMLElement;

      const clean = extractCleanText(mockElement);
      expect(clean).toBe("Satır 1\nSatır 2\n\nSatır 3");
    });

    it("Bölünemez boşlukları (\\u00a0) standart boşluğa dönüştürür", () => {
      const mockElement = {
        innerText: "4734\u00a0sayılı\u00a0Kamu\u00a0İhale\u00a0Kanunu",
      } as HTMLElement;

      const clean = extractCleanText(mockElement);
      expect(clean).toBe("4734 sayılı Kamu İhale Kanunu");
    });

    it("Chromium contentEditable boşaldığında kalan fantom '\\n' karakterini boş metne çevirir", () => {
      const mockElement = {
        innerText: "\n",
      } as HTMLElement;

      const clean = extractCleanText(mockElement);
      expect(clean).toBe("");
    });

    it("Türkçe karakterleri (ç, ğ, ı, ö, ş, ü, İ) ve noktalama işaretlerini eksiksiz korur", () => {
      const turkishText =
        "İşbu doğrudan temin evrakı; sağlık ocağı, poliklinik ve acil servis ihtiyaçları için düzenlenmiştir.";
      const mockElement = {
        innerText: turkishText,
      } as HTMLElement;

      expect(extractCleanText(mockElement)).toBe(turkishText);
    });

    it("setElementText HTML özel karakterlerini (<, >, &) kod olarak değil saf metin olarak atar", () => {
      const mockElement = {
        innerText: "",
      } as HTMLElement;

      setElementText(mockElement, "<script>alert('xss')</script> & Şartname");
      expect(mockElement.innerText).toBe(
        "<script>alert('xss')</script> & Şartname"
      );
    });
  });

  describe("2. Önizleme / PDF Derleme Modu (isEditing = false) Davranışı", () => {
    it("Düzenleme kapalıyken input/textarea yerine saf span ve pre-wrap stili üretir", () => {
      const multiParagraph = "Madde 1: Alım konusu.\n\nMadde 2: Teslim şartları.";
      const html = renderToString(
        <EditableField
          name="isinAciklamasi"
          value={multiParagraph}
          isEditing={false}
        />
      );

      // input veya textarea etiketi olmamalı
      expect(html).not.toContain("<input");
      expect(html).not.toContain("<textarea");
      // Saf span ve satır sonu koruyucu white-space: pre-wrap stili olmalı
      expect(html).toContain("white-space:pre-wrap");
      expect(html).toContain("data-field-name=\"isinAciklamasi\"");
      expect(html).toContain("Madde 1: Alım konusu.\n\nMadde 2: Teslim şartları.");
    });

    it("HTML karakterlerini güvenli biçimde escape eder ve XSS açığı oluşturmaz", () => {
      const malicious = "İş Tanımı <img src=x onerror=alert(1)> & Özel Şartlar";
      const html = renderToString(
        <EditableField name="isAdi" value={malicious} isEditing={false} />
      );

      expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
      expect(html).toContain("&amp; Özel Şartlar");
      expect(html).not.toContain("<img src=x");
    });
  });

  describe("3. Canlı Word-like Düzenleme Modu (isEditing = true) Davranışı", () => {
    it("contentEditable='true' özniteliği, data-editable-field ve alan adını taşır", () => {
      const onFieldChange = vi.fn();
      const html = renderToString(
        <TemplateEditProvider isEditing={true} onFieldChange={onFieldChange}>
          <EditableField
            name="gerekce"
            value="Acil servis yedek parça ihtiyacı"
            placeholder="Gerekçe giriniz..."
          />
        </TemplateEditProvider>
      );

      expect(html).toContain('contentEditable="true"');
      expect(html).toContain('data-editable-field="true"');
      expect(html).toContain('data-field-name="gerekce"');
      expect(html).toContain('data-placeholder="Gerekçe giriniz..."');
      expect(html).toContain("temin-word-field");
    });

    it("Dropdown seçenekli alanlarda select menüsü render eder", () => {
      const onFieldChange = vi.fn();
      const html = renderToString(
        <TemplateEditProvider isEditing={true} onFieldChange={onFieldChange}>
          <EditableField
            name="hazirlayanPersonelAdi"
            value="Ahmet Yılmaz"
            options={["Ahmet Yılmaz", "Mehmet Kaya", "Ayşe Demir"]}
          />
        </TemplateEditProvider>
      );

      expect(html).toContain("<select");
      expect(html).toContain("<option");
      expect(html).toContain("Ahmet Yılmaz");
      expect(html).toContain("Mehmet Kaya");
    });

    it("Boş alanlarda data-empty='true' özniteliği ile CSS placeholder'ı destekler", () => {
      const html = renderToString(
        <TemplateEditProvider isEditing={true} onFieldChange={vi.fn()}>
          <EditableField
            name="isinAciklamasi"
            value=""
            placeholder="Açıklama giriniz..."
            multiline
          />
        </TemplateEditProvider>
      );

      expect(html).toContain('data-empty="true"');
      expect(html).toContain('data-placeholder="Açıklama giriniz..."');
      expect(html).toContain("width:100%");
    });
  });
});
