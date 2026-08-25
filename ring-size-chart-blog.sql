-- Ring Size Chart Blog — run in Supabase SQL Editor
-- Deletes existing slug if you re-run
DELETE FROM blog_posts WHERE slug = 'ring-size-chart-complete-guide';

INSERT INTO blog_posts (title, slug, excerpt, body, cover_image, author_name, tags, is_published, published_at)
VALUES (
  'The Ultimate Ring Size Chart & Guide — Find Your Perfect Fit',
  'ring-size-chart-complete-guide',
  'Complete ring size chart converting US, UK, EU, France, Germany, Japan & Italy with circumference in inches & mm — plus how to measure at home and get a free Luxury Jeweleris sizer.',
  '# The Ultimate Ring Size Chart & Guide — Find Your Perfect Fit

A ring size chart is a tool used to determine the numerical size that best fits your finger. In this **Luxury Jeweleris** guide, we''ll show you how to use a ring size chart, convert between international systems, and measure accurately at home.

> All Luxury Jeweleris rings are crafted in **standard US sizes** (3 to 13, in quarter-size increments). Engagement rings, wedding bands, and fashion rings for men and women all follow the same size format.

---

## What Is a Ring Size?

Ring size corresponds to the **inner circumference** of a ring. A well-fitting ring should slide over the knuckle with slight resistance and sit securely at the base of the finger — snug but never tight.

---

## Ring Size Conversion Chart

Below is the complete conversion between **inside circumference (inches & mm)** and international size systems.

| Circ. (in) | Circ. (mm) | US / CA / MX | UK / AU / NZ / ZA | France | Germany / RU / Asia | Japan / India / SG | Italy / ES / CH |
|---|---|---|---|---|---|---|---|
| 1.74 | 44.2 | 3 | F | 44 | 14 | 4 | 4 |
| 1.77 | 44.8 | 3.25 | F 1/2 | 45 | 14 1/4 | — | 4 5/8 |
| 1.79 | 45.5 | 3.5 | G | 45.5 | 14 1/2 | 5 | 5 1/4 |
| 1.82 | 46.1 | 3.75 | G 1/2 | 46 | 14 3/4 | 6 | 5 7/8 |
| 1.84 | 46.8 | 4 | H | 47 | 15 | 7 | 6 1/2 |
| 1.87 | 47.4 | 4.25 | H 1/2 | 47.5 | — | — | 7 1/8 |
| 1.89 | 48.0 | 4.5 | I | 48 | 15 1/4 | 8 | 7 3/4 |
| 1.92 | 48.7 | 4.75 | J | 48.5 | 15 1/2 | — | 8 3/8 |
| 1.94 | 49.3 | 5 | J 1/2 | 49 | 15 3/4 | 9 | 9 |
| 1.97 | 50.0 | 5.25 | K | 50 | 16 | — | 9 5/8 |
| 1.99 | 50.6 | 5.5 | K 1/2 | 50.5 | 16 1/4 | 10 | 10 1/4 |
| 2.02 | 51.2 | 5.75 | L | 51 | — | 11 | 10 7/8 |
| 2.04 | 51.9 | 6 | L 1/2 | 52 | 16 1/2 | 12 | 11 1/2 |
| 2.07 | 52.5 | 6.25 | M | 52.5 | 16 3/4 | — | 12 1/8 |
| 2.09 | 53.1 | 6.5 | M 1/2 | 53 | 17 | 13 | 12 3/4 |
| 2.12 | 53.8 | 6.75 | N | 54 | — | — | 13 3/8 |
| 2.14 | 54.4 | 7 | N 1/2 | 54.5 | 17 1/4 | 14 | 14 |
| 2.17 | 55.1 | 7.25 | O | 55 | 17 1/2 | — | 14 5/8 |
| 2.19 | 55.7 | 7.5 | O 1/2 | 56 | 17 3/4 | 15 | 15 1/4 |
| 2.22 | 56.3 | 7.75 | P | 56.5 | 18 | — | 15 7/8 |
| 2.24 | 57.0 | 8 | P 1/2 | 57 | — | 16 | 16 1/2 |
| 2.27 | 57.6 | 8.25 | Q | 58 | 18 1/4 | — | 17 1/8 |
| 2.29 | 58.3 | 8.5 | Q 1/2 | 58.5 | 18 1/2 | 17 | 17 3/4 |
| 2.32 | 58.9 | 8.75 | R | 59 | 18 3/4 | — | 18 3/8 |
| 2.34 | 59.5 | 9 | R 1/2 | 60 | 19 | 18 | 19 |
| 2.37 | 60.2 | 9.25 | S | 60.5 | 19 1/4 | — | 19 5/8 |
| 2.39 | 60.8 | 9.5 | S 1/2 | 61 | 19 1/2 | 19 | 20 1/4 |
| 2.42 | 61.4 | 9.75 | T | 61.5 | — | — | 20 7/8 |
| 2.44 | 62.1 | 10 | T 1/2 | 62 | 19 3/4 | 20 | 21 1/2 |
| 2.47 | 62.7 | 10.25 | U | 63 | 20 | 21 | 22 1/8 |
| 2.49 | 63.4 | 10.5 | U 1/2 | 63.5 | — | 22 | 22 3/4 |
| 2.52 | 64.0 | 10.75 | V | 64 | 20 1/2 | — | 23 3/8 |
| 2.54 | 64.6 | 11 | V 1/2 | 65 | 20 3/4 | 23 | 24 |
| 2.57 | 65.3 | 11.25 | W | 65.5 | — | — | 24 5/8 |
| 2.59 | 65.9 | 11.5 | W 1/2 | 66 | 21 | 24 | 25 1/4 |
| 2.62 | 66.6 | 11.75 | X | 67 | 21 1/4 | — | 25 7/8 |
| 2.65 | 67.2 | 12 | X 1/2 | 67.5 | 21 1/2 | 25 | 26 1/2 |
| 2.68 | 68.1 | 12.25 | Y | 68 | — | — | 27 1/8 |
| 2.71 | 68.5 | 12.5 | Z | 69 | 21 3/4 | 26 | 27 3/4 |
| 2.72 | 69.1 | 12.75 | Z 1/2 | 69.5 | — | — | 28 3/8 |
| 2.75 | 69.7 | 13 | — | 70 | 22 | 27 | 29 |

> Tip: Swipe on mobile to see all columns. For half and quarter sizes, interpolate between rows.

---

## How to Measure at Home

- **Tape/paper method:** Wrap flexible tape around finger base, mark overlap, measure mm, match to chart.
- **Existing ring:** Place over printed circles at 100% scale.
- **Free sizer:** Request Luxury Jeweleris reusable sizer — most accurate.

**Tips:** Measure in evening, measure 2–3 times, size up if between sizes or for wide bands.

---

## FAQ

### What size is my ring?

Match inner circumference or use printed guide circle.

### Do Luxury Jeweleris rings run true to size?

Yes — standard US sizing. Order your US size directly.

*Source data adapted from Brilliant Earth Ring Size Chart (brilliantearth.com), reformatted for Luxury Jeweleris.*',
  'https://cdn.builder.io/api/v1/image/assets%2F9f2a69003c86470ea05deb9ecb9887be%2F306a7352420b4f3f9655e333f465ca59',
  'Luxury Jeweleris',
  ARRAY['Ring Size','Size Chart','Buying Guide','Education'],
  true,
  NOW()
);
