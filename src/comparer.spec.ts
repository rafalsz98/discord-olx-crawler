import moment from "moment";

import * as comparer from "./comparer";
import { ResultData } from "./olx";

let dates = [
  { date: moment("2077-09-09 10:00"), link: "link", title: "title" },
  { date: moment("2077-09-09 9:00"), link: "link", title: "title" },
  { date: moment("2077-09-09 8:00"), link: "link", title: "title" },
] as ResultData[];

jest.mock("./olx", () => ({
  parsePage: jest.fn(async () => dates),
}));

describe("comparer", () => {
  it("returns empty array for no new dates", async () => {
    dates = [
      { date: moment("2077-09-09 10:00"), link: "link", title: "title" },
      { date: moment("2077-09-09 9:00"), link: "link", title: "title" },
      { date: moment("2077-09-09 8:00"), link: "link", title: "title" },
    ];
    await comparer.init();
    const result = await comparer.dataToSend();
    expect(result.length).toEqual(0);
  });

  it("returs new date", async () => {
    dates = [
      { date: moment("2077-09-09 10:00"), link: "link", title: "title" },
      { date: moment("2077-09-09 9:00"), link: "link", title: "title" },
      { date: moment("2077-09-09 8:00"), link: "link", title: "title" },
    ];
    await comparer.init();
    dates = [
      { date: moment("2077-09-10 12:00"), link: "link", title: "title" },
      { date: moment("2077-09-09 12:00"), link: "link", title: "title" },
      { date: moment("2077-09-09 10:01"), link: "link", title: "title" },
      { date: moment("2077-09-09 10:00"), link: "link", title: "title" },
      { date: moment("2077-09-09 9:00"), link: "link", title: "title" },
      { date: moment("2077-09-09 8:00"), link: "link", title: "title" },
    ];
    const result = await comparer.dataToSend();
    expect(result.length).toEqual(3);
  });

  it("saves newest date correctly", async () => {
    dates = [
      { date: moment("2077-09-09 10:00"), link: "link", title: "title" },
      { date: moment("2077-09-09 9:00"), link: "link", title: "title" },
      { date: moment("2077-09-09 8:00"), link: "link", title: "title" },
    ];
    await comparer.init();
    dates = [
      { date: moment("2077-09-09 10:30"), link: "link", title: "title" },
      { date: moment("2077-09-09 10:00"), link: "link", title: "title" },
      { date: moment("2077-09-09 9:00"), link: "link", title: "title" },
      { date: moment("2077-09-09 8:00"), link: "link", title: "title" },
    ];
    let result = await comparer.dataToSend();
    expect(result.length).toEqual(1);

    result = await comparer.dataToSend();
    expect(result.length).toEqual(0);

    dates = [
      { date: moment("2077-09-09 10:50"), link: "link", title: "title" },
      { date: moment("2077-09-09 10:30"), link: "link", title: "title" },
      { date: moment("2077-09-09 10:00"), link: "link", title: "title" },
      { date: moment("2077-09-09 9:00"), link: "link", title: "title" },
      { date: moment("2077-09-09 8:00"), link: "link", title: "title" },
    ];

    result = await comparer.dataToSend();
    expect(result.length).toEqual(1);
  });
});
