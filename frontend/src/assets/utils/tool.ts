export const $ = (el: string) => document.querySelector(el);

export const generateParamSyntax = (data: string | object) =>
  "?" +
  (typeof data === "string"
    ? "server=" + data || "1"
    : Object.entries(data)
        .map(([key, value]) => key + "=" + value)
        .join("&"));
