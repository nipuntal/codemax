# codemax

Practice questions for COMP2041 and COMP3311: a Mail-style browser with the
question on the left and an editor on the right. Static site; no backend.

```
npm run dev       # compile content/ to public/c, then start Vite
npm run build     # same, then type-check and build to dist/
```

- `content/` is the source of truth: one folder per question (README, starter,
  data files, tests, solution). It was created once by `scripts/import.mjs`
  from the original course folders.
- `scripts/build-content.mjs` renders the markdown at build time and writes
  `public/c/index.json` plus one JSON per question (`.sol.json` for solutions,
  fetched only when revealed).
- URLs: `/2041/day1/shell/1`, `/2041/day3/24`, `/3311/day2/17`.
