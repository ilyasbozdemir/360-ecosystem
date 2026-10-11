import React from "react";
import { EditableField } from "../../../document/EditableField";

interface PiyasaFiyatGorevlilerProps {
  displayKomisyon: any[];
}

export const PiyasaFiyatGorevliler: React.FC<PiyasaFiyatGorevlilerProps> = ({
  displayKomisyon,
}) => {
  return (
    <div
      style={{
        marginTop: "15px",
        textAlign: "center",
        pageBreakInside: "avoid",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: "9.5pt",
          marginBottom: "15px",
        }}
      >
        Piyasa Fiyat Araştırması Görevlisi / Görevlileri
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          textAlign: "center",
        }}
      >
        {displayKomisyon.map((uye: any, idx: number) => (
          <div
            key={idx}
            style={{
              width: "22%",
              minWidth: "120px",
              padding: "5px",
              fontSize: "9pt",
              lineHeight: 1.35,
            }}
          >
            <span
              style={{ fontWeight: "bold", textTransform: "uppercase" }}
            >
              <EditableField
                name={`komisyon.${idx}.adSoyad`}
                value={uye.adSoyad || ""}
                placeholder="Adı Soyadı"
              />
            </span>
            <br />
            <span>
              <EditableField
                name={`komisyon.${idx}.unvan`}
                value={uye.unvan || ""}
                placeholder="Unvanı"
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
