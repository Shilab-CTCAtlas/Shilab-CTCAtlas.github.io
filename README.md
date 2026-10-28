# CTC Atlas — Shi Lab

Static research portal for the [Shilab-CTCAtlas GitHub organization](https://github.com/Shilab-CTCAtlas).

## Site structure

- `index.html` — portal homepage and overview
- `biology.html` — body-fluid sample atlas (blood, BALF, urine, pleural effusion, ascites)
- `data.html` — assay-neutral single-cell sequencing dataset catalog
- `gallery.html` — images of sequencing-validated cancer cells
- `publications.html` — papers, preprints, and citation links
- `lab.html` — research directions, team, news, and contact
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

English is the default interface language. Visitors can switch the entire site to Chinese from the header; their selection is remembered in the browser. For direct preview, append `?lang=zh` or `?lang=en` to a page URL.
