import React from "react";
import { DocumentLayout } from "../../document/DocumentLayout";
import { EditableField } from "../../document/EditableField";
import { DateEditableField } from "../../document/ApprovalSignature";
import { Kik048YapimGeciciKabulTeklifData } from "./Kik048YapimGeciciKabulTeklif.schema";

interface Props {
  data?: Partial<Kik048YapimGeciciKabulTeklifData> & Record<string, any>;
  pageSize?: "A4" | "A3";
  orientation?: "portrait" | "landscape";
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export const Kik048YapimGeciciKabulTeklif: React.FC<Props> = ({
  data = {},
  pageSize = "A4",
  orientation = "portrait",
  hideHeader = true,
  hideFooter = true,
}) => {
  const isinAdi = data.isinAdi || data.dosyaKonusu || (data as any).konu || "............................................................................";
  const yuklenici = data.yukleniciFirma || (data as any).kazananFirmaUnvan || "..................................................";
  const sozlesmeTarihi = data.sozlesmeTarihi || (data as any).sozlesme_tarihi || "";
  const sozlesmeBedeli = data.sozlesmeBedeli || (data as any).genelToplam || (data as any).tutar || "";
  const isinSuresiGun = data.isinSuresiGun || (data as any).teslimGun || "....";
  const sozlesmeyeGoreBitisTarihi = data.sozlesmeyeGoreBitisTarihi || (data as any).teslimTarihi || "";
  const varsaSureUzatimlari = data.varsaSureUzatimlari || "Yoktur";
  const sureUzatimiDahilBitisTarihi = data.sureUzatimiDahilBitisTarihi || sozlesmeyeGoreBitisTarihi || "";
  const isinBitirildigiTarih = data.isinBitirildigiTarih || (data as any).kabulTarihi || (data as any).tutanakTarihi || "";

  const dilekceTarihi = data.yukleniciDilekceTarihi || isinBitirildigiTarih || "";
  const talimatMakam = data.talimatVerenMakam || (data as any).harcamaYetkilisiUnvan || (data as any).harcamaBirimi || "Harcama Yetkilisi";
  const onIncelemeTarihi = data.onIncelemeTarihi || (data as any).kabulTarihi || (data as any).tarih || "";
  const tarih = data.tarih || (data as any).kabulTarihi || (data as any).tutanakTarihi || "";

  // Görevli listesi (Teklif eden heyet / kontrol teşkilatı / görevli personel)
  const gorevliler: Array<{ adSoyad: string; unvan: string; gorevi?: string }> = (() => {
    if (data.gorevliler && Array.isArray(data.gorevliler) && data.gorevliler.length > 0) {
      return data.gorevliler.map((g: any) => ({
        adSoyad: g.adSoyad || g.ad_soyad || "",
        unvan: g.unvan || g.gorev || "Kontrol Görevlisi",
        gorevi: g.gorevi || "Görevli",
      }));
    }
    if (data.komisyon && Array.isArray(data.komisyon) && data.komisyon.length > 0) {
      return data.komisyon.map((k: any) => ({
        adSoyad: k.adSoyad || k.ad_soyad || "",
        unvan: k.unvan || "Kontrol Görevlisi",
        gorevi: k.gorevi || "Görevli",
      }));
    }
    if ((data as any).muayeneKomisyonu && Array.isArray((data as any).muayeneKomisyonu) && (data as any).muayeneKomisyonu.length > 0) {
      return (data as any).muayeneKomisyonu.map((k: any) => ({
        adSoyad: k.adSoyad || k.ad_soyad || "",
        unvan: k.unvan || "Kontrol Görevlisi",
        gorevi: k.gorevi || "Görevli",
      }));
    }
    if ((data as any).hazirlayanPersonelAdi) {
      return [{
        adSoyad: (data as any).hazirlayanPersonelAdi,
        unvan: (data as any).hazirlayanPersonelUnvan || "Görevli",
        gorevi: "Görevli"
      }];
    }
    return [
      { adSoyad: "........................................", unvan: "Kontrol Görevlisi", gorevi: "Görevli" }
    ];
  })();

  return (
    <DocumentLayout
      data={data as any}
      hideHeader={hideHeader}
      hideFooter={hideFooter}
      pageSize={pageSize}
      orientation={orientation}
      pageNumber={1}
      totalPages={1}
    >
      <div
        style={{
          width: "100%",
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: "11.5pt",
          color: "#000",
          lineHeight: 1.5,
          position: "relative",
          minHeight: "26cm",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          {/* EK NO */}
          <div style={{ fontWeight: "bold", fontSize: "12pt", marginBottom: "28px" }}>
            Ek - 1
          </div>

          {/* BAŞLIK */}
          <div
            style={{
              textAlign: "center",
              fontSize: "13pt",
              fontWeight: "bold",
              marginBottom: "35px",
              letterSpacing: "0.3px",
            }}
          >
            YAPIM İŞLERİ GEÇİCİ KABUL TEKLİF BELGESİ
          </div>

          {/* BİLGİ TABLOSU */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "28px",
              fontSize: "11pt",
            }}
          >
            <tbody>
              <tr>
                <td style={{ width: "48%", padding: "5px 0", verticalAlign: "top" }}>İşin adı</td>
                <td style={{ width: "3%", padding: "5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ width: "49%", padding: "5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="isinAdi" value={isinAdi} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px 0", verticalAlign: "top" }}>Yüklenicinin adı/ticari unvanı</td>
                <td style={{ padding: "5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="yukleniciFirma" value={yuklenici} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px 0", verticalAlign: "top" }}>Sözleşme tarihi</td>
                <td style={{ padding: "5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <DateEditableField name="sozlesmeTarihi" value={sozlesmeTarihi} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px 0", verticalAlign: "top" }}>Sözleşme bedeli</td>
                <td style={{ padding: "5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="sozlesmeBedeli" value={sozlesmeBedeli ? `${sozlesmeBedeli} TL` : ""} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px 0", verticalAlign: "top" }}>Sözleşmeye göre işin süresi (takvim günü)</td>
                <td style={{ padding: "5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="isinSuresiGun" value={String(isinSuresiGun)} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px 0", verticalAlign: "top" }}>Sözleşmeye göre işin bitirilmesi gereken tarih</td>
                <td style={{ padding: "5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <DateEditableField name="sozlesmeyeGoreBitisTarihi" value={sozlesmeyeGoreBitisTarihi} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px 0", verticalAlign: "top" }}>Varsa süre uzatımları</td>
                <td style={{ padding: "5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="varsaSureUzatimlari" value={varsaSureUzatimlari} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px 0", verticalAlign: "top" }}>Süre uzatımı dahil işin bitirilmesi gereken tarih</td>
                <td style={{ padding: "5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <DateEditableField name="sureUzatimiDahilBitisTarihi" value={sureUzatimiDahilBitisTarihi} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px 0", verticalAlign: "top" }}>İşin bitirildiği tarih</td>
                <td style={{ padding: "5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <DateEditableField name="isinBitirildigiTarih" value={isinBitirildigiTarih} />
                </td>
              </tr>
            </tbody>
          </table>

          {/* PARAGRAF METNİ */}
          <div
            style={{
              textAlign: "justify",
              textIndent: "2.5em",
              lineHeight: "1.75",
              fontSize: "11.5pt",
              marginBottom: "16px",
            }}
          >
            <EditableField name="isinAdi" value={isinAdi} /> işinin bitirildiğine ilişkin yüklenici{" "}
            <EditableField name="yukleniciFirma" value={yuklenici} />
            'ın verdiği <DateEditableField name="yukleniciDilekceTarihi" value={dilekceTarihi} /> tarihli dilekçe üzerine{" "}
            <EditableField name="talimatVerenMakam" value={talimatMakam} />
            'nın talimatı ile yukarıda yazılı işin ön incelemesi{" "}
            <DateEditableField name="onIncelemeTarihi" value={onIncelemeTarihi} /> tarihinde tarafımızdan/tarafımdan yapılmış, işin sözleşmesine uygun olarak{" "}
            <EditableField name="tamamlanmaDurumu" value={data.tamamlanmaDurumu || "tamamlandığı"} /> ve geçici kabule{" "}
            <EditableField name="kabuleHazirDurumu" value={data.kabuleHazirDurumu || "hazır olduğu"} /> tespit edilmiştir.
          </div>

          <div
            style={{
              textAlign: "justify",
              textIndent: "2.5em",
              lineHeight: "1.75",
              fontSize: "11.5pt",
              marginBottom: "35px",
            }}
          >
            Gereğinin yapılmasını arz ederim/ederiz.
          </div>

          {/* TARİH */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "24px",
              paddingRight: "60px",
              fontSize: "11.5pt",
            }}
          >
            <div>
              <b>Tarih :</b> <DateEditableField name="tarih" value={tarih} />
            </div>
          </div>

          {/* GÖREVLİ / GÖREVLİLERİN İMZALARI */}
          <div style={{ marginTop: "16px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "14px", fontSize: "11pt" }}>
              Görevli veya görevlilerin
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: gorevliler.length > 2 ? "repeat(3, 1fr)" : "repeat(2, 1fr)",
                gap: "24px",
              }}
            >
              {gorevliler.map((gorevli, idx) => (
                <div key={idx} style={{ lineHeight: "1.6", fontSize: "11pt" }}>
                  <div>
                    Adı Soyadı &nbsp;:{" "}
                    <b>
                      <EditableField name={`gorevli_${idx}_ad`} value={gorevli.adSoyad} />
                    </b>
                  </div>
                  <div>
                    Görev unvanı :{" "}
                    <EditableField name={`gorevli_${idx}_unvan`} value={gorevli.unvan} />
                  </div>
                  <div>İmzası &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STANDART FORM KİK KODU (SAĞ ALT) */}
        <div
          style={{
            textAlign: "right",
            fontSize: "9pt",
            lineHeight: 1.3,
            color: "#1e293b",
            marginTop: "30px",
          }}
        >
          <div style={{ fontWeight: "bold" }}>Standart Form-KİK048.0/Y</div>
          <div>Yapım İşleri Geçici Kabul Teklif Belgesi</div>
        </div>
      </div>
    </DocumentLayout>
  );
};
