/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { readFileSync } from "fs";
import { parseIndexPage, getSinglePageDescription } from "./olx";
import path from "path";

jest.mock("axios", () => ({
  get: jest.fn(() => ({
    data: readFileSync(
      path.resolve(__dirname, "../test/responseIndexPage.html"),
      "utf8",
    ),
  })),
}));

describe("olx", () => {
  describe("parseIndexPage", () => {
    it("returns correct date", async () => {
      const res = await parseIndexPage("");
      expect(res).not.toBeNull();
      expect(res!.length).toEqual(16);
      expect(res![0].link).toEqual(
        "https://olx.pl/d/oferta/bezposrednio-kawalerka-salwator-poczatek-ul-ksiecia-jozefa-CID3-IDR4ml5.html",
      );
      expect(res![0].title).toEqual(
        "Bezpośrednio, kawalerka - SALWATOR - początek ul. Księcia Józefa",
      );
      expect(res![0].date.hour()).toEqual(9);
      expect(res![0].date.minute()).toEqual(58);
    });
  });

  describe("parseSinglePage", () => {
    it("returns correct description", async () => {
      jest.mock("axios", () => ({
        get: jest.fn(() => ({
          data: readFileSync(
            path.resolve(__dirname, "../test/responseSinglePage.html"),
            "utf8",
          ),
        })),
      }));

      const res = await getSinglePageDescription("");
      expect(res).not.toBeNull();
      expect(res).toEqual(
        "Bezpośrednio, kawalerka - SALWATOR - początek ul. Księcia Józefa. Nowa, bezczynszowa duża kawalerka w Mistrzejowicach -blisko Aqua Parku. Nowa, bezczynszowa kawalerka w Mistrzejowicach - rejon Serenady. Bezczynszowa kawalerka w Czyżynach przy galerii M1. Kawalerka do wynajęcia. mieszkanie 2-pokojowe z dużym balkonem przy ul. Piltza, Kraków. Wynajmę mieszkanie 37m2 ul.Ugorek. Piękne mieszkanie 2 osobne pok obok basen AGH i miasteczko studenckie. Mieszkanie dostępne od 28-go lipca BEZPOŚREDNIO.",
      );
    });
  });
});
