#!/usr/bin/env python3
"""
merge_opportunities.py

Combine all "money" scraper outputs for the Montana pipeline into a single
opportunities_combined.csv file. This version is a bit more future-proof:

  * It includes FTC_REFUNDS (nationwide refund programs).
  * It can easily be extended with more *_new.csv sources.
  * It adds a simple 'geography' hint when missing, based on the source.

The state-specific tagging (state = "MT") still happens later in
run_all_crawlers.py when writing opportunities_tagged_with_state.csv.
"""

import csv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# Active "money" sources for this pipeline.
# You can add more *_new.csv files here as you grow.
INPUT_FILES = [
    BASE_DIR / "mt_unclaimed_programs_new.csv",
    BASE_DIR / "mt_csi_legal_new.csv",
    BASE_DIR / "ftc_refunds_new.csv",  # nationwide FTC refund programs
]

OUTPUT_FILE = BASE_DIR / "opportunities_combined.csv"


def load_rows(file_path: Path):
    rows = []
    if not file_path.exists():
        print(f"Missing (skipping): {file_path}")
        return rows

    print(f"Loading {file_path}")
    with file_path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


def normalize_row(row: dict, file_path: Path) -> dict:
    """
    Make sure some basic fields are set so downstream scripts
    (like tag_opportunities.py and the static site) can rely on them.
    """
    # Ensure we have a source code
    source = (row.get("source") or "").strip()
    if not source:
        # Fall back to the filename in ALLCAPS as a rough source code.
        source = file_path.stem.upper()
        row["source"] = source

    # Geography hint, if not already set.
    # This is intentionally simple: we only distinguish "national"
    # vs "state" for now. The state itself (MT, WY, etc.) is
    # applied later by run_all_crawlers.py.
    geography = (row.get("geography") or "").strip().lower()
    if not geography:
        if source == "FTC_REFUNDS":
            row["geography"] = "national"
        elif source.startswith("MT_"):
            row["geography"] = "state"

    return row


def merge_files():
    all_rows = []
    seen_ids = set()

    # 1) Load all rows, dedupe by id
    for file_path in INPUT_FILES:
        rows = load_rows(file_path)
        for row in rows:
            row_id = row.get("id")
            if not row_id:
                continue
            if row_id in seen_ids:
                continue
            seen_ids.add(row_id)

            normalized = normalize_row(row, file_path)
            all_rows.append(normalized)

    if not all_rows:
        print("No data found to merge.")
        return

    # 2) Build fieldnames as the UNION of all keys
    fieldnames_set = set()
    for row in all_rows:
        fieldnames_set.update(row.keys())
    fieldnames = list(fieldnames_set)

    with OUTPUT_FILE.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in all_rows:
            # Make sure every field exists in the row, even if empty
            out_row = {field: r.get(field, "") for field in fieldnames}
            writer.writerow(out_row)

    print(f"Combined {len(all_rows)} rows into {OUTPUT_FILE}")


if __name__ == "__main__":
    merge_files()
