#!/usr/bin/env python3
import csv
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
python_exe = sys.executable  # use the same Python interpreter

# -------------------------------------------------------------------
# 1) Which scripts to run
# -------------------------------------------------------------------

# Montana "money" scrapers (feed the opportunities CSV)
MONTANA_MONEY_SCRAPERS = [
    "crawl_mt_unclaimed.py",
    "crawl_mt_csi_legal_actions.py",
    "crawl_ftc_refunds.py",  # NEW: nationwide FTC refunds, high-value money
]

# Montana NEWS scrapers (feed montana_news_feed.csv)
MONTANA_NEWS_SCRAPERS = [
    "crawl_mt_csi_news.py",
    "crawl_mt_dor_news_marketing.py",
    "crawl_mt_psc_news.py",
    "crawl_nwenergy_news.py",
]

# Helper / pipeline scripts
MERGE_SCRIPT = "merge_opportunities.py"
TAG_SCRIPT = "tag_opportunities.py"
NEWS_COMBINER_SCRIPT = "build_montana_news_feed.py"


# -------------------------------------------------------------------
# 2) Helpers
# -------------------------------------------------------------------

def run_script(name: str):
    path = SCRIPT_DIR / name
    if not path.exists():
        print(f"Skipping {name}: file not found at {path}")
        return

    print(f"\n=== Running {name} ===")
    result = subprocess.run([python_exe, str(path)])
    if result.returncode != 0:
        print(f"{name} exited with code {result.returncode}")


def write_tagged_with_state():
    """
    Take opportunities_tagged.csv in the scrapers folder and write
    site/data/opportunities_tagged_with_state.csv with a 'state' column
    set to 'MT' (for now, since this is the Montana-only pipeline).

    When you add another state in the future, you can copy this file
    into that state's folder and just change "MT" to the new state code.
    """
    input_csv = SCRIPT_DIR / "opportunities_tagged.csv"
    if not input_csv.exists():
        print(f"Cannot find {input_csv}, skipping state-tagged export.")
        return

    site_data_dir = SCRIPT_DIR.parent / "site" / "data"
    site_data_dir.mkdir(parents=True, exist_ok=True)
    output_csv = site_data_dir / "opportunities_tagged_with_state.csv"

    print(f"\n=== Writing {output_csv} with state=MT ===")

    with input_csv.open("r", encoding="utf-8", newline="") as f_in:
        reader = csv.DictReader(f_in)
        fieldnames = list(reader.fieldnames or [])

        # Ensure 'state' column exists
        if "state" not in fieldnames:
            fieldnames.append("state")

        rows = []
        for row in reader:
            # Always set state to MT for this pipeline
            row["state"] = "MT"
            rows.append(row)

    with output_csv.open("w", encoding="utf-8", newline="") as f_out:
        writer = csv.DictWriter(f_out, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)

    print(f"Wrote {len(rows)} rows to {output_csv}")


# -------------------------------------------------------------------
# 3) Main pipeline
# -------------------------------------------------------------------

def main():
    # 1) Run Montana money scrapers
    for script in MONTANA_MONEY_SCRAPERS:
        run_script(script)

    # 2) Run Montana news scrapers
    for script in MONTANA_NEWS_SCRAPERS:
        run_script(script)

    # 3) Merge and tag opportunities (Montana-only)
    run_script(MERGE_SCRIPT)
    run_script(TAG_SCRIPT)

    # 4) Export state-tagged file for the static site (Netlify)
    write_tagged_with_state()

    # 5) Build combined Montana news feed CSV
    run_script(NEWS_COMBINER_SCRIPT)


if __name__ == "__main__":
    main()
