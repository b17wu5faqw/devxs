import { Roboto, Open_Sans, Montserrat } from "next/font/google";

const roboto = Roboto({
    subsets: ["latin"],
    weight: "400",
});

const openSans = Open_Sans({
    subsets: ["latin"],
    weight: "700",
});

const montserrat = Montserrat({ subsets: ["latin"] });

export { roboto, openSans, montserrat };
