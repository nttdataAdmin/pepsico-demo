"""
FL-5883 JOB AID layout (columns match the printed form). Printed text = Arial;
only marks are hand-drawn (wobbly ink).
"""
from __future__ import annotations

import random
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    raise SystemExit("Install Pillow: pip install pillow")

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "public" / "mock-forms"

W, H = 920, 1680
BLACK = (20, 20, 20)
INK = (18, 30, 85)
INK_RED = (165, 0, 28)
FRITO_RED = (224, 26, 51)
WHITE = (255, 255, 255)
PAPER = (252, 251, 248)
GRID = (40, 40, 40)

# Column centers (ticks)
C_NA, C_GO, C_NGO = 448, 532, 618
C_YES, C_NO = 532, 618
C_G2, C_RTA, C_RA = 500, 582, 664

ROW_H1 = 36
ROW_H2 = 48
X_LABEL = 24
X_SPLIT = 400


def _fonts():
    try:
        a = "arial.ttf"
        return (
            ImageFont.truetype(a, 20),
            ImageFont.truetype(a, 14),
            ImageFont.truetype(a, 11),
            ImageFont.truetype(a, 9),
        )
    except OSError:
        d = ImageFont.load_default()
        return d, d, d, d


def _wobble_line(draw, p0, p1, fill, width, rng, segments=6):
    x0, y0 = p0
    x1, y1 = p1
    prev = (x0, y0)
    for i in range(1, segments + 1):
        t = i / segments
        x = x0 + (x1 - x0) * t + rng.randint(-1, 1)
        y = y0 + (y1 - y0) * t + rng.randint(-1, 1)
        cur = (x, y)
        draw.line([prev, cur], fill=fill, width=width)
        prev = cur


def _hand_check(draw, cx, cy, rng, color=INK, w=3):
    _wobble_line(draw, (cx - 11, cy), (cx - 3, cy + 10), color, w, rng)
    _wobble_line(draw, (cx - 3, cy + 10), (cx + 20, cy - 13), color, w, rng)


def _hand_x(draw, cx, cy, rng, color=INK_RED, w=3):
    _wobble_line(draw, (cx - 9, cy - 11), (cx + 11, cy + 11), color, w, rng)
    _wobble_line(draw, (cx - 9, cy + 11), (cx + 11, cy - 11), color, w, rng)


def _mark(draw, col, cy, rng):
    """col: NA|GO|NGO|YES|NO|G2|RTA|RA"""
    if col == "NA":
        _hand_check(draw, C_NA, cy, rng, INK)
    elif col == "GO":
        _hand_check(draw, C_GO, cy, rng, INK)
    elif col == "NGO":
        _hand_x(draw, C_NGO, cy, rng, INK_RED)
    elif col == "YES":
        _hand_check(draw, C_YES, cy, rng, INK)
    elif col == "NO":
        _hand_x(draw, C_NO, cy, rng, INK_RED)
    elif col == "G2":
        _hand_check(draw, C_G2, cy, rng, INK)
    elif col == "RTA":
        _hand_check(draw, C_RTA, cy, rng, INK_RED)
    elif col == "RA":
        _hand_x(draw, C_RA, cy, rng, INK_RED)


