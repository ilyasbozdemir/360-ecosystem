import React from "react";
import { DocumentLayout } from "../../document/DocumentLayout";
import { EditableField } from "../../document/EditableField";
import { DateEditableField } from "../../document/ApprovalSignature";
import { Kik050YapimKesinKabulTeklifData } from "./Kik050YapimKesinKabulTeklif.schema";

interface Props {
  data?: Partial<Kik050YapimKesinKabulTeklifData> & Record<string, any>;
  pageSize?: "A4" | "A3";
  orientation?: "portrait" | "landscape";
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export const Kik050YapimKesinKabulTeklif: React.FC<Props> = ({
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
  const bitimTarihi = data.sozlesmeyeGoreBitimTarihi || (data as any).teslimTarihi || "";
  const oncekiSureUzatimi = data.varsaGeciciKabuldenOncekiSureUzatimi || "Yoktur";
  const sonrakiSureUzatimi = data.varsaGeciciKabuldenSonrakiSureUzatimi || "Yoktur";
  const sureUzatimiDahilBitis = data.sureUzatimiDahilBitisTarihi || bitimTarihi || "";
  const isinBitirildigiTarih = data.isinBitirildigiTarih || (data as any).kabulTarihi || "";
  const geciciKabulItibarTarihi = data.geciciKabulItibarTarihi || isinBitirildigiTarih || "";
  const teminatSuresi = data.teminatSuresi || "1 (bir) yıl / 365 gün";

  const geciciKabulTarihi = data.geciciKabulTarihi || geciciKabulItibarTarihi || "";
  const kesinKabulZamani = data.kesinKabulZamaniTarihi || (data as any).tutanakTarihi || "";
  const muayeneTarihi = data.muayeneTarihi || (data as any).tutanakTarihi || (data as any).tarih || "";
  const tarih = data.tarih || (data as any).kabulTarihi || (data as any).tutanakTarihi || "";

  // Görevli listesi
  const gorevliler: Array<{ adSoyad: string; unvan: string }> = (() => {
    if (data.gorevliler && Array.isArray(data.gorevliler) && data.gorevliler.length > 0) {
      return data.gorevliler.map((g: any) => ({
        adSoyad: g.adSoyad || g.ad_soyad || "",
        unvan: g.unvan || g.gorev || "Kontrol Görevlisi",
      }));
    }
    if ((data as any).komisyon && Array.isArray((data as any).komisyon) && (data as any).komisyon.length > 0) {
      return (data as any).komisyon.map((k: any) => ({
        adSoyad: k.adSoyad || k.ad_soyad || "",
        unvan: k.unvan || "Kontrol Görevlisi",
      }));
    }
    if ((data as any).hazirlayanPersonelAdi) {
      return [{
        adSoyad: (data as any).hazirlayanPersonelAdi,
        unvan: (data as any).hazirlayanPersonelUnvan || "Görevli",
      }];
    }
    return [
      { adSoyad: "........................................", unvan: "Kontrol Görevlisi" }
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
          <div style={{ fontWeight: "bold", fontSize: "11.5pt", marginBottom: "18px" }}>
            Ek - 3
          </div>

          {/* BAŞLIK */}
          <div
            style={{
              textAlign: "center",
              fontSize: "13pt",
              fontWeight: "bold",
              marginBottom: "22px",
              letterSpacing: "0.3px",
            }}
          >
            YAPIM İŞLERİ KESİN KABUL TEKLİF BELGESİ
          </div>

          {/* BİLGİ TABLOSU */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
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
                <td style={{ padding: "3px 0", verticalAlign: "top" }}>Süre uzatımı dahil işin bitirilmesi gereken tarih</td>
                <td style={{ padding: "3px 0", textAlign: "center", verticalAlign: "top" }}>:</td>
                <td style={{ padding: "3px 0", borderBottom: "1px dotted #666", verticalAlign: "top" }}>
                  <DateEditableField name="sureUzatimiDahilBitisTarihi" value={sureUzatimiDahilBitis} />
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

          {/* PARAGRAF METNİ */}
          <div
            style={{
              textAlign: "justify",
              textIndent: "2.5em",
              lineHeight: "1.75",
              fontSize: "11pt",
              marginBottom: "16px",
            }}
          >
            Yüklenici <b><EditableField name="yukleniciFirma" value={yuklenici} /></b> tarafından gerçekleştirilen ve{" "}
            <b><DateEditableField name="geciciKabulTarihi" value={geciciKabulTarihi} /></b> tarihinde geçici kabulü yapılan;{" "}
            <b><DateEditableField name="kesinKabulZamaniTarihi" value={kesinKabulZamani} /></b> tarihinde ise, kesin kabul zamanı gelen yukarıda yazılı işin işyeri inceleme ve muayenesi{" "}
            <b><DateEditableField name="muayeneTarihi" value={muayeneTarihi} /></b> tarihinde tarafımızdan/tarafımdan yapılmış olan işin sözleşme ve eklerine uygun ve kesin kabulü yapılabilecek halde{" "}
            <EditableField name="kesinKabulUygunlukDurumu" value={data.kesinKabulUygunlukDurumu || "olduğu"} /> tespit edilmiştir.
          </div>

          <div
            style={{
              textAlign: "justify",
              textIndent: "2.5em",
              lineHeight: "1.75",
              fontSize: "11pt",
              marginBottom: "30px",
            }}
          >
            Kesin kabul komisyonunun teşkil{" "}
            <EditableField name="komisyonTeskilTalebi" value={data.komisyonTeskilTalebi || "edilmesini"} /> arz ederim/ederiz.
          </div>

          {/* TARİH */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
              paddingRight: "60px",
              fontSize: "11pt",
            }}
          >
            <div>
              <b>Tarih :</b> <DateEditableField name="tarih" value={tarih} />
            </div>
          </div>

          {/* GÖREVLİLER İMZASI */}
          <div style={{ marginTop: "12px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "12px", fontSize: "11pt" }}>
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
                <div key={idx} style={{ lineHeight: "1.6", fontSize: "10.5pt" }}>
                  <div>
                    Adı soyadı &nbsp;:{" "}
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

        {/* STANDART FORM KİK KODU */}
        <div
          style={{
            textAlign: "right",
            fontSize: "9pt",
            lineHeight: 1.3,
            color: "#1e293b",
            marginTop: "20px",
          }}
        >
          <div style={{ fontWeight: "bold" }}>Standart Form-KİK050.0/Y</div>
          <div>Yapım İşleri Kesin Kabul Teklif Belgesi</div>
        </div>
      </div>
    </DocumentLayout>
  );
};
