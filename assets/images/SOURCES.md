# Image sources and replacement guide

The homepage hero and liquid-biopsy research card use actual Shi Lab bronchoalveolar lavage and urine specimens provided by the user. The remaining external reference photographs illustrate the website layout; they are not Shi Lab specimens or sequencing-validated atlas records. Keep their captions and licenses while these reference images are in use.

## Replacement map

| Placement | Local file | Suggested replacement |
| --- | --- | --- |
| Homepage hero | `balf-papanicolaou-shilab.png` | Actual Shi Lab BALF specimen, Papanicolaou stain; displayed in a landscape 3:2 crop |
| Homepage: liquid biopsy | `urine-wright-giemsa-shilab.png` | Actual Shi Lab urine specimen, Wright-Giemsa stain; displayed crop excludes the scale bar |
| Homepage: tumor biology | `research-tumor-biology.jpg` | Cells / tissue image, landscape, subject near the centre |
| Lab introduction | `lab-cell-reference.jpg` | Laboratory's own cell image or approved lab photograph, landscape 3:2 |

You can replace each file independently while keeping its name. Use genuine browser-supported PNG, JPEG or WebP files with the correct extension, preferably at least 1280 px wide. Also update the corresponding HTML `alt`, caption, credit, license link, and `width`/`height` to match the new image. The research cards crop the image for layout (2.2:1 on desktop; 1.7:1 on small phones), so do not place essential labels or scale bars near an edge. If a scientific record must show the whole field, use an uncropped presentation instead. Refresh the browser with Ctrl+F5 after replacement.

## Homepage hero: Shi Lab BALF specimen

- File: `balf-papanicolaou-shilab.png`
- Original file: `c202500670.png`, supplied by the user on 2026-10-28.
- Specimen: Bronchoalveolar lavage fluid (BALF).
- Stain: Papanicolaou stain, as identified by the user.
- Source / credit: Shi Lab; supplied for use on this website.
- Dimensions: 1890 × 1492 pixels. The PNG is an unchanged copy. At the user's request, CSS presents a 3:2 landscape crop, trimming the top and bottom while retaining the central cells; object-position is 50% 55%. The tablet height limit may crop a little further.
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

## Tumor-biology research card

- File: `research-tumor-biology.jpg`
- Title: Acinar pattern adenocarcinoma of lung -- high mag
- Photographer: Librepath
- Source: https://commons.wikimedia.org/wiki/File:Acinar_pattern_adenocarcinoma_of_lung_--_high_mag.jpg
- License: CC BY-SA 3.0, https://creativecommons.org/licenses/by-sa/3.0/
- Wikimedia thumbnail, 1280 × 853, downloaded 2026-09-30. The downloaded photograph is unchanged; CSS crops its display. The displayed crop is also licensed under CC BY-SA 3.0.
