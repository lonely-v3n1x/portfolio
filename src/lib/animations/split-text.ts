export function splitTextToChars(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent ?? "";
  el.textContent = "";

  const spans: HTMLSpanElement[] = [];

  for (const char of text) {
    const span = document.createElement("span");
    span.setAttribute("data-herochars", "");
    span.textContent = char === " " ? "\u00A0" : char;
    el.appendChild(span);
    spans.push(span);
  }

  return spans;
}
