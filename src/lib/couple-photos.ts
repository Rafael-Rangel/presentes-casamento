/** Caminhos públicos das fotos do casal (`public/imagens_casal` → `/imagens_casal/...`). */
export const COUPLE_GALLERY: readonly string[] = [
  "/imagens_casal/IMG_7644_VSCO.JPG",
  "/imagens_casal/IMG_7647_VSCO.JPG",
  "/imagens_casal/IMG_7648_VSCO.JPG",
  "/imagens_casal/IMG_7649_VSCO.JPG",
  "/imagens_casal/IMG_7679_VSCO.JPG",
  "/imagens_casal/IMG_7716_VSCO.JPG",
  "/imagens_casal/IMG_7721_VSCO.JPG",
  "/imagens_casal/IMG_7731_VSCO.JPG",
  "/imagens_casal/IMG_7739_VSCO.JPG",
  "/imagens_casal/IMG_7746_VSCO.JPG",
  "/imagens_casal/IMG_7752_VSCO.JPG",
  "/imagens_casal/IMG_7752_VSCO%202.JPG",
  "/imagens_casal/IMG_7754_VSCO.JPG",
  "/imagens_casal/IMG_7773.JPG",
  "/imagens_casal/IMG_7788.JPG",
  "/imagens_casal/IMG_7792.JPG",
  "/imagens_casal/IMG_7795.JPG",
  "/imagens_casal/IMG_7869.JPG",
  "/imagens_casal/IMG_7874.JPG",
  "/imagens_casal/IMG_7916.JPG",
];

export function hashToPositive(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function couplePhotoForKey(key: string): string {
  const i = hashToPositive(key) % COUPLE_GALLERY.length;
  return COUPLE_GALLERY[i]!;
}

/** Para hero: primeiras N fotos estáveis. */
export function coupleHeroPhotos(count = 5): string[] {
  return COUPLE_GALLERY.slice(0, count);
}
