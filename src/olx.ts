import axios from "axios";
import moment, { Moment } from "moment";
import { parse } from "node-html-parser";

export type ResultData = {
  date: Moment;
  title: string;
  link: string;
};

/*
  Returns list of offers
*/
export const parsePage = async (url: string) => {
  const res = await axios.get(url);
  const root = parse(res.data);
  const data = [] as ResultData[];

  const nonPremiumOffers = root
    .querySelector("#offers_table")
    ?.querySelectorAll(".offer");
  if (nonPremiumOffers === undefined) return;

  nonPremiumOffers.forEach((offer) => {
    // Title and link
    const a = offer.querySelector(".title-cell")?.querySelector("a");
    if (!a) return;
    const title = a.innerText.trim();
    const link = a.getAttribute("href");
    if (!link) return;

    // Time
    const timeString = offer
      .getElementsByTagName("small")[2]
      .textContent.trim();
    const date = getDateFromString(timeString);
    if (!date) return;

    data.push({ title, link, date });
  });

  return data;
};

const getDateFromString = (string: string) => {
  let date = moment();
  if (string.includes("wczoraj")) {
    date = date.subtract(1, "days");
  } else if (!string.includes("dzisiaj")) {
    return;
  }

  date.milliseconds(0);
  date.seconds(0);

  const time = string.split(" ")[1].split(":");
  date.hours(Number(time[0]));
  date.minutes(Number(time[1]));

  return date;
};
