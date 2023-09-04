// 쿠키 가져오기
export function getCookie(cookieName: string) {
  let cookie;
  if (typeof document !== "undefined") {
    cookie = document.cookie;
  }
  cookieName = `${cookieName}=`;
  let cookieData = cookie;

  if (cookieData === undefined) return;
  let cookieValue = "";
  let start = cookieData.indexOf(cookieName);

  if (start !== -1) {
    start += cookieName.length;
    let end = cookieData.indexOf(";", start);
    if (end === -1) end = cookieData.length;
    cookieValue = cookieData.substring(start, end);
  }

  return unescape(cookieValue);
}

function ssrDarkModeFn() {
  console.log(12);

  const html: any = document.getElementById("HTML");
  console.log(html);
  let cookieName = "darkMode=";
  let cookieData = document.cookie;
  let cookieValue = "";
  let start = cookieData.indexOf(cookieName);

  if (start !== -1) {
    console.log(1);
    start += cookieName.length;
    let end = cookieData.indexOf(";", start);
    if (end === -1) end = cookieData.length;
    cookieValue = cookieData.substring(start, end);
  }

  let result = unescape(cookieValue);
  if (result === "true") {
    console.log(result);
    html.classList.add("dark");
  } else {
    // html.element.classList.add("");
  }
}

export { ssrDarkModeFn };
