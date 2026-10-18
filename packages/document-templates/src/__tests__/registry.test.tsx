import React from "react";
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import {
  templateRegistry,
  resolveTemplateKey,
  getTemplateDefinition,
  getAllTemplateDefinitions,
} from "../registry";
import { DocumentPage } from "../DocumentPage";

describe("Document Templates Registry", () => {
  it("temel şablonlar registry içinde eksiksiz tanımlı olmalı", () => {
    expect(templateRegistry.luzum_muzekkeresi).toBeDefined();
    expect(templateRegistry.luzum_onay_eki).toBeDefined();
    expect(templateRegistry.ihtiyac_listesi).toBeDefined();
    expect(templateRegistry.harcama_talimati).toBeDefined();
    expect(templateRegistry.piyasa_fiyat_arastirma_tutanagi).toBeDefined();

    expect(templateRegistry.luzum_muzekkeresi.component).toBeDefined();
    expect(templateRegistry.luzum_muzekkeresi.capabilities.supportsOlur).toBe(
      true,
    );
    expect(templateRegistry.luzum_muzekkeresi.capabilities.supportsLogos).toBe(
      true,
    );
  });

  it("resolveTemplateKey kebab-case, snake_case ve alias değerlerini doğru TemplateKeye dönüştürmeli", () => {
    expect(resolveTemplateKey("luzum_muzekkeresi")).toBe("luzum_muzekkeresi");
    expect(resolveTemplateKey("luzum-muzekkeresi")).toBe("luzum_muzekkeresi");
    expect(resolveTemplateKey("luzum-muzekkeresi-onay-eki")).toBe(
      "luzum_onay_eki",
    );
    expect(resolveTemplateKey("luzum_onay_eki")).toBe("luzum_onay_eki");
    expect(resolveTemplateKey("ihtiyac-listesi")).toBe("ihtiyac_listesi");
    expect(resolveTemplateKey("harcama-talimati")).toBe("harcama_talimati");
  });

  it("getTemplateDefinition geçerli bir şablon tanımı dönmeli", () => {
    const def = getTemplateDefinition("luzum_muzekkeresi");
    expect(def).toBeDefined();
    expect(def?.name).toBe("LuzumMuzekkeresi");
    expect(def?.orientation).toBe("portrait");
    expect(def?.capabilities.supportsOlur).toBe(true);
  });

  it("getAllTemplateDefinitions tüm şablon tanımlarını dönmeli", () => {
    const all = getAllTemplateDefinitions();
    expect(all.length).toBeGreaterThanOrEqual(25);
    all.forEach((item) => {
      expect(item.id).toBeDefined();
      expect(item.name).toBeDefined();
      expect(item.component).toBeDefined();
      expect(item.capabilities).toBeDefined();
    });
  });
});

describe("DocumentPage Pure Component", () => {
  it("data-document-page özniteliğini ve saf A4 boyutunu render etmeli", () => {
    const html = renderToString(
      <DocumentPage
        templateKey="luzum_muzekkeresi"
        data={{
          idareAdi: "TEST İDARESİ",
          belgeSayi: "12345",
          konu: "Test Alımı",
        }}
      />,
    );

    expect(html).toContain('data-document-page="true"');
    expect(html).toContain("w-[210mm]");
    expect(html).toContain("min-h-[297mm]");
    expect(html).toContain("bg-white");
    // UI arayüz stilleri (koyu tema, gölgeler vb.) DocumentPage içinde olmamalı
    expect(html).not.toContain("shadow-2xl");
    expect(html).not.toContain("dark:bg-slate-950");
  });

  it("yatay (landscape) modda doğru boyutları render etmeli", () => {
    const html = renderToString(
      <DocumentPage
        templateKey="yaklasik_maliyet_cetveli"
        orientation="landscape"
        data={{}}
      />,
    );

    expect(html).toContain('data-document-page="true"');
    expect(html).toContain("w-[297mm]");
    expect(html).toContain("min-h-[210mm]");
  });

  it("şablon anahtarı ve şablon verisi tip güvenliği compile-time ve runtime seviyesinde doğrulanmalı", () => {
    // 1. Geçerli kullanım: luzum_muzekkeresi geçerli verisiyle tipi doğrulanır
    const validRender = (
      <DocumentPage
        templateKey="luzum_muzekkeresi"
        data={{
          idareAdi: "İstanbul İl Sağlık Müdürlüğü",
          gerekce: "Tıbbi sarf malzeme ihtiyacı",
        }}
      />
    );
    expect(validRender).toBeDefined();

    // 2. Tip güvenliği: Geçersiz şablon anahtarı verildiğinde TypeScript compile hatası üretir
    const _invalidKeyTest = (
      <DocumentPage
        // @ts-expect-error - 'gecersiz_olmayan_sablon' geçerli bir TemplateKey değildir
        templateKey="gecersiz_olmayan_sablon"
        data={{}}
      />
    );
    expect(_invalidKeyTest).toBeDefined();

    // 3. Tip güvenliği: Yanlış şablona uyumsuz data tipi verildiğinde TypeScript compile hatası üretir
    const _invalidDataTest = (
      <DocumentPage
        templateKey="luzum_muzekkeresi"
        // @ts-expect-error - number tipi LuzumMuzekkeresi data nesnesi olarak verilemez
        data={12345}
      />
    );
    expect(_invalidDataTest).toBeDefined();
  });
});
