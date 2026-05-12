import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Khu Du Lịch Sinh Thái Sơn Kiều",
    short_name: "Sơn Kiều",
    description:
      "Khu du lịch sinh thái tại Trường Sơn, Quảng Trị với hang động, hồ suối tự nhiên, ẩm thực bản địa và trải nghiệm thiên nhiên.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#04130a",
    theme_color: "#047857",
    lang: "vi",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
