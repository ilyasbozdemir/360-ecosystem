import React from "react";
import { DocumentLayout } from "../../document/DocumentLayout";
import { EditableField } from "../../document/EditableField";
import { DateEditableField } from "../../document/ApprovalSignature";
import { Kik051YapimKesinKabulTutanagiData } from "./Kik051YapimKesinKabulTutanagi.schema";

interface Props {
  data?: Partial<Kik051YapimKesinKabulTutanagiData> & Record<string, any>;
  pageSize?: "A4" | "A3";
  orientation?: "portrait" | "landscape";
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export const Kik051YapimKesinKabulTutanagi: React.FC<Props> = ({
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
  const bitimTarihi = data.sozlesmeyeGoreBitimTarihi || (data as any).teslimTarihi || "";
  const oncekiSureUzatimi = data.varsaGeciciKabuldenOncekiSureUzatimi || "Yoktur";
  const sonrakiSureUzatimi = data.varsaGeciciKabuldenSonrakiSureUzatimi || "Yoktur";
  const uzatilmisSureBitis = data.uzatilmisSurelereGoreBitisTarihi || bitimTarihi || "";
  const isinBitirildigiTarih = data.isinBitirildigiTarih || (data as any).kabulTarihi || "";
  const geciciKabulItibarTarihi = data.geciciKabulItibarTarihi || isinBitirildigiTarih || "";
  const teminatSuresi = data.teminatSuresi || "1 (bir) yıl / 365 gün";

  const geciciKabulTarihi = data.geciciKabulTarihi || geciciKabulItibarTarihi || "";
  const kesinKabulZamani = data.kesinKabulZamaniTarihi || (data as any).tutanakTarihi || "";
  const makamOnayiTarihi = data.makamOnayiTarihi || (data as any).onayTarihi || "";
  const incelemeAraligi = data.incelemeTarihAraligi || (kesinKabulZamani ? `${kesinKabulZamani} - ${kesinKabulZamani}` : "....../....../20.... - ....../....../20....");
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
            Ek - 4
          </div>

          {/* BAŞLIK */}
          <div
            style={{
              textAlign: "center",
              fontSize: "13pt",
              fontWeight: "bold",
              marginBottom: "18px",
              letterSpacing: "0.3px",
            }}
          >
            YAPIM İŞLERİ KESİN KABUL TUTANAĞI
          </div>

          {/* BİLGİ TABLOSU */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "16px",
              fontSize: "10.5pt",
            }}
          >
            <tbody>
              <tr>
                <td style={{ width: "48%", padding: "3px 0", verticalAlign: "top" }}>İşin adı</td>
                <td style={{ width: "3%", padding: "3px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ width: "49%", padding: "3px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="isinAdi" value={isinAdi} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", verticalAlign: "top" }}>Yüklenicinin adı/ticari unvanı</td>
                <td style={{ padding: "3px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="yukleniciFirma" value={yuklenici} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", verticalAlign: "top" }}>Sözleşme tarihi</td>
                <td style={{ padding: "3px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <DateEditableField name="sozlesmeTarihi" value={sozlesmeTarihi} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", verticalAlign: "top" }}>Sözleşme bedeli</td>
                <td style={{ padding: "3px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="sozlesmeBedeli" value={sozlesmeBedeli ? `${sozlesmeBedeli} TL` : ""} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", verticalAlign: "top" }}>Sözleşmeye göre işin süresi (takvim günü)</td>
                <td style={{ padding: "3px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="isinSuresiGun" value={String(isinSuresiGun)} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", verticalAlign: "top" }}>Sözleşmeye göre işin bitim tarihi</td>
                <td style={{ padding: "3px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <DateEditableField name="sozlesmeyeGoreBitimTarihi" value={bitimTarihi} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", verticalAlign: "top" }}>Varsa geçici kabulden önceki süre uzatımı</td>
                <td style={{ padding: "3px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="varsaGeciciKabuldenOncekiSureUzatimi" value={oncekiSureUzatimi} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", verticalAlign: "top" }}>Varsa geçici kabulden sonraki süre uzatımı</td>
                <td style={{ padding: "3px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="varsaGeciciKabuldenSonrakiSureUzatimi" value={sonrakiSureUzatimi} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", verticalAlign: "top" }}>Uzatılmış sürelere göre işin bitirilmesi gereken tarih</td>
                <td style={{ padding: "3px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <DateEditableField name="uzatilmisSurelereGoreBitisTarihi" value={uzatilmisSureBitis} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", verticalAlign: "top" }}>İşin bitirildiği tarih</td>
                <td style={{ padding: "3px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <DateEditableField name="isinBitirildigiTarih" value={isinBitirildigiTarih} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", verticalAlign: "top" }}>Geçici kabul itibar tarihi</td>
                <td style={{ padding: "3px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <DateEditableField name="geciciKabulItibarTarihi" value={geciciKabulItibarTarihi} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", verticalAlign: "top" }}>Sözleşmeye göre işin tamamlanmasından</td>
                <td style={{ padding: "3px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <span style={{ color: "#64748b", fontSize: "9.5pt" }}>Geçici Kabul Onayı İtibarıyla</span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", verticalAlign: "top" }}>Kesin kabule kadar olan teminat süresi</td>
                <td style={{ padding: "3px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <EditableField name="teminatSuresi" value={teminatSuresi} />
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
            <b><EditableField name="yukleniciFirma" value={yuklenici} /></b> arasında imzalanan sözleşme kapsamında
            gerçekleştirilen ve <b><DateEditableField name="geciciKabulTarihi" value={geciciKabulTarihi} /></b> tarihinde
            bitirilerek geçici kabulü yapılan; <b><DateEditableField name="kesinKabulZamaniTarihi" value={kesinKabulZamani} /></b> tarihinde
            ise, kesin kabul zamanı gelen söz konusu iş için <b><DateEditableField name="makamOnayiTarihi" value={makamOnayiTarihi} /></b> tarihli
            makam onayı ile teşkil edilen KESİN KABUL KOMİSYONUMUZ; Başkan <b><EditableField name="baskanAdi" value={baskan.adSoyad} /></b>
            {digerUyeler.map((u, i) => (
              <span key={i}>, Üye <b><EditableField name={`uye_${i}_ad`} value={u.adSoyad} /></b></span>
            ))} ve yüklenici <b><EditableField name="yukleniciFirma" value={yuklenici} /></b> nin de katılımı ile{" "}
            <b><EditableField name="incelemeTarihAraligi" value={incelemeAraligi} /></b> tarihleri arasında işyerine giderek kesin kabul bakımından gerekli inceleme yapmış olup, aşağıda yazılı hususları tespit etmiştir.
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
            Yapılan işin sözleşme ve eklerine uygun olduğu, geçici kabulde tespit edilen noksanların tamamlandığı ve teminat süresinde gerektiği gibi korunduğu, işin kesin kabule engel eksik, kusur ve arızalarının bulunmadığı görülmüştür.
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
              <b>Ancak (1)</b>{" "}
              <EditableField
                name="kusurVeNoksanlar"
                value={data.kusurVeNoksanlar || "Teminat süresi içerisinde ve kesin kabul muayenesinde herhangi bir eksik, kusur veya nefaset gerektiren arıza tespit edilmemiştir."}
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
            <b>SONUÇ:</b> Kesin kabul bakımından yerinde incelenen iş için yukarıda belirtilen (varsa ayrıntıları ve gerekçeleri ekli sayfada yazılı) hususlar makamın onayına sunulmak üzere bu kesin kabul tutanağı{" "}
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
            {/* SOL: KABUL KOMİSYONU ÜYELERİ */}
            <div>
              <div style={{ fontWeight: "bold", fontSize: "10.5pt", marginBottom: "8px" }}>
                Kabul Komisyonu Üyelerinin
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
              Kesin kabul tutanağı onay tarihi :{" "}
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
            (1) Buraya kabul komisyonu üyelerinin düşünceleri ile varsa kusur ve noksanların kaç maddeden ibaret olduğu, tamamlanması için gereken süre ile varsa nefaset kesintisi tutarı ve gerekçesi yazılacaktır.
          </div>
          <div
            style={{
              textAlign: "right",
              fontSize: "8.5pt",
              lineHeight: 1.25,
              color: "#1e293b",
            }}
          >
            <div style={{ fontWeight: "bold" }}>Standart Form-KİK051.0/Y</div>
            <div>Yapım İşleri Kesin Kabul Tutanağı</div>
          </div>
        </div>
      </div>
    </DocumentLayout>
  );
};
