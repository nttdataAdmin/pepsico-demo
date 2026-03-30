"""
Rebuild FL-5883 WEAKLINK-style scan with only handwritten-style ticks in chosen columns.

Default base: sample_handwritten_fl5883_nogo.png (WEAKLINK title). Strips blue/red pen
in the checklist zone, then draws checkmarks in GO or NO-GO (+ RTA for last 3 rows).

Usage:
  python scripts/render_fl5883_handwritten_ticks.py --mode go --out public/mock-forms/handwritten_fl5883_all_go.png
  python scripts/render_fl5883_handwritten_ticks.py --mode nogo --out public/mock-forms/handwritten_fl5883_all_nogo.png

Use --input path/to/your_scan.png to use your own upload (same aspect ratio ~920x1680 works best).
"""

from __future__ import annotations

import argparse
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw

# Checklist row centers (Y px) calibrated on 920x1680 — keep below signature blocks (~y>810)
ROW_Y = [337, 382, 427, 472, 517, 562, 607, 652, 692, 727, 762, 797]

# Column centers (X px) for N/A | GO | GO | RTA | NO-GO | RA
COL = {
    "na": 448,
    "go1": 505,
    "go2": 535,
    "rta": 598,
    "nogo": 622,
    "ra": 668,
}

# Checklist ink detection + paper sample column
CHECKLIST_X0 = 400
PAPER_SAMPLE_X = 320


def is_ink(rgb: tuple[int, int, int]) -> bool:
    r, g, b = rgb
    if b > r + 18 and b > g + 12 and (r + g + b) < 420:
        return True
    if r > g + 35 and r > b + 35 and r > 95:
        return True
    return False


def strip_marks(img: Image.Image, y0: int = 280, y1: int = 880) -> Image.Image:
    """Replace pen pixels in checklist area with paper color from left margin."""
    px = img.load()
    w, h = img.size
    y0 = max(0, y0)
    y1 = min(h, y1)
    for y in range(y0, y1):
        # paper reference: median-ish from text column
        pr, pg, pb = px[PAPER_SAMPLE_X, y]
        for x in range(CHECKLIST_X0, w):
            if is_ink(px[x, y]):
                # blend slightly for anti-band
                px[x, y] = (pr, pg, pb)
    return img


def jitter() -> float:
    return random.uniform(-1.2, 1.2)


def draw_hand_checkmark(
    draw: ImageDraw.ImageDraw,
    cx: float,
    cy: float,
    size: float = 14,
    color: tuple[int, int, int] = (32, 72, 158),
    width: int = 3,
) -> None:
    """Sketchy ✓ like ballpoint: short down-stroke then longer up-stroke."""
    s = size
    # Check mark segments with small noise
    x0, y0 = cx - s * 0.35 + jitter(), cy + s * 0.15 + jitter()
    x1, y1 = cx - s * 0.05 + jitter(), cy + s * 0.45 + jitter()
    x2, y2 = cx + s * 0.55 + jitter(), cy - s * 0.35 + jitter()
    draw.line([(x0, y0), (x1, y1)], fill=color, width=width)
    draw.line([(x1, y1), (x2, y2)], fill=color, width=width)
    # faint second pass for ink density
    draw.line([(x0, y0), (x1, y1)], fill=color, width=max(1, width - 1))
    draw.line([(x1, y1), (x2, y2)], fill=color, width=max(1, width - 1))


def scale_coords(w: int, h: int) -> tuple[list[int], dict[str, float]]:
    """Scale ROW_Y and COL from reference 920x1680."""
    sx = w / 920.0
    sy = h / 1680.0
    rows = [int(round(y * sy)) for y in ROW_Y]
    cols = {k: int(round(v * sx)) for k, v in COL.items()}
    return rows, cols


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--input",
        type=Path,
        default=Path(__file__).resolve().parent.parent
        / "frontend/build/mock-forms/sample_handwritten_fl5883_nogo.png",
        help="Base scan (WEAKLINK).",
    )
    ap.add_argument("--mode", choices=("go", "nogo"), required=True)
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--seed", type=int, default=42)
    args = ap.parse_args()
    random.seed(args.seed)

    img = Image.open(args.input).convert("RGB")
    w, h = img.size
    rows, col = scale_coords(w, h)

    y_strip0 = int(h * 0.15)
    # Strip old pen from checklist through signature blocks (right side only; left margin notes kept)
    y_strip1 = int(h * 0.92)
    strip_marks(img, y_strip0, y_strip1)

    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    n = min(len(rows), 12)
    max_y_tick = int(h * 0.505)
    for i in range(n):
        cy = rows[i]
        if cy > max_y_tick:
            continue
        if args.mode == "go":
            # Rows 0-8: second GO; rows 9-11: first GO (matches real form convention)
            cx = col["go2"] if i < 9 else col["go1"]
            draw_hand_checkmark(draw, float(cx), float(cy), size=15 * (w / 920))
        else:
            # Rows 0-8: handwritten tick in NO-GO; last 3: tick in RTA (per brief)
            if i >= 9:
                cx = col["rta"]
            else:
                cx = col["nogo"]
            draw_hand_checkmark(draw, float(cx), float(cy), size=14 * (w / 920))

    out = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    args.out.parent.mkdir(parents=True, exist_ok=True)
    out.save(args.out, format="PNG", optimize=True)
    print("Wrote", args.out, "mode=", args.mode, "size", out.size)


if __name__ == "__main__":
    main()
