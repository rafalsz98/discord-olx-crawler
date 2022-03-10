/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { parsePage } from "./olx";

jest.mock("axios", () => ({
  get: jest.fn(() => ({
    data: "<div id='offers_table'><div class='offer'><small /><small /><small>dzisiaj 12:50</small><div class='title-cell'><a href='test'>TEXT</a></div></div></div>",
  })),
}));

describe("olx", () => {
  it("returns correct date", async () => {
    const res = await parsePage("");
    expect(res).not.toBeNull();
    expect(res!.length).toEqual(1);
    expect(res![0].link).toEqual("test");
    expect(res![0].title).toEqual("TEXT");
    expect(res![0].date.hour()).toEqual(12);
    expect(res![0].date.minute()).toEqual(50);
  });
});
