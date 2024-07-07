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
export const parseIndexPage = async (url: string) => {
  const res = await axios.get(url);
  const root = parse(res.data);
  const data = [] as ResultData[];

  const nonPremiumOffers = root.querySelectorAll(
    'div[data-cy="ad-card-title"]',
  );

  nonPremiumOffers.forEach((offer) => {
    // Title and link
    const a = offer.querySelector("a");
    if (!a) return;
    const title = offer.querySelector("h6")?.innerText;
    let link: string | undefined;

    try {
      link = new URL(a.getAttribute("href") as string).toString();
    } catch {
      link = new URL(
        a.getAttribute("href") as string,
        "https://olx.pl",
      ).toString();
    }
    if (!link || !title) return;

    // Time
    const timeString = offer.parentNode
      ?.querySelector('p[data-testid="location-date"]')
      ?.innerText?.trim();

    if (!timeString) return;
    const date = getDateFromString(timeString);
    if (!date) return;

    data.push({ title, link, date });
  });

  return data;
};

const getDateFromString = (string: string) => {
  let date = moment();
  if (string.includes("Wczoraj")) {
    date = date.subtract(1, "days");
  } else if (!string.includes("Dzisiaj")) {
    return;
  }

  date.milliseconds(0);
  date.seconds(0);

  const regex = /(\d{2}:\d{2})/;
  const match = string.match(regex);
  const time = match ? match[1].split(":") : null;
  if (!time) return;
  date.hours(Number(time[0]));
  date.minutes(Number(time[1]));

  return date;
};

export const getSinglePageDescription = async (url: string) => {
  const res = await axios.get(url);
  const root = parse(res.data);
  const rawData = root
    .querySelectorAll("script")
    .find((s) => s.innerText.includes('"@type":"Product"'))?.innerText;
  if (!rawData) return;

  const data = JSON.parse(rawData);

  return data.description as string | undefined;
};
