/* eslint-disable */
// ============================================================
// SCHEMA MANİFEST VERSİYONLARI — KANAL BAZLI DERLEME
// Sürümler alpha, beta ve rc dosyalarında gruplanmıştır.
// ============================================================

import { alphaManifests } from "./manifests.alpha";
import { betaManifests } from "./manifests.beta";
import { rcManifests } from "./manifests.rc";
import betaCurrent from "./versions/beta.current";

export const manifests: any[] = [
  ...alphaManifests,
  ...betaManifests,
  ...rcManifests,
  betaCurrent
];
