const ITEMS = [
  "GSAP",
  "React",
  "Next.js",
  "Three.js",
  "ScrollTrigger",
  "Accra / GH",
  "Open to work",
] as const;

export default function Ticker() {
  return (
    <div className="ticker">
      <span className="ticker__sr">{ITEMS.join(", ")}</span>

      <div className="ticker__track" aria-hidden="true">
        {[0, 1].map((copy) =>
          ITEMS.map((item) => (
            <span className="ticker__item" key={`${copy}-${item}`}>
              {item}
              <span className="ticker__star">✳</span>
            </span>
          )),
        )}
      </div>
    </div>
  );
}