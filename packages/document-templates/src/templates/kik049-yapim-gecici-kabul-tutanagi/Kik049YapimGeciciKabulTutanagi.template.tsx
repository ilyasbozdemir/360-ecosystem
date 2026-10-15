import React from "react";
import { DocumentLayout } from "../../document/DocumentLayout";
import { EditableField } from "../../document/EditableField";
import { DateEditableField } from "../../document/ApprovalSignature";
import { Kik049YapimGeciciKabulTutanagiData } from "./Kik049YapimGeciciKabulTutanagi.schema";

interface Props {
  data?: Partial<Kik049YapimGeciciKabulTutanagiData> & Record<string, any>;
  pageSize?: "A4" | "A3";
  orientation?: "portrait" | "landscape";
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export const Kik049YapimGeciciKabulTutanagi: React.FC<Props> = ({
  data = {},
  pageSize = "A4",
  orientation = "portrait",
  hideHeader = true,
  hideFooter = true,
}) => {
  const kurumAdi = data.kurumAdi || (data as any).kurumumuz || (data as any).harcamaBirimi || "İdaremiz";
  const isinAdi = data.isinAdi || data.dosyaKonusu || (data as any).konu || "............................................................................";
  const yuklenici = data.yukleniciFirma || (data as any).kazananFirmaUnvan || "..................................................";
  const sozlesmeTarihi = data.sozlesmeTarihi || (data as any).sozlesme_tarihi || "";
  const sozlesmeBedeli = data.sozlesmeBedeli || (data as any).genelToplam || (data as any).tutar || "";
  const isinSuresiGun = data.isinSuresiGun || (data as any).teslimGun || "....";
  const sozlesmeyeGoreBitisTarihi = data.sozlesmeyeGoreBitisTarihi || (data as any).teslimTarihi || "";
  const varsaSureUzatimlari = data.varsaSureUzatimlari || "Yoktur";
  const sureUzatimiDahilBitisTarihi = data.sureUzatimiDahilBitisTarihi || sozlesmeyeGoreBitisTarihi || "";
  const isinBitirildigiTarih = data.isinBitirildigiTarih || (data as any).kabulTarihi || (data as any).tutanakTarihi || "";
  const geciciKabulItibarTarihi = data.geciciKabulItibarTarihi || isinBitirildigiTarih || (data as any).kabulTarihi || "";

  const makamOluruTarihi = data.makamOluruTarihi || sozlesmeTarihi || (data as any).onayTarihi || "";
  const incelemeAraligi = data.incelemeTarihAraligi || (geciciKabulItibarTarihi ? `${geciciKabulItibarTarihi} - ${geciciKabulItibarTarihi}` : "....../....../20.... - ....../....../20....");
  const bitimItibarTarihi = data.bitimItibarTarihi || geciciKabulItibarTarihi || "....../....../20....";
  const onayMakami = data.onayMakami || (data as any).harcamaYetkilisiUnvan || "Harcama Yetkilisi";
  const nushaSayisi = data.nushaSayisi || "2 (iki)";
  const tarih = data.tarih || (data as any).kabulTarihi || (data as any).tutanakTarihi || "";
  const onayTarihi = data.onayTarihi || tarih || "";
  const harcamaYetkilisi = (data as any).harcamaYetkilisiAdi || (data as any).onaylayanPersonelAdi || (data as any).baskanAdi || "";

  // Komisyon üyeleri
  const komisyon: Array<{ adSoyad: string; unvan: string; gorevi?: string }> = (() => {
    if (data.komisyon && Array.isArray(data.komisyon) && data.komisyon.length > 0) {
      return data.komisyon.map((k: any) => ({
        adSoyad: k.adSoyad || k.ad_soyad || "",
        unvan: k.unvan || "Komisyon Üyesi",
        gorevi: k.gorevi || k.gorev || "Üye",
      }));
    }
    if ((data as any).muayeneKomisyonu && Array.isArray((data as any).muayeneKomisyonu) && (data as any).muayeneKomisyonu.length > 0) {
      return (data as any).muayeneKomisyonu.map((k: any) => ({
        adSoyad: k.adSoyad || k.ad_soyad || "",
        unvan: k.unvan || "Komisyon Üyesi",
        gorevi: k.gorevi || k.gorev || "Üye",
      }));
    }
    return [
      { adSoyad: "........................................", unvan: "Şube Müdürü / Mühendis", gorevi: "Başkan" },
      { adSoyad: "........................................", unvan: "Mühendis / Tekniker", gorevi: "Üye" },
      { adSoyad: "........................................", unvan: "Mühendis / Tekniker", gorevi: "Üye" },
    ];
  })();

  const baskan = komisyon.find((k) => (k.gorevi || "").toLowerCase().includes("baskan")) || komisyon[0];
  const digerUyeler = komisyon.filter((k) => k !== baskan);

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
          fontSize: "11pt",
          color: "#000",
          lineHeight: 1.45,
          position: "relative",
          minHeight: "26.5cm",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          {/* EK NO */}
          <div style={{ fontWeight: "bold", fontSize: "11.5pt", marginBottom: "16px" }}>
            Ek - 2
          </div>

          {/* BAŞLIK */}
          <div
            style={{
              textAlign: "center",
              fontSize: "13pt",
              fontWeight: "bold",
              marginBottom: "20px",
              letterSpacing: "0.3px",
            }}
          >
            YAPIM İŞLERİ GEÇİCİ KABUL TUTANAĞI
          </div>

          {/* BİLGİ TABLOSU */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "18px",
              fontSize: "10.5pt",
            }}
          >
            <tbody>
              <tr>
                <td style={{ width: "48%", padding: "3.5px 0", verticalAlign: "top" }}>İşin adı</td>
                <td style={{ width: "3%", padding: "3.5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ width: "49%", padding: "3.5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="isinAdi" value={isinAdi} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3.5px 0", verticalAlign: "top" }}>Yüklenicinin adı/ticari unvanı</td>
                <td style={{ padding: "3.5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3.5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="yukleniciFirma" value={yuklenici} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3.5px 0", verticalAlign: "top" }}>Sözleşme tarihi</td>
                <td style={{ padding: "3.5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3.5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <DateEditableField name="sozlesmeTarihi" value={sozlesmeTarihi} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3.5px 0", verticalAlign: "top" }}>Sözleşme bedeli</td>
                <td style={{ padding: "3.5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3.5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="sozlesmeBedeli" value={sozlesmeBedeli ? `${sozlesmeBedeli} TL` : ""} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3.5px 0", verticalAlign: "top" }}>Sözleşmeye göre işin süresi(takvim günü)</td>
                <td style={{ padding: "3.5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3.5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="isinSuresiGun" value={String(isinSuresiGun)} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3.5px 0", verticalAlign: "top" }}>Sözleşmeye göre işin bitirilmesi gereken tarih</td>
                <td style={{ padding: "3.5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3.5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <DateEditableField name="sozlesmeyeGoreBitisTarihi" value={sozlesmeyeGoreBitisTarihi} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3.5px 0", verticalAlign: "top" }}>Varsa süre uzatımları</td>
                <td style={{ padding: "3.5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3.5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="varsaSureUzatimlari" value={varsaSureUzatimlari} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3.5px 0", verticalAlign: "top" }}>Süre uzatımı dahil işin bitirilmesi gereken tarih</td>
                <td style={{ padding: "3.5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3.5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <DateEditableField name="sureUzatimiDahilBitisTarihi" value={sureUzatimiDahilBitisTarihi} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3.5px 0", verticalAlign: "top" }}>İşin bitirildiği tarih</td>
                <td style={{ padding: "3.5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3.5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <DateEditableField name="isinBitirildigiTarih" value={isinBitirildigiTarih} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3.5px 0", verticalAlign: "top" }}>Geçici kabul itibar tarihi</td>
                <td style={{ padding: "3.5px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3.5px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <DateEditableField name="geciciKabulItibarTarihi" value={geciciKabulItibarTarihi} />
                </td>
              </tr>
            </tbody>
          </table>

          {/* PARAGRAF 1 */}
          <div
            style={{
              textAlign: "justify",
              textIndent: "2.2em",
              lineHeight: "1.6",
              fontSize: "10.5pt",
              marginBottom: "10px",
            }}
          >
            <EditableField name="kurumAdi" value={kurumAdi} /> ile yüklenici{" "}
            <EditableField name="yukleniciFirma" value={yuklenici} /> arasında imzalanan sözleşme kapsamında
            gerçekleştirilen iş için düzenlenen GEÇİCİ KABUL TEKLİF BELGESİ’nden ön incelemenin yapıldığı anlaşılmış olup;{" "}
            <DateEditableField name="makamOluruTarihi" value={makamOluruTarihi} /> tarihli makam oluru ile Başkan{" "}
            <b><EditableField name="baskanAdi" value={baskan.adSoyad} /></b>
            {digerUyeler.map((u, i) => (
              <span key={i}>, Üye <b><EditableField name={`uye_${i}_ad`} value={u.adSoyad} /></b></span>
            ))} olmak üzere teşkil edilen GEÇİCİ KABUL KOMİSYONUMUZ, yüklenici{" "}
            <EditableField name="yukleniciFirma" value={yuklenici} /> de hazır olduğu halde{" "}
            <EditableField name="incelemeTarihAraligi" value={incelemeAraligi} /> tarihleri arasında işyerine giderek yüklenici tarafından yapılmış işleri geçici kabul bakımından incelemiş ve aşağıda yazılı hususları tespit etmiştir.
          </div>

          {/* PARAGRAF 2 */}
          <div
            style={{
              textAlign: "justify",
              textIndent: "2.2em",
              lineHeight: "1.6",
              fontSize: "10.5pt",
              marginBottom: "10px",
            }}
          >
            Yapılan işin sözleşme ve eklerine uygun olduğu ve geçici kabule engel olabilecek eksik, kusur ve arızaların bulunmadığı görülmüştür.
          </div>

          {/* ANCAK KUSUR KUTUSU */}
          <div
            style={{
              lineHeight: "1.6",
              fontSize: "10.5pt",
              marginBottom: "12px",
            }}
          >
            <div>
              <b>ANCAK(1)</b>{" "}
              <EditableField
                name="kusurVeNoksanlar"
                value={data.kusurVeNoksanlar || "Yapılan incelemede işin kabule engel herhangi bir kusur ve noksanının bulunmadığı tespit edilmiştir."}
                multiline={true}
              />
            </div>
          </div>

          {/* SONUÇ */}
          <div
            style={{
              textAlign: "justify",
              textIndent: "2.2em",
              lineHeight: "1.6",
              fontSize: "10.5pt",
              marginBottom: "16px",
            }}
          >
            <b>SONUÇ:</b> Geçici kabul bakımından muayene ve inceleme işlemlerinin yapılması görevi Komisyonumuza verilmiş bulunan söz konusu işin yukarıda belirtilen (varsa ayrıntıları veya gerekçeleri ekli sayfalarda sayılan ve gösterilen) kayıtlarla ve bitim tarihi de{" "}
            <b><EditableField name="bitimItibarTarihi" value={bitimItibarTarihi} /></b> olarak itibar edilmek üzere geçici kabulünün yapılması Komisyonumuzca uygun görülmüş ve{" "}
            <b><EditableField name="onayMakami" value={onayMakami} /></b> Makamın onayına sunulmak üzere işbu Geçici Kabul Tutanağı{" "}
            <b><EditableField name="nushaSayisi" value={nushaSayisi} /></b> nüsha olarak düzenlenmiştir.
          </div>

          {/* TARİH */}
          <div
            style={{
              textAlign: "left",
              marginBottom: "12px",
              fontSize: "10.5pt",
            }}
          >
            <b>Tarih :</b> <DateEditableField name="tarih" value={tarih} />
          </div>

          {/* İMZA BLOKLARI: KOMİSYON (SOL) & YÜKLENİCİ (SAĞ) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "20px",
              marginBottom: "14px",
            }}
          >
            {/* SOL: KOMİSYON ÜYELERİ */}
            <div>
              <div style={{ fontWeight: "bold", fontSize: "10.5pt", marginBottom: "8px" }}>
                Geçici Kabul Komisyonu Üyelerinin
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {komisyon.map((uye, idx) => (
                  <div key={idx} style={{ fontSize: "10pt", lineHeight: "1.4" }}>
                    <div>
                      Adı soyadı &nbsp;&nbsp;: <b><EditableField name={`uye_ad_${idx}`} value={uye.adSoyad} /></b>
                    </div>
                    <div>
                      Görev unvanı : <EditableField name={`uye_unvan_${idx}`} value={uye.unvan} /> ({uye.gorevi || "Üye"})
                    </div>
                    <div>İmzası &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SAĞ: YÜKLENİCİ */}
            <div>
              <div style={{ fontWeight: "bold", fontSize: "10.5pt", marginBottom: "8px" }}>
                Yüklenicinin
              </div>
              <div style={{ fontSize: "10pt", lineHeight: "1.4" }}>
                <div>
                  Adı//ticari unvanı : <b><EditableField name="yukleniciFirma" value={yuklenici} /></b>
                </div>
                <div>İmzası &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</div>
              </div>
            </div>
          </div>

          {/* ONAY MAKAMI (ALT ORTA/SAĞ) */}
          <div
            style={{
              borderTop: "1px dashed #cbd5e1",
              paddingTop: "8px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              fontSize: "10pt",
            }}
          >
            <div>
              Geçici kabul tutanağı onay tarihi :{" "}
              <b><DateEditableField name="onayTarihi" value={onayTarihi} /></b>
            </div>
            <div style={{ textAlign: "center", minWidth: "180px" }}>
              <div style={{ fontWeight: "bold" }}>Yetkili makamın imzası</div>
              <div style={{ marginTop: "4px", fontSize: "9.5pt" }}>{harcamaYetkilisi}</div>
              <div style={{ fontSize: "9pt", color: "#475569" }}>{onayMakami}</div>
            </div>
          </div>
        </div>

        {/* DİPNOT (1) & KİK KODU */}
        <div>
          <div
            style={{
              fontSize: "8pt",
              lineHeight: 1.3,
              color: "#334155",
              borderTop: "1px solid #94a3b8",
              paddingTop: "4px",
              marginBottom: "4px",
            }}
          >
            (1) Buraya geçici kabul komisyonu üyelerinin düşünceleri ile varsa kusur ve noksanların kaç maddeden ibaret olduğu, tamamlanması için gereken süre veya nefaset kesilmesine karar verilmesi halinde nefaset tutarları yazılacaktır.
          </div>
          <div
            style={{
              textAlign: "right",
              fontSize: "8.5pt",
              lineHeight: 1.25,
              color: "#1e293b",
            }}
          >
            <div style={{ fontWeight: "bold" }}>Standart Form-KİK049.0/Y</div>
            <div>Yapım İşleri Geçici Kabul Tutanağı</div>
          </div>
        </div>
      </div>
    </DocumentLayout>
  );
};
