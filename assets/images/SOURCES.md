# Image sources and replacement guide

The homepage images use actual Shi Lab bronchoalveolar lavage, urine, and pleural effusion specimens provided by the user. The remaining external reference photographs illustrate the website layout; they are not Shi Lab specimens or sequencing-validated atlas records. Keep their captions and licenses while these reference images are in use.

## Replacement map

| Placement | Local file | Suggested replacement |
| --- | --- | --- |
| Homepage hero | `balf-papanicolaou-shilab.png` | Actual Shi Lab BALF specimen, Papanicolaou stain; responsive display crop |
| Homepage: liquid biopsy | `urine-wright-giemsa-shilab.png` | Actual Shi Lab urine specimen, Wright-Giemsa stain; displayed crop excludes the scale bar |
| Homepage: spatial omics | `pleural-effusion-wright-giemsa-shilab.png` | Actual Shi Lab pleural effusion specimen, Wright-Giemsa stain; responsive landscape crop |
| Lab introduction | `lab-cell-reference.jpg` | Laboratory's own cell image or approved lab photograph, landscape 3:2 |

You can replace each file independently while keeping its name. Use genuine browser-supported PNG, JPEG or WebP files with the correct extension, preferably at least 1280 px wide. Also update the corresponding HTML `alt`, caption, credit, license link, and `width`/`height` to match the new image. The research cards crop the image for layout (1.9:1 on desktop; 1.7:1 on small phones), so do not place essential labels or scale bars near an edge. If a scientific record must show the whole field, use an uncropped presentation instead. Refresh the browser with Ctrl+F5 after replacement.

## Spatial-omics research card: Shi Lab pleural effusion specimen

- File: `pleural-effusion-wright-giemsa-shilab.png`, supplied by the user on 2026-10-29.
- Specimen: Pleural effusion from combined small-cell lung cancer (cSCLC), as identified by the user. Stain: Wright-Giemsa, as identified by the user.
- Source / credit: Shi Lab; supplied for use on this website.
- Dimensions: 1779 × 1335 pixels. The PNG is an unchanged copy of the supplied image.
- Displayed in the same 1.9:1 desktop / 1.7:1 mobile frame as the preceding blood image. CSS uses proportional cover cropping at 50% 60%, without the preceding image's scale-bar zoom.
- Responsive lossless WebP variants have widths 640, 960, and 1779 px. The full-size version decodes to exactly the original RGB pixels; smaller versions are proportionally downsampled with Lanczos before lossless encoding. The original PNG remains the fallback.
- No cancer-cell identity or sequencing-validation status is inferred from this image.

## Previous research-card image: Shi Lab blood specimen

- File: `blood-wright-giemsa-shilab.png`, supplied by the user on 2026-10-29.
- Specimen: Blood. Stain: Wright-Giemsa, as identified by the user.
- Source / credit: Shi Lab; supplied for use on this website.
- Dimensions: 1608 × 1164 pixels. The PNG is an unchanged copy of the supplied image.
- CSS preserves image proportions within the research-card landscape frame, anchoring at the top and enlarging by 8% to exclude the original bottom-left scale bar. No image pixels are retouched.
- No cancer-cell identity or sequencing-validation status is inferred from this image.

## Homepage hero: Shi Lab BALF specimen

- File: `balf-papanicolaou-shilab.png`
- Original file: `c202500670.png`, supplied by the user on 2026-10-28.
- Specimen: Bronchoalveolar lavage fluid (BALF).
- Stain: Papanicolaou stain, as identified by the user.
- Source / credit: Shi Lab; supplied for use on this website.
- Web display variants: `balf-papanicolaou-shilab-960.webp`, `balf-papanicolaou-shilab-1400.webp`, and `balf-papanicolaou-shilab-1890.webp`. All use lossless WebP encoding; the 1890 px version decodes to exactly the same RGB pixels as the original PNG. Smaller variants are proportionally downsampled with Lanczos for responsive display, then encoded losslessly. The original PNG remains the fallback.
- Dimensions: 1890 × 1492 pixels. The PNG is an unchanged copy. Displayed as the homepage hero in a responsive frame with proportions preserved; CSS may crop the edges to fit the layout.
- No cancer-cell identity or sequencing-validation status is inferred from this image.

