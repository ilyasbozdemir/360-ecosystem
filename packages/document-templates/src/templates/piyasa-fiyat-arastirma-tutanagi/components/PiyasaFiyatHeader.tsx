import React from "react";
import { EditableField } from "../../../document/EditableField";
import { DateEditableField } from "../../../document/ApprovalSignature";

interface PiyasaFiyatHeaderProps {
  idareAdi?: string;
  kurumAdi?: string;
  isBasligi?: string;
  isAdi?: string;
  dosyaTarihi?: string;
  evrakSayisi?: string;
  tarih?: string;
}

export const PiyasaFiyatHeader: React.FC<PiyasaFiyatHeaderProps> = ({
  idareAdi,
  kurumAdi,
  isBasligi,
  isAdi,
  dosyaTarihi,
  evrakSayisi,
  tarih,
}) => {
  return (
    <>
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          textDecoration: "underline",
          marginBottom: "12px",
          fontSize: "11.5pt",
          textTransform: "uppercase",
        }}
      >
        PİYASA FİYAT ARAŞTIRMA TUTANAĞI
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "10px",
          fontSize: "9.5pt",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                textAlign: "left",
                width: "70%",
                verticalAlign: "top",
              }}
            >
              <strong>İdarenin Adı:</strong>{" "}
              <EditableField
                name="idareAdi"
                value={idareAdi || kurumAdi || ""}
                placeholder="İdare Adı"
              />
              <br />
              <strong>{isBasligi}</strong>{" "}
              <EditableField
                name="isAdi"
                value={isAdi}
                placeholder="İşin Adı"
              />
              <br />
              <strong>Onay Belgesi Tarihi:</strong>{" "}
              <DateEditableField name="dosyaTarihi" value={dosyaTarihi} />
              <br />
              <strong>Sayı:</strong>{" "}
              <EditableField name="evrakSayisi" value={evrakSayisi} />
            </td>
            <td
              style={{
                textAlign: "right",
                width: "30%",
                verticalAlign: "top",
              }}
            >
              <strong>Düzenleme Tarihi:</strong>{" "}
              <DateEditableField name="tarih" value={tarih} />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
