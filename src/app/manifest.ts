import { BRAND_LOGO_SRC } from "@/lib/brand";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lista de presentes — casamento",
    short_name: "Casamento",
    description: "Reserva um presente e celebra connosco.",
    start_url: "/",
    display: "standalone",
    background_color: "#e8ddd2",
    theme_color: "#2d5a75",
    lang: "pt",
    icons: [
      {
        src: BRAND_LOGO_SRC,
        type: "image/avif",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