def _shell(d, fonts):
    ftitle, fsub, fbody, fx = fonts
    d.rectangle((8, 8, W - 8, H - 8), outline=GRID, width=3)
    d.rectangle((16, 16, 200, 54), fill=FRITO_RED)
    d.text((26, 26), "FRITO-LAY", fill=WHITE, font=fsub)
    d.text(
        (210, 16),
        "JOB AID for PACKAGE QUALITY & REGULATORY CERTIFICATION / WEAKLINK",
        fill=BLACK,
        font=ftitle,
    )
    d.text(
        (210, 42),
        "Protective measure vs mixed product/allergens; verifies weaklink attributes meet standards.",
        fill=(55, 55, 55),
        font=fx,
    )
    d.text((210, 58), "PLACE THIS STICKER ON PACKAGE ALONG WITH CASE LABEL AND FILE", fill=(70, 70, 70), font=fx)
    d.text((W - 210, 58), "FL-5883 (Rev. 1/2017)", fill=BLACK, font=fbody)

    d.rectangle((16, 84, W - 16, 138), outline=GRID, width=2)
    d.text(
        (22, 94),
        "OBJECTIVE: VERIFY THE CORRECT PRODUCT IS IN THE CORRECT PACKAGE AND BAG CODING/CASE CODING INFORMATION IS ACCURATE.",
        fill=BLACK,
        font=fx,
    )

    cx, cy = W - 268, 92
    for lab in ("START-UP", "SHIFT CHANGE", "CHANGE OVER", "BAG SIZE ONLY"):
        d.rectangle((cx, cy, cx + 11, cy + 11), outline=GRID, width=1)
        d.text((cx + 16, cy - 1), lab, fill=BLACK, font=fx)
        cy += 15

    y0 = 148
    d.rectangle((16, y0, W - 16, y0 + 112), outline=GRID, width=2)
    d.line((16, y0 + 36, W - 16, y0 + 36), fill=GRID, width=1)
    d.line((16, y0 + 74, W - 16, y0 + 74), fill=GRID, width=1)
    for xv in (180, 280, 380, 520, 640):
        d.line((xv, y0, xv, y0 + 74), fill=GRID, width=1)
    d.line((718, y0, 718, y0 + 112), fill=GRID, width=1)

    d.text((22, y0 + 8), "DATE", fill=BLACK, font=fx)
    d.text((186, y0 + 8), "SHIFT", fill=BLACK, font=fx)
    d.text((286, y0 + 8), "TIME", fill=BLACK, font=fx)
    d.text((386, y0 + 8), "MACHINE NO.", fill=BLACK, font=fx)
    d.text((526, y0 + 8), "NITROGEN FLUSH % OXYGEN", fill=BLACK, font=fx)

    d.text((22, y0 + 46), "PRODUCT", fill=BLACK, font=fx)
    d.text((186, y0 + 46), "FLAVOR", fill=BLACK, font=fx)
    d.text((286, y0 + 46), "WT. oz. / gm. (circle one)", fill=BLACK, font=fx)
    d.text((386, y0 + 46), "AIR FILL LEVEL (1)", fill=BLACK, font=fx)
    d.text((526, y0 + 46), "AIR FILL LEVEL (2)", fill=BLACK, font=fx)
    d.text((386, y0 + 60), "GO    NO-GO", fill=(95, 95, 95), font=fx)
    d.text((526, y0 + 60), "GO    NO-GO", fill=(95, 95, 95), font=fx)

    d.text((726, y0 + 8), "ALLERGEN MATRIX", fill=BLACK, font=fx)
    d.text((726, y0 + 26), "WET          DRY", fill=(95, 95, 95), font=fx)
    d.text((726, y0 + 84), "UPC / FILM CODE", fill=BLACK, font=fx)

    return y0 + 120


def _checklist_header(d, y, fonts):
    _, _, _, fx = fonts
    d.line((16, y, W - 16, y), fill=GRID, width=2)
    d.text((C_NA - 6, y + 6), "N/A", fill=BLACK, font=fx)
    d.text((C_GO - 4, y + 6), "GO", fill=BLACK, font=fx)
    d.text((C_NGO - 16, y + 6), "NO-GO", fill=BLACK, font=fx)
    d.text((C_G2 - 4, y + 6), "GO", fill=BLACK, font=fx)
    d.text((C_RTA - 8, y + 6), "RTA", fill=BLACK, font=fx)
    d.text((C_RA - 4, y + 6), "RA", fill=BLACK, font=fx)
    y += 26
    d.line((16, y, W - 16, y), fill=GRID, width=1)
    return y + 2


def _vlines(d, y0, y1):
    d.line((X_SPLIT, y0, X_SPLIT, y1), fill=GRID, width=1)
    d.line((C_NA - 24, y0, C_NA - 24, y1), fill=GRID, width=1)
    d.line((C_GO - 24, y0, C_GO - 24, y1), fill=GRID, width=1)
    d.line((C_NGO - 24, y0, C_NGO - 24, y1), fill=GRID, width=1)
    d.line((C_G2 - 24, y0, C_G2 - 24, y1), fill=GRID, width=1)
    d.line((C_RTA - 24, y0, C_RTA - 24, y1), fill=GRID, width=1)
    d.line((C_RA - 24, y0, C_RA - 24, y1), fill=GRID, width=1)


