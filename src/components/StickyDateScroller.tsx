
import dayjs from "dayjs";

function formatDay(date: Date | string) {
  return dayjs(date).format('dddd');
}

function formatDateLine(date: Date | string) {
  return dayjs(date).format('YYYY-MM-DD');
}

interface StickyDateScrollerProps {
  dates?: (string | Date)[];
}

export default function StickyDateScroller({ dates }: StickyDateScrollerProps) {
  // If no dates provided, build a sample 14-day range centered on 2025-12-02
  const seed = dates && dates.length ? dates.map(d => new Date(d)) : (() => {
    const center = new Date("2025-12-02T00:00:00");
    const arr = [];
    for (let i = -6; i <= 7; i++) {
      const nd = new Date(center);
      nd.setDate(center.getDate() + i);
      arr.push(nd);
    }
    return arr;
  })();

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-gray-300">
        <div
          className="inline-flex items-stretch gap-3 p-3 snap-x snap-mandatory"
          role="list"
          aria-label="Date picker scroller"
        >
          {seed.map((dt, idx) => {
            const day = formatDay(dt);
            const dateLine = formatDateLine(dt);
            return (
              <button
                key={idx}
                role="listitem"
                aria-label={`${day} ${dateLine}`}
                className="snap-start shrink-0 w-36 md:w-44 lg:w-48 p-3 rounded-2xl flex flex-col items-center gap-1 text-center shadow-sm hover:shadow-md focus:shadow-lg transition-shadow outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
              >
                <div className="text-lg font-semibold text-gray-900 text-center">{day}</div>
                <div className="mt-2 text-xs text-gray-500 text-center">Date: {dateLine}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/*
Usage examples:

1) Default (uses sample dates around 2025-12-02):

<StickyDateScroller />

2) Provide your own dates array (ISO strings or Date-parsable strings):

const myDates = [
  '2025-11-30',
  '2025-12-01',
  '2025-12-02',
  '2025-12-03',
];

<StickyDateScroller dates={myDates} />

Notes:
- This component expects Tailwind CSS to be available in your project.
- The native scrollbar is kept (so users can see and drag it). If you want a custom scrollbar UI,
  add left/right arrow buttons and use scrollBy/scrollTo programmatically.
*/
