import React from "react";
import { DocumentLayout } from "../../document/DocumentLayout";
import { EditableField } from "../../document/EditableField";
import {
  ApprovalSignature,
  EditableOlurPlaceholder,
} from "../../document/ApprovalSignature";
import { PiyasaFiyatArastirmaTutanagiData } from "./PiyasaFiyatArastirmaTutanagi.schema";
import { usePiyasaFiyatArastirmaTutanagi } from "./PiyasaFiyatArastirmaTutanagi.hook";
import { PiyasaFiyatHeader } from "./components/PiyasaFiyatHeader";
import { PiyasaFiyatTeklifleriTable } from "./components/PiyasaFiyatTeklifleriTable";
import { PiyasaFiyatDegerlendirmeTable } from "./components/PiyasaFiyatDegerlendirmeTable";
import { PiyasaFiyatGorevliler } from "./components/PiyasaFiyatGorevliler";

interface Props {
  data?: Partial<PiyasaFiyatArastirmaTutanagiData> & Record<string, any>;
  pageSize?: "A4" | "A3";
  orientation?: "portrait" | "landscape";
}

export const PiyasaFiyatArastirmaTutanagi: React.FC<Props> = ({
  data = {},
  pageSize = "A4",
  orientation = "landscape",
}) => {
  const {
    idareAdi,
    kurumAdi,
    dosyaTarihi,
    evrakSayisi,
    tarih,
    isAdi,
    isBasligi,
    aciklama,
    displayFirmalar,
    processedKalemler,
    displayFirmaToplamlari,
    formattedGenelToplam,
    displayKomisyon,
    baskanAdi,
    baskanUnvan,
    hesaplamaEsasiText,
    olurYazisi,
    formatMoney,
  } = usePiyasaFiyatArastirmaTutanagi(data);

  return (
    <DocumentLayout
      data={data as any}
      hideFooter={false}
      pageSize={pageSize}
      orientation={orientation}
      pageNumber={1}
      totalPages={1}
    >
      <div
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: "9.5pt",
          color: "#000",
          lineHeight: 1.35,
          width: "100%",
        }}
      >
        <PiyasaFiyatHeader
          idareAdi={idareAdi}
          kurumAdi={kurumAdi}
          isBasligi={isBasligi}
          isAdi={isAdi}
          dosyaTarihi={dosyaTarihi}
          evrakSayisi={evrakSayisi}
          tarih={tarih}
        />

        <PiyasaFiyatTeklifleriTable
          displayFirmalar={displayFirmalar}
          processedKalemler={processedKalemler}
          displayFirmaToplamlari={displayFirmaToplamlari}
          formatMoney={formatMoney}
          data={data}
        />

        <PiyasaFiyatDegerlendirmeTable
          processedKalemler={processedKalemler}
          formattedGenelToplam={formattedGenelToplam}
        />

        <div style={{ fontSize: "8.5pt", marginBottom: "8px" }}>
          Para Birimi TL.
        </div>

        <div
          style={{
            fontSize: "9pt",
            textAlign: "justify",
            textIndent: "40px",
            marginTop: "10px",
          }}
        >
          Yapılan fiyat araştırmasına göre, firmaların vermiş olduğu{" "}
          <EditableField
            name="hesaplamaEsasiText"
            value={hesaplamaEsasiText}
          />{" "}
          alınarak maliyet KDV hariç{" "}
          <EditableField
            name="genelToplam"
            value={formattedGenelToplam}
            placeholder="0,00"
          />{" "}
          TL olarak tespit edilmiştir.
        </div>

        {aciklama && (
          <div
            style={{
              border: "1px solid #000",
              padding: "8px",
              minHeight: "80px",
              marginTop: "10px",
              fontSize: "9pt",
              boxSizing: "border-box",
              whiteSpace: "pre-wrap",
            }}
          >
            <strong>Açıklama:</strong>{" "}
            <EditableField name="aciklama" value={aciklama} multiline />
          </div>
        )}

        <PiyasaFiyatGorevliler displayKomisyon={displayKomisyon} />

        {/* HARCAMA YETKİLİSİ ONAYI (OLUR) */}
        {olurYazisi ? (
          <ApprovalSignature
            title="OLUR"
            date={dosyaTarihi || tarih}
            dateField="dosyaTarihi"
            adSoyad={baskanAdi}
            unvan={baskanUnvan}
            nameField="baskanAdi"
            unvanField="baskanUnvan"
            showSpace={true}
            marginTop={25}
          />
        ) : (
          <EditableOlurPlaceholder />
        )}
      </div>
    </DocumentLayout>
  );
};
