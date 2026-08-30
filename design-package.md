# The Bakekeep — Design Package

Tier 1, single journey. Written complete before any generation. Phase 8 consumes this.
Every line of copy here ships verbatim.

---

## 1. The brand premise

**The word is the name.**

A supermarket cake has no name on it. A factory cake has no name on it. A Bakekeep cake
always does: Dasuni, Dahamdi, Sandashi, Hiru, Lakshitha, Amma, Akka & Ayya, Nishi, Dilumi.
The whole site teaches and sells one idea: every cake that leaves this kitchen is made for
one person, by name. The crown in the logo does not sit on the cake. It sits on whoever the
day belongs to.

This premise does three jobs at once. It carries the warmth the owner asked for ("made by
hands that care"). It answers the single biggest buyer fear ("will it look like what I
asked for?") because the gallery is 38 pieces of evidence that it did. And it converts the
baked-in writing on the photos from a flaw into the argument.

Sections that do not serve the premise do not ship.

## 2. The palette as CSS tokens

Direction sampled from the logo (gold on black with oxblood) and the burgundy velvet the
photos are shot on. Exact values finalized from the approved footage after the video gate.

```css
:root{
  --canvas:#0E0906;         /* warm near-black, brown-tinted, never pure #000 */
  --canvas-2:#150D08;       /* the second ground for alternating sections */
  --panel:#1D120C;          /* cards and raised surfaces */
  --accent:#D9AA45;         /* the CTA and rare emphasis; the logo's gold */
  --accent-hover:#F2D78F;
  --accent-muted:rgba(217,170,69,.16);   /* borders, glows, dust particles */
  --wine:#5C0C18;           /* the velvet; environment depth, never text */
  --wine-light:#7E1524;
  --text-primary:#F6ECD8;   /* the brand cream */
  --text-secondary:#B5A385;
}
```

The accent appears in rare doses only: the CTA, focus rings, the crown mark, and two
moments of emphasis. Never as a section background.

## 3. The type trio

Deliberately not the black-and-gold luxury default (Cinzel), which is where this palette
drifts by habit.

- **Display: Fraunces**, weights 400 to 700 (variable, `opsz` 9..144). A high-contrast
  serif with a built-in softness and wonk, so it reads regal and handmade at once.
- **Body: Karla**, weights 300 to 500. Quiet humanist grotesque with real character.
- **Mono: Space Mono**, weight 400. Small labels, kickers, the step numbers, the names strip.

Loaded trimmed, with `preconnect`:
`Fraunces:opsz,wght@9..144,400..700` + `Karla:wght@300..500` + `Space+Mono:wght@400`

## 4. The band map

Hero height **560vh**, so scroll range is 460vh. This is above the 400vh Tier 1 default,
and deliberately: four beats at 400vh would give each an 63vh plateau, under the 80vh
readability floor. At 560vh every beat plateaus near 95vh. Deviation stated out loud.

Ramp per band: `f = Math.min(0.02, (b - a) / 3)`, so about 9vh of ease at each edge.

| Band | Range (starting point) | Footage moment | Copy (verbatim) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.24 | dark kitchen, the ganache ribbon begins to fall | "Every cake starts as nothing." | drift-down, echoing the fall; plus the one-time load ramp |
| 2 | 0.28 to 0.52 | the ribbon falls through the raking light, gold motes drifting | "Mixed, poured and finished by hand." | scatter, characters gathering like the dust |
| 3 | 0.56 to 0.76 | the pour lands, ganache floods across the top and over the edge | "Baked for your date. Never before it." | word-punch with overshoot, the impact landing |
| 4 | 0.80 to 1.00 | the glossy surface at rest, one gold highlight raking across | "Then it gets a name." + subline + CTA row | word-by-word rise into a staged settle |

Band 4 subline (verbatim): "Every cake that leaves this kitchen is made for one person."
Band 4 CTA (verbatim): "Order on WhatsApp" / secondary "See the cakes"

Layout: the action lane is the left 45 percent of frame (the pour and the cake). Every
band lives right of center, right-aligned, in the warm shadow the start frame reserves.
Band 4 converges to center over the full-bleed ending.

Validated later by the flick test. Ranges move if the test says so.

## 5. The static-hero copy block

For phones, portrait tablets and reduced motion, composed over the ending frame:

- Headline: "Every cake leaves with a name on it."
- Subline: "Homemade custom cakes, cupcakes, butter cakes and brownies. Baked in
  Divulapitiya for the day you need them."
- CTA: "Order on WhatsApp" / secondary "See the cakes"

## 6. The below-fold outline

Every section funnels to one anchor: `#order`, which composes a WhatsApp message.

**a. The names strip** (the signature element, first thing after the settle)
A slow marquee of the owner's regular customers, first names only, with the brand seal
between each. 22 names, supplied by the owner:
`Sandaru · Dasuni · Malsha · Thanushi · Dahamdi · Malith · Kavipriya · Sandashi · Sanju ·
Awanthi · Hiru · Samindi · Chapa · Lakshitha · Thubishan · Udani · Nishi · Nadeesha ·
Thilini · Dilumi · Maneka · Ayesha`
Kicker (mono, verbatim): "The names our hands know by heart"

Two decisions here, both at the owner's direction. The kicker moved off "REAL ORDERS, REAL
NAMES", which described the mechanic rather than meaning anything, onto a line about
regulars, which is the actual point: these are people who came back. "Our hands" carries
the piping without naming it, since hands knowing something by heart is what repetition
does, so the craft and the memory land in one image rather than two clauses. It also points
at the piping section directly below it. At 33 characters it holds one line down to 320px.
And Amma, Akka and Ayya were removed, because they are Sinhala family words rather than
names and they broke the logic of a list of individual people.

**b. What we bake** (four cards, all four with a real photo, equal treatment)
Kicker: "WHAT WE BAKE"
Headline: "Four things, done properly."
- "Custom Celebration Cakes" / "Birthdays, engagements, anniversaries and character themes. Designed from your idea or a photo you send."
- "Cupcakes" / "Matching sets for dessert tables, office treats and gifting. On their own or beside a cake."
- "Butter Cakes & Coconut Cakes" / "Coconut, ribbon, marble and chocolate. The homemade classics, soft and simple."
  (Renamed at the owner's request, because the coconut cake is a signature item and was
  hidden inside a generic category name. The gallery filter reads "Butter & Coconut Cakes"
  to fit the chip, and the order form option reads "Butter Cake or Coconut Cake", so the
  card's "Order this" link still pre-selects the right thing.)
- "Brownies & Treats" / "Fudge brownies, swiss rolls and chocolate slabs, by the box, for when a whole cake is too much."

**c. Put a name on it** (the one interactive moment)
Kicker: "TRY IT"
Headline: "Whose day is it?"
Lede: "Type a name. This is the part that happens last, by hand, on every single cake."
The visitor types a name. It writes itself onto a cake in piped buttercream script (an SVG
stroke drawing itself), and the crown settles above it. Completing it lights the CTA and
carries the typed name into the order form. Reduced motion gets the finished state at once.
Button under it: "Order this cake"

**d. The gallery**
Kicker: "THE GALLERY"
Headline: "Every one of these was somebody's day."
Lede: "Nothing here is a fixed menu. Use them as ideas, or send a photo of your own."
Filters: All / Custom Cakes / Cupcakes / Butter & Coconut Cakes / Brownies & Treats
All 36 photos ship, names and captions included. That is the point of them.

**The closing invitation**, which also solves the ragged last row of the grid. Verbatim:
Headline: "36 names fit on this page." (the number is injected from the gallery list at
runtime, so adding a cake keeps it true instead of leaving a stale figure on the page)
Body: "There are a lot more where these came from. A new cake leaves this kitchen most
weeks, and it goes up on Facebook and Instagram the same day."
Buttons: "See more on Facebook" / "See more on Instagram", both with their platform mark.
A hairline rule with a soft gold bloom at its centre draws outward on scroll above it.

The headline deliberately counts *names* rather than photos, so the section closes on the
site's premise instead of on a number. The reason to follow is a real one (a new cake most
weeks) rather than a bare request to go and look.

**d2. Pixel Eye by Aegon, the art studio** (added at the owner's request)

The owner also makes digital oil portraits, painted in Photoshop from a customer's own
photograph and printed onto a rigid mounted board. Started 2021, dormant, restarting now.
The question put to me was whether it belonged on this site or a separate one.

**It ships inside The Bakekeep, as one section after the gallery.** The purchase is the same
purchase: same customer, same occasion, same WhatsApp, same lead time, same 50 percent
advance. The art business also has no live audience, while the cake business has 22 regulars
and a following, so a separate site would have started from nothing. The owner's own invoice
template already read "The Bakekeep · Cakes & Custom Art Prints", so the decision was
half-made before the question was asked. Splitting it out later, with proven demand behind
it, stays open; splitting now would mean promoting two things from zero.

Branding: cakes are **The Bakekeep**, art is **Pixel Eye by Aegon**, confirmed by the owner.
The Pixel Eye mark is a black silhouette in both supplied files, so neither read on the dark
canvas. It was recoloured to the brand cream, trimmed to its content and shipped as a 14KB
WebP.

Framing, verbatim: "The cake is gone by Monday. This is not." The section is positioned as
what happens *after* the cake, not as a second business competing for attention. It keeps the
site's single call to action; the order form gains one option rather than a second form.

**The section's own ground is cooler and more neutral** than the rest of the page. Paintings
need a gallery wall, and the warm gold canvas fights their colour. It reads as a different
room in the same building, not a second website: same type, same accent, same rhythm.

The centrepiece is a **before and after wiped by scroll**, not dragged. The site's one
interactive moment is already the piping, and a drag slider would have been a second. Scroll
is also the language the hero already speaks. Pair 1 was chosen after testing four pairs for
alignment at the wipe line; it was the only one where the subject continues across the seam
almost perfectly.

Then: four steps, a size picker whose price follows the size (12x15 Rs 3,950, 12x18 Rs 4,900,
other sizes on request), the board explained plainly, and seven paintings.

**The board sells on doing both.** Verbatim: "It is a board, not a frame. The print is mounted
flat onto rigid ply, so there is no glass to break and nothing else to buy." Under it, two
cards side by side rather than one longer sentence, because standing *and* hanging is the
point and a clause tacked on the end reads as an afterthought: "Stand it up / A stand folds
out at the back, for a shelf, a desk or a table." and "Or hang it up / Light enough to go
straight on a wall, with no frame needed." Each carries a drawn mark. The hanging mark took
two attempts: the wire first landed on the board's rounded corners and the two shapes merged
into a blob, so the wire now meets the board inside its top edge.

**The paintings ride a carousel, not a grid** (owner's request, after seeing the grid). A grid
sized each piece too small to read as a painting. The carousel shows one large with its
neighbours peeking in at 84 and 72 percent scale and falling opacity, so depth does the
ordering. Drag with a mouse, swipe with a finger, arrows, dots, and the keyboard all drive the
same index; it wraps in both directions. Tapping the centre opens it full screen in the site's
existing lightbox; tapping a neighbour brings that one to the centre instead, which is the
behaviour people expect and costs nothing to support. Slides are 400px on desktop and 250px on
a phone (62vw), and the images ship at 800x1000 so they stay sharp at 2x.

Two bugs were found by testing and fixed. A drag is normally followed by a native click, which
the tap handler swallows so a swipe does not also open the lightbox; but a browser does not
always fire one after a long drag, and the stuck flag would have eaten the visitor's next real
tap. A zero-delay timer now clears it either way. And the dots were an 11px tap target, so the
dot moved to a pseudo-element and the button grew to 40px on touch without the dot changing
size.

**The resting order was set by the owner**, on a screenshot with the five visible positions
numbered by hand. Left to right at rest that reads 4 2 1 3 5: the red car, the studio portrait,
the garden portrait at centre, the birthday, the graduation. An eighth piece ("The birthday",
a portrait of a woman behind her lit birthday cake) arrived with it, which is the only one of
the five that was new. The carousel opens at index 0, so slots 2 and 4 are filled by the last
two entries in the array wrapping in from the left. Changing the array length moves those two,
so anything added later belongs in the middle, not at either end.

**Curation, and what was left out.** Nine real-customer pieces existed. Seven shipped, then
the owner's eighth was added.
Dropped: a cropped selfie that reads as a filter rather than a painting, and a flat
poster-style piece carrying a retired signature. One further piece was a photograph of a
printed board on a table, so it was cropped to the artwork itself.

**Five pieces were excluded outright**, and this is a hard line rather than a taste call:
portraits of Dwayne Johnson, Michael Jackson, Paul Walker, Ragnar from Vikings and Rashmika
Mandanna. The source images are professional photographs owned by others, and using a famous
face to advertise a paid service implies an endorsement that does not exist. Fine as practice;
not usable as marketing.

**On tooling and wording.** The owner works mainly in Photoshop, uses some AI assistance, and
asked that AI not be mentioned. The copy therefore describes the work truthfully without
raising the subject: "Three to five days of work in Photoshop, brushed in layer by layer from
your photograph." What it does not do is claim the opposite. No line says hand-painted only,
or no AI, because that would be an assertion rather than a description. The word AI appears
zero times on the page, and so does any claim that it was not used.

**d3. Both together** (added at the owner's request)

The bridge between the two halves of the business, sitting between them on the page. The
art section already plants the idea with "The cake is gone by Monday. This is not."; this
section is the payoff rather than a repeat of it.

Verbatim:
Kicker: "Better together"
Headline: "One gets eaten. One gets kept."
Lede: "For the days that deserve both. A milestone birthday, a graduation, an engagement, a
farewell, or Amma's day."
Line: "The cake carries the evening. The painting is still on the wall years later."
Chips: "One message" / "One date" / "One delivery"
Button: "Order both on WhatsApp"
Note: "Allow about a week when you want both, because the painting takes the longer of the two."

The headline does the explaining, so nothing below it has to. Naming the occasions matters
more than describing the offer: a visitor recognises their own event in that list or they
do not. The week's notice is stated plainly rather than buried, because a cake needs three
days and a painting three to five, and the longer one governs.

Visually it is the cake and a painting overlapping at opposing tilts with a gold ampersand
where they meet, which says "these two, together" faster than a sentence. Its ground borrows
warmth back from the cake side so it does not read as part of the art studio.

**No combined discount is claimed**, because none was given. If the owner wants one, it goes
here and nowhere else.

The order form gained a third shape rather than a second form. Cake only, painting only, or
both: flavour hides for a painting and returns for a combination, the size label becomes
"Cake size, and painting size", the notice line becomes the week, and the WhatsApp message
opens with the right sentence for each.

One bug was found here by measuring rather than looking. The two images carry width and
height attributes, and a browser applies those as a real height, which makes `aspect-ratio`
inert. Both rendered at their full 900 and 1000 pixel heights and drove straight through the
copy on tablet and phone. `height:auto` on the pair is what makes the aspect ratios apply.

**e. How it works**
Kicker: "HOW IT WORKS"
Headline: "Four steps, then it is booked."
1. "Send the details" / "Type, date, size, flavour, and your design idea. The form below writes the message for you."
2. "Get a price" / "A full quote comes back, priced by design, size and flavour. Nothing starts until you say yes."
3. "Pay half to hold the date" / "A 50 percent advance by bank transfer books your day. The rest is settled when you collect it."
4. "Collect or have it delivered" / "Free pickup in Divulapitiya. Delivery across the area, charged by distance."

**f. The real questions** (FAQ, in the buyers' own words, answering the researched objections)
Kicker: "THE REAL QUESTIONS"
Headline: "The things people ask before they order."
- Q: "Will it actually look like the photo I send?"
  A: "Usually very close, and where it cannot be, you will be told before you pay. Hand piping is not printing, so small things differ. If a design is beyond what a home kitchen can do, that gets said honestly instead of guessed at."
- Q: "Do I really have to pay before I see it?"
  A: "Half, and only to hold the date. Ingredients get bought and the day gets blocked off for you. The other half is paid when the cake is in your hands."
- Q: "How much is a cake?"
  A: "It depends on size, design and flavour, so every cake is quoted. Send the details and a full price comes back before anything is mixed."
- Q: "How early do I need to order?"
  A: "Three days at the very least. Detailed designs want a week, and dates around holidays go early."
- Q: "Do you deliver to me?"
  A: "Divulapitiya, Minuwangoda, Meerigama, Negombo, Ja-Ela and Gampaha. Delivery is charged by distance and the fee is in your quote."
- Q: "Will it be fresh?"
  A: "Nothing sits on a shelf here. Your cake is baked for your date, and only a few orders are taken at a time so that stays true."

**g. The order form** (the single call to action)
Kicker: "REQUEST A QUOTE"
Headline: "Tell us the cake you are imagining."
Lede: "Fill this in and press send. WhatsApp opens with your order already written out. Nothing is sent until you press send there."
Assurances: "No payment on this site" / "A quote comes back first" / "Your details go only to WhatsApp"
Fields: Your name* / Contact number* / Cake type* / Date you need it* (min 3 days) /
Servings or size* / Flavour* / Pickup or delivery* / Delivery town / Design idea, theme, wording*
Button: "Send my order on WhatsApp"
Success state: "Your message is ready. WhatsApp should be opening now. If it did not, tap here."
Handling: a WhatsApp deep link to +94 72 385 5550 with the order composed into the message.
Real leads land in the real inbox. Said plainly on the page.

**The date field is a custom calendar, not `<input type="date">`.** Three reasons the native
one had to go, all found in testing: browser calendar UI cannot be styled at all, so it
arrived as a white US-locale box in the middle of a black and gold form; it only opens from
its small icon in Chrome, not from the field; and it showed `mm/dd/yyyy`, which is the wrong
order for Sri Lanka. The replacement is a real month grid in the brand's tokens, opening on
a click anywhere in the field, week starting Monday, days before the three-day minimum faded
and unclickable, today marked with a small accent dot, previous-month disabled at the
earliest month, and a one-year ceiling. Full keyboard support (arrows, Page Up and Down,
Home and End, Enter, Escape). It flips above the field when the field sits low on screen and
nudges the page when neither side fits, then clamps sideways so the page can never scroll
across. The visible value is friendly ("Wed, 26 Aug 2026") and rides into the WhatsApp
message as-is; the ISO value is kept on a data attribute for the minimum-date check.

One real bug was fixed here on the way: the old minimum date used `toISOString()`, which
converts to UTC. Sri Lanka is UTC+5:30, so local midnight is 18:30 the previous day in UTC,
and the earliest bookable date was landing a day early. All dates are now built from local
`getFullYear`/`getMonth`/`getDate`.

**h. Contact and footer**
WhatsApp, call, Facebook /thebakekeep, Instagram @thebakekeep.
Pickup: Divulapitiya, address shared once the order is confirmed.
Footer: the crown mark, "The Bakekeep", "Where Every Celebration Gets Its Crown",
the six towns, and one honest line: "The opening film is a made image. Every cake
photograph on this page is a real Bakekeep order."

**Not shipping: testimonials.** There are no real reviews yet, and inventing them is out.
The gallery and the names strip carry the proof instead.

## 7. The vector layer plan

- **The brand seal.** The first build used a hand-drawn SVG crown. The owner asked for the
  real round Bakekeep logo instead, so the drawn crown is gone and the actual mark is used
  in all six places: favicon, header, marquee separator, section divider, the piping moment,
  and the footer. Prepared from `Brand Design/The Bakekeep Profile Image.png` by cropping to
  the measured ring (centre 625,630, radius 541) and masking to a circle with a soft 2.5px
  edge, so it sits on any surface with no black square behind it. Two files ship: a 96px PNG
  at 21KB for the favicon, the header and the marquee, and a **384px WebP at 35KB**, lazy
  loaded, for the divider, the piping moment and the footer.
  Format was decided by testing, not preference. Palette-quantised PNG was rejected at both
  288px and 512px: it puts a green and magenta fringe on the gold ring, because the ring is
  a smooth gradient and a palette cannot hold it. Unquantised PNG at 384px was clean but
  208KB. WebP at quality 92 is visually identical to that PNG at **a sixth of the weight**,
  and it also came in lighter than the 288px PNG it replaced, so the seal got both bigger
  and cheaper. All brand assets now total 60KB, down from 137KB.
- **The divider seal is the largest mark on the page**, at the owner's request, so a customer
  can actually read the wordmark inside it: `clamp(122px, 12.5vw, 178px)`, which is 178px on
  a desktop and 122px on a phone. At 178px a 2x screen needs 356 physical pixels and the
  asset holds 384, so it stays sharp. The row widened from 440px to 620px to match, because
  a 178px seal inside a 440px row left the gold rules as stubs.
- **The divider keeps its drawn craft.** The seal sits between two gold hairlines that
  scale out from it on scroll, so the section break is still an animated moment rather than
  a static image.
- The logo is illegible below about 34px, which is why the marquee separators are 42px
  rather than the 19px the drawn crown used.
- **The piped-name script**, an SVG path drawn with a round-cap stroke so it reads as
  buttercream leaving a piping nozzle.
- **Whisper particles**: gold dust in three depth tiers, 27 motes, drifting up through the
  fixed background layer. The owner liked the original six and asked for more, so rather
  than repeating one dot the tiers vary together, which is what separates dust from noise:
  far (2px, opacity .12 to .18, 70 to 94s), mid (3px, .18 to .25, 50 to 68s, slight blur),
  near (5px, .21 to .29, 34 to 48s, softer blur), each with its own sideways drift. Values
  are seeded so the scatter is identical on every load, delays are negative so every mote is
  mid-drift at first paint, and phones show every second one. Measured at 61fps, because it
  is transform and opacity only.
- **The alternating section bands are translucent**, not solid, so the dust drifts through
  the whole page instead of only the sections that happened to have no background. Body text
  on those bands measures 7.55:1, well past the 4.5 floor.
- **The fixed background environment**: one layer behind everything, a very slow warm
  radial glow drift plus fine grain in the footage's world, 70s cycle, so scrolling feels
  like moving through one warm room instead of past stacked sections.
- All of it honors reduced motion: final states shown, drives stopped.

## 8. The engineering list

The full standard from `references/scrub-pipeline.md`, named so the build cannot
half-remember it: the Blob fetch with the loading ring (streamed, with the 20s re-arming
watchdog), the dt-normalized lerp in a rAF loop that rests, gated seeks with the error-path
deadlock escape, delta-gated DOM writes, band pacing validated by the flick test, the
four-layer legibility system (global scrim, per-band scrim on `--k`, the three-layer text
shadow token, chips for small text), the five static-hero gates kept live with change
listeners on all five queries, complete-without-video, `overflow-x: clip` on both html and
body, reduced motion honored live in both directions, and the whole quality floor.

Plus the whole-site-animated standard: no two adjacent sections share a layout skeleton,
one living element per section at whisper level, entrances choreographed with retired
stagger delays, everything eased, transform and opacity only.

## 9. The copy gate line

Every viewer-facing line above ships verbatim. The built page must pass the Phase 9 grep
gate (zero em dashes, zero stock words: leverage, seamless, empower, unlock, robust,
actionable, data-driven, solutions) plus the body-copy sweep for AI tells, before anyone
sees it. The designed triplets here ("Mixed, poured and finished by hand.", "Baked for your
date. Never before it.") are deliberate brand devices and stay.

---

## Appendix: the generation prompts, written before spending

**Start frame** (image, 16:9, 2k, about 2 credits):

> A bare unfrosted round chocolate cake resting on a worn wooden board in the lower left of
> the frame, composed as the first moment of a motion in which a thick ribbon of dark
> chocolate ganache will fall from above and flood its surface. A single warm tungsten light
> rakes in from the upper left, low and golden, catching flour dust and fine gold motes
> suspended in the air. The kitchen recedes to the right into soft warm brown shadow, a deep
> burgundy cloth draped over the counter edge and falling out of focus, with a faint amber
> glow deep in the background, so the whole frame reads as one continuous warm room from
> edge to edge. Colours: dark roasted chocolate brown, warm near-black, polished gold light,
> deep wine red cloth, pale cream crumb. The right side of the frame is quiet unbroken warm
> shadow and haze, with no objects, no utensils and no bright highlights anywhere in it.
> Shot on a 50mm lens, shallow depth of field, cinematic, photorealistic, 16:9.
> No text, no logos, no lettering anywhere.

**Video** (image-to-video, 16:9, silent):

> One continuous shot, no cuts. A thick ribbon of dark chocolate ganache pours from above and
> falls straight down onto the bare cake below, flooding across its top and spilling in slow
> heavy folds down its sides, while the camera descends with the falling ganache in one smooth
> continuous move. The ganache stays alive throughout: the ribbon twists and wavers as it
> falls, the surface ripples and settles, small folds roll over the edge. The scene stays
> alive: flour dust and fine gold motes drift through the raking warm light, the burgundy
> cloth breathes, and the amber glow behind shifts slowly. The shot ends at rest: the camera
> has come down close to the finished cake so the glossy dark ganache surface fills the frame
> edge to edge, still and mirror smooth, one warm gold highlight raking slowly across it, the
> last ripple settling into stillness. No text or lettering anywhere.

The ending is deliberately full-bleed texture rather than a composed product shot. Law 4's
crop trap (a product with its top cut off on a short screen) cannot happen to a surface that
fills the frame, and it gives band 4 a clean, calm ground to rest its headline and CTA on.
