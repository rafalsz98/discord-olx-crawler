import { Moment } from "moment";

import { parseIndexPage, ResultData } from "./olx";

let newestDate: Moment | null;

export const init = async () => {
  const data = await parseIndexPage(process.env.URL as string);
  if (data === undefined || data.length === 0) throw "Init error";
  newestDate = data[0].date;
};

export const dataToSend = async () => {
  const data = await parseIndexPage(process.env.URL as string);
  if (data === undefined) return [];

  const results = [] as ResultData[];
  data.forEach((record) => {
    if (record.date.diff(newestDate) > 0) {
      results.push(record);
    }
  });

  if (results.length !== 0) {
    newestDate = results[0].date;
  }

  return results;
};