def _margin_note(d, fx, rng):
    """Handwritten-style margin note like the reference: Approx Q3 + arrow."""
    y = 440
    for word in ("Approx", "Q3"):
        d.text((6 + rng.randint(0, 1), y), word, fill=(45, 65, 130), font=fx)
        y += 12
    d.line((20, y + 2, 26, y + 56), fill=(45, 65, 130), width=2)


ROWS = [
    ("First 5 bags Reviewed for Mixed Product", "(startups and product changeovers)"),
    ("PSM Completed?", None),
    ("Blocker/Sock in Place and Working Correctly?", None),
    ("Expiration Date: _________  Price: _________", None),
    ("Day/Plant/Shift/Julian Code:", None),
    ("Material Solvent Odor?", None),
    ("Product Tasted / Correct Product in Bag?", None),
    ("Tape Date: ______  Case Label Date: ______", None),
    ("Canadian Made Week Of Date:", None),
    ("PACKAGE APPEARANCE (GRAPHICS/REGISTRATION/BAG CUT/FORMER TRACKS)", None),
    ("SEAL INTEGRITY (PRODUCT IN SEALS/PLEATS AND/OR TUCKS/STRENGTH)", None),
    ("CASE COUNT (Case Accuracy/Configuration For Direct-To-Customer Only)", None),
]

# Per-row mark column for ALL-GO filled form (matches typical “all clear”)
MARKS_GO = ["GO", "YES", "YES", "GO", "GO", "GO", "GO", "GO", "GO", "G2", "G2", "G2"]

# Per-row marks for NO-GO demo
MARKS_NOGO = ["NGO", "NO", "YES", "GO", "GO", "NGO", "GO", "GO", "GO", "RA", "RTA", "G2"]


def _draw_table(d, fonts, rng, marks):
    _, _, _, fx = fonts
    y = _checklist_header(d, _shell(d, fonts), fonts)
    y_start = y
    y_cursor = y
    for (l1, l2), col in zip(ROWS, marks):
        rh = ROW_H2 if l2 else ROW_H1
        d.line((16, y_cursor, W - 16, y_cursor), fill=GRID, width=1)
        d.text((X_LABEL, y_cursor + 4), l1, fill=BLACK, font=fx)
        if l2:
            d.text((X_LABEL, y_cursor + 18), l2, fill=BLACK, font=fx)
        cy = y_cursor + (22 if l2 else 16)
        _mark(d, col, cy, rng)
        y_cursor += rh
    d.line((16, y_cursor, W - 16, y_cursor), fill=GRID, width=1)
    _vlines(d, y_start, y_cursor)
    return y_cursor


def _signatures(d, y, fonts):
    _, _, _, fx = fonts
    h = 96
    gap = 12
    wbox = (W - 32 - gap) // 2
    d.rectangle((16, y, 16 + wbox, y + h), outline=GRID, width=2)
    d.rectangle((16 + wbox + gap, y, W - 16, y + h), outline=GRID, width=2)
    d.text((22, y + 8), "Initial Verification Signature/Initial", fill=BLACK, font=fx)
    d.text((22 + wbox + gap, y + 8), "Final Verification Signature/Initial", fill=BLACK, font=fx)


def draw_go(path: Path) -> None:
    rng = random.Random(202503251)
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    fonts = _fonts()
    y = _draw_table(d, fonts, rng, MARKS_GO)
    _margin_note(d, fonts[3], rng)
    y += 20
    _signatures(d, y, fonts)
    d.text((18, H - 32), path.name, fill=(115, 115, 115), font=fonts[3])
    OUT.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG", optimize=True)
    print("Wrote", path)


def draw_nogo(path: Path) -> None:
    rng = random.Random(202503252)
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    fonts = _fonts()
    y = _draw_table(d, fonts, rng, MARKS_NOGO)
    _margin_note(d, fonts[3], rng)
    y += 20
    _signatures(d, y, fonts)
    d.text((18, H - 32), path.name, fill=(115, 115, 115), font=fonts[3])
    OUT.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG", optimize=True)
    print("Wrote", path)


def main() -> None:
    draw_go(OUT / "sample_handwritten_fl5883_go.png")
    draw_nogo(OUT / "sample_handwritten_fl5883_nogo.png")


if __name__ == "__main__":
    main()