## Previous homepage reference / lab introduction

- File: `lung-adenocarcinoma-cytology.jpg`
- `lab-cell-reference.jpg` is an unchanged, separate copy used by the laboratory page, so it can be replaced independently.
- Title: Lung adenocarcinoma - Pap stain -- high mag
- Photographer: Librepath
- Source: https://commons.wikimedia.org/wiki/File:Lung_adenocarcinoma_-_Pap_stain_--_high_mag.jpg
- License: Creative Commons Attribution-ShareAlike 3.0, https://creativecommons.org/licenses/by-sa/3.0/
- Download: Wikimedia's 1280 × 853 thumbnail, downloaded 2026-09-30; photograph unchanged, scaled by CSS for display (some responsive sizes may crop the edges).
- This external reference micrograph is not a Shi Lab sample and has not been presented as sequencing-validated atlas data. It has been replaced on the homepage; attribution and the license remain on the lab page where the separate copy is still used. The image retains its CC BY-SA 3.0 license independently of the website code.

## Liquid-biopsy research card: Shi Lab urine specimen

- File: `urine-wright-giemsa-shilab.png`.
- Original file: `图片2.tif`, supplied by the user on 2026-10-28.
- Specimen: Urine. Stain: Wright-Giemsa, as identified by the user.
- Source / credit: Shi Lab; supplied for use on this website.
- Dimensions: 1280 × 659 pixels. Converted losslessly from TIFF to browser-supported PNG, without changing pixel values.
- At the user's request, the displayed image is cropped with CSS to exclude the bottom-left scale bar. The image fills the research-card frame, anchors at the top, and is enlarged by 8% within an overflow-hidden frame, removing at least the bottom 7.4% of the field at all responsive ratios. The original TIFF is unchanged.
- No cancer-cell identity or sequencing-validation status is inferred from this image.

## Previous liquid-biopsy reference

- File: `research-liquid-biopsy.jpg`
- Title: Lung adenocarcinoma - Diff-Quik -- high mag
- Photographer: Librepath
- Source: https://commons.wikimedia.org/wiki/File:Lung_adenocarcinoma_-_Diff-Quik_--_high_mag.jpg
- License: CC BY-SA 3.0, https://creativecommons.org/licenses/by-sa/3.0/
- Wikimedia thumbnail, 1280 × 853, downloaded 2026-09-30. The downloaded photograph is unchanged; CSS crops its display. The displayed crop is also licensed under CC BY-SA 3.0.

## Previous tumor-biology reference

- File: `research-tumor-biology.jpg`
- Title: Acinar pattern adenocarcinoma of lung -- high mag
- Photographer: Librepath
- Source: https://commons.wikimedia.org/wiki/File:Acinar_pattern_adenocarcinoma_of_lung_--_high_mag.jpg
- License: CC BY-SA 3.0, https://creativecommons.org/licenses/by-sa/3.0/
- Wikimedia thumbnail, 1280 × 853, downloaded 2026-09-30. The downloaded photograph is unchanged; CSS crops its display. The displayed crop is also licensed under CC BY-SA 3.0.

## Responsive WebP variants for the urine and blood research cards

- Originals `urine-wright-giemsa-shilab.png` and `blood-wright-giemsa-shilab.png` remain unchanged and are retained as PNG fallbacks.
- Each image has WebP versions at 640 px, 960 px, and its original width (1280 px for urine; 1608 px for blood). Filename suffixes identify the width.
- All WebP files use lossless encoding. Full-width versions decode to the exact original RGB pixels; smaller versions are proportionally downsampled with Lanczos, then encoded losslessly.
- The browser selects one variant according to viewport size and pixel density. Below-the-fold cards retain lazy loading and the existing CSS crop that excludes each scale bar.
