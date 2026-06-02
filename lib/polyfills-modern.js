// Slim replacement for Next.js's `polyfill-module.js`.
//
// Next.js injects polyfill-module.js into EVERY client entrypoint regardless of
// the project's browserslist. For our target (chrome >= 107, edge >= 107,
// firefox >= 107, safari >= 16) the following are already native no-ops and
// only add dead weight (~11 KiB of "legacy JavaScript" flagged by PageSpeed):
//
//   String.prototype.trimStart / trimEnd  (Chrome 66, Safari 12)
//   Symbol.prototype.description          (Chrome 70, Safari 12.1)
//   Array.prototype.flat / flatMap        (Chrome 69, Safari 12)
//   Promise.prototype.finally             (Chrome 63, Safari 11.1)
//   Object.fromEntries                    (Chrome 73, Safari 12.1)
//   Array.prototype.at                    (Chrome 92, Safari 15.4)
//   Object.hasOwn                         (Chrome 93, Safari 15.4)
//
// Only `URL.canParse` lands AFTER our baseline (Chrome 120 / Safari 17), so it
// is the single polyfill we keep to stay safe for Chrome 107-119 & Safari 16.
"canParse" in URL ||
  (URL.canParse = function (t, r) {
    try {
      return !!new URL(t, r);
    } catch (e) {
      return false;
    }
  });
