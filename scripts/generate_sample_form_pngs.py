"""One-off script: write demo QC form PNGs into frontend/public/mock-forms/."""
from __future__ import annotations

from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    raise SystemExit("Install Pillow: pip install pillow")

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "public" / "mock-forms"


def draw_form(path: Path, *, nogo_row: int | None) -> None:
    w, h = 720, 900
    img = Image.new("RGB", (w, h), (250, 250, 250))
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arial.ttf", 18)
        font_s = ImageFont.truetype("arial.ttf", 14)
    except OSError:
        font = ImageFont.load_default()
        font_s = font

    d.rectangle((0, 0, w, 70), fill=(0, 48, 135))
    d.text((20, 20), "JOB AID — PACKAGE QUALITY (SAMPLE)", fill=(255, 255, 255), font=font)
    d.text((20, 45), "Demo file for upload testing", fill=(200, 220, 255), font=font_s)

    y = 100
    d.text((20, y), "DATE ______   SHIFT ____   PRODUCT ________________", fill=(30, 30, 30), font=font_s)
    y += 50
    d.text((20, y), "Checklist (GO / NO-GO columns)", fill=(0, 48, 135), font=font)
    y += 36
    headers = ["Check item", "GO", "NO-GO"]
    xcols = [20, 420, 520]
    for x, htxt in zip(xcols, headers):
        d.text((x, y), htxt, fill=(50, 50, 50), font=font_s)
    y += 28

    rows = [
        "First 5 bags reviewed",
        "PSM completed",
        "Expiration / price coding",
        "Julian / plant code",
        "Seal integrity",
        "Package appearance",
    ]
    for i, label in enumerate(rows):
        d.text((20, y), label, fill=(20, 20, 20), font=font_s)
        if nogo_row is not None and i == nogo_row:
            d.text((520, y), "X", fill=(176, 0, 32), font=font)
        else:
            d.text((420, y), "X", fill=(10, 122, 62), font=font)
        y += 32

    d.text((20, h - 60), f"Filename: {path.name} → demo classifier", fill=(100, 100, 100), font=font_s)
    OUT.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    print("Wrote", path)


def main() -> None:
    draw_form(OUT / "sample_form_go.png", nogo_row=None)
    draw_form(OUT / "sample_form_nogo.png", nogo_row=0)


if __name__ == "__main__":
    main()
