import React from "react";
import { EditableField } from "../../../document/EditableField";

interface PiyasaFiyatDegerlendirmeTableProps {
  processedKalemler: any[];
  formattedGenelToplam: string;
}

export const PiyasaFiyatDegerlendirmeTable: React.FC<PiyasaFiyatDegerlendirmeTableProps> = ({
  processedKalemler,
  formattedGenelToplam,
}) => {
  return (
    <>
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          margin: "10px 0 5px 0",
          fontSize: "9.5pt",
          textTransform: "uppercase",
          backgroundColor: "#f2f2f2",
          border: "1px solid #000",
          padding: "3px 0",
        }}
      >
        ALIM YAPILMASI UYGUN GÖRÜLEN GERÇEK / TÜZEL KİŞİLER
      </div>

      <table
        style={{
          width: "100%",
          maxWidth: "100%",
          tableLayout: "fixed",
          borderCollapse: "collapse",
          marginBottom: "8px",
          fontSize: "8.5pt",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          boxSizing: "border-box",
        }}
      >
        <colgroup>
          <col style={{ width: "3.5%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "4.5%" }} />
          <col style={{ width: "4.5%" }} />
          <col style={{ width: "33.5%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #000",
                padding: "4px 2px",
                textAlign: "center",
                backgroundColor: "#f2f2f2",
                fontWeight: "bold",
              }}
            >
              Sıra No
            </th>
            <th
              style={{
                border: "1px solid #000",
                padding: "4px 2px",
                textAlign: "center",
                backgroundColor: "#f2f2f2",
                fontWeight: "bold",
              }}
            >
              Mal / Hizmet / Yapım İşi
            </th>
            <th
              style={{
                border: "1px solid #000",
                padding: "4px 2px",
                textAlign: "center",
                backgroundColor: "#f2f2f2",
                fontWeight: "bold",
              }}
            >
              Özelliği
            </th>
            <th
              style={{
                border: "1px solid #000",
                padding: "4px 2px",
                textAlign: "center",
                backgroundColor: "#f2f2f2",
                fontWeight: "bold",
              }}
            >
              Birim
            </th>
            <th
              style={{
                border: "1px solid #000",
                padding: "4px 2px",
                textAlign: "center",
                backgroundColor: "#f2f2f2",
                fontWeight: "bold",
              }}
            >
              Miktar
            </th>
            <th
              style={{
                border: "1px solid #000",
                padding: "4px 3px",
                textAlign: "center",
                backgroundColor: "#f2f2f2",
                fontWeight: "bold",
              }}
            >
              Gerçek/Tüzel Kişinin Adı-Adresi
            </th>
            <th
              style={{
                border: "1px solid #000",
                padding: "4px 2px",
                textAlign: "center",
                backgroundColor: "#f2f2f2",
                fontWeight: "bold",
              }}
            >
              Teklif Fiyatı
            </th>
            <th
              style={{
                border: "1px solid #000",
                padding: "4px 2px",
                textAlign: "center",
                backgroundColor: "#f2f2f2",
                fontWeight: "bold",
              }}
            >
              Tutarı
            </th>
          </tr>
        </thead>
        <tbody>
          {processedKalemler.map((kalem, idx) => (
            <tr key={idx}>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px 2px",
                  textAlign: "center",
                }}
              >
                {kalem.siraNo ?? idx + 1}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px 3px",
                  textAlign: "left",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {kalem.malzemeAdi}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px 3px",
                  textAlign: "left",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {kalem.ozelligi}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px 2px",
                  textAlign: "center",
                }}
              >
                {kalem.birimi}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px 2px",
                  textAlign: "center",
                }}
              >
                {kalem.miktar}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px 3px",
                  textAlign: "left",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {kalem.enUygunFirmaAdi}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px 2px",
                  textAlign: "right",
                  whiteSpace: "nowrap",
                }}
              >
                {kalem.enDusukFiyat}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px 2px",
                  textAlign: "right",
                  whiteSpace: "nowrap",
                }}
              >
                {kalem.toplamBedel}
              </td>
            </tr>
          ))}

          {processedKalemler.length > 0 && (
            <tr style={{ fontWeight: "bold", backgroundColor: "#fafafa" }}>
              <td
                colSpan={6}
                style={{
                  border: "1px solid #000",
                  padding: "4px",
                  textAlign: "right",
                }}
              >
                Toplam Tutar :
              </td>
              <td style={{ border: "1px solid #000", padding: "4px 2px" }}></td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px 2px",
                  textAlign: "right",
                  whiteSpace: "nowrap",
                }}
              >
                <EditableField
                  name="genelToplam"
                  value={formattedGenelToplam}
                  placeholder="0,00"
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};
