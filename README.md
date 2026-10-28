# CTC Atlas — Shi Lab

Static research portal for the [Shilab-CTCAtlas GitHub organization](https://github.com/Shilab-CTCAtlas).

## Site structure

- `index.html` — homepage with research and resource summaries
- `research.html` — research directions and methodological background
- `atlas.html` — CTC Atlas overview and entry points for samples, data, and images
- `biology.html` — body-fluid sample atlas (blood, BALF, urine, pleural effusion, ascites)
- `data.html` — assay-neutral single-cell sequencing dataset catalog
- `gallery.html` — images of sequencing-validated cancer cells
- `publications.html` — papers, preprints, and citation links
- `lab.html` — laboratory introduction and links to research and resources
- `styles.css` / `script.js` — shared visual system and interactions

## Preview locally

Open `index.html` directly in a browser, or run a local static server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a public repository named `Shilab-CTCAtlas.github.io` under the `Shilab-CTCAtlas` organization.
2. Push these files to the repository's `main` branch.
3. In **Settings → Pages**, select **Deploy from a branch**, then choose `main` and `/ (root)`.
4. The site will be available at `https://shilab-ctcatlas.github.io/`.

## Content needed before publishing

- Official laboratory name, institution, introduction, and contact address
- Research directions and approved wording
- Member names, roles, biographies, links, and approved portraits
- Single-cell sequencing study metadata and data-access rules
- Cancer-cell images linked to cell IDs, sequencing evidence, scale, and specimen metadata
- Publications with DOI/PubMed links and relationships to datasets or code

The current pages intentionally use “In preparation” states instead of invented lab details or research records.

The first verified research record is the 2025 *Advanced Science* BALF study (DOI `10.1002/advs.202416921`, accession `HRA008613`). It is presented as one dataset within the broader portal, not as a template that constrains other specimen types or sequencing assays.

## Language

The site is available in English only.

## Images

The homepage hero, two research cards, and lab introduction use reference cytology / histology photographs by Librepath, licensed under CC BY-SA 3.0. They are labeled as reference images, not Shi Lab specimens or sequencing-validated atlas records. All four image slots have separate files in `assets/images/` for easy replacement. See the [image credits and replacement guide](assets/images/SOURCES.md) for file names, sources, licenses, and caption updates. Image-gallery records must remain linked to their own sequencing evidence.

## Design

The September 2026 redesign puts Shi Lab's research first and organizes CTC Atlas as a dedicated resource page. Typography, navigation, and spacing are shared across all eight pages. The selected academic design A uses white backgrounds, navy typography, restrained blue accents, and credited microscopy photographs; no paper-figure collages or decorative cell illustrations are used. See [design references](design-references.md).

The homepage provides a summary of each research direction. Main navigation links open separate pages; detailed research content lives in `research.html`, and `atlas.html` groups the three atlas subpages. Specimen types are grouped with CTC Atlas, where the available BALF dataset and the cell-image collection's preparation status are shown explicitly. Publications and laboratory background have compact links to their dedicated pages.

## Browser checks

With the preview server running, run:

```bash
node tools/audit-site.cjs
```

Requires Node 22+ and Microsoft Edge. Set `SHILAB_BROWSER` to use another Chromium executable, or `SHILAB_PREVIEW_URL` for another local server address. The checks cover eight pages at 320, 390, 768, 1024, 1440, 1920, 2048, and 2560 pixels, shared content alignment, responsive dividers, navigation, dataset filters, publication formatting, and local links. Preview screenshots are ignored by Git.

The motion checks inspect real animation progress for entrance effects, once-only scroll reveals, hover feedback, mobile menu opening/closing, and dataset-filter height/fade transitions. They also check rapid filter clicks, reduced-motion preferences, the no-JavaScript fallback, and native cross-page transitions when supported.
