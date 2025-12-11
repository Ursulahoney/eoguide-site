import csv
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_CSV = os.path.join(BASE_DIR, "opportunities_combined.csv")
OUTPUT_CSV = os.path.join(BASE_DIR, "opportunities_tagged.csv")

# ---- CATEGORY MAPPING ----

CATEGORY_BY_SOURCE = {
    # Unclaimed & refunds
    "MT_UNCLAIMED": "Unclaimed money & refunds",
    "LIFE_INSURANCE_UNCLAIMED": "Unclaimed money & refunds",
    "CREDIT_UNION_UNCLAIMED": "Unclaimed money & refunds",
    "MT_LOTTERY": "Unclaimed money & refunds",
    "MT_COURT_SURPLUS": "Unclaimed money & refunds",
    "RAILROAD_RETIREMENT": "Unclaimed money & refunds",
    "MORTGAGE_ESCROW_REFUNDS": "Unclaimed money & refunds",
    "MT_COOP_DISTRIBUTIONS": "Unclaimed money & refunds",
    "FTC_REFUNDS": "Unclaimed money & refunds",  # NEW: nationwide FTC refunds

    # Legal settlements
    "OPENCLASSACTIONS": "Legal settlements & enforcement",
    "MT_CSI_LEGAL": "Legal settlements & enforcement",
    "MT_DOJ_SETTLEMENTS": "Legal settlements & enforcement",

    # Tax & property
    "MT_DOR_PROGRAMS": "Tax & property relief",
    "MT_PROPERTY_TAX_RELIEF": "Tax & property relief",

    # Utilities & energy
    "NWENERGY_PROGRAMS": "Utilities & energy",
    "OTHER_MT_UTILITIES": "Utilities & energy",
    "MT_PSC_PROGRAMS": "Utilities & energy",

    # Health & medical
    "MT_HOSPITAL_CHARITY_CARE": "Health & medical debt",
    "MT_WORKERS_COMP": "Health & medical debt",

    # Social services & safety net
    "MT_DPHHS_PROGRAMS": "Social services & safety net",
    "US_FEDERAL_PROGRAMS": "Social services & safety net",
    "MT_CHILD_SUPPORT": "Social services & safety net",
    "MT_VICTIM_COMPENSATION": "Social services & safety net",

    # Agriculture
    "USDA_PROGRAMS": "Agriculture & rural",

    # Education & student help
    "STUDENT_LOAN_RELIEF": "Education & student help",
    "MT_SCHOLARSHIPS": "Education & student help",

    # Veterans
    "MT_VETERANS": "Veterans",

    # Tribal
    "MT_TRIBAL_PROGRAMS": "Tribal programs",

    # Business
    "MT_BUSINESS_GRANTS": "Business & jobs",
}

# ---- SPEED / DIFFICULTY MAPPING ----

SPEED_BY_SOURCE = {
    # Usually quick once you apply/search
    "MT_UNCLAIMED": "Fast",
    "LIFE_INSURANCE_UNCLAIMED": "Medium",
    "CREDIT_UNION_UNCLAIMED": "Fast",
    "MT_LOTTERY": "Fast",
    "MT_COURT_SURPLUS": "Medium",
    "RAILROAD_RETIREMENT": "Medium",
    "MORTGAGE_ESCROW_REFUNDS": "Fast",
    "MT_COOP_DISTRIBUTIONS": "Medium",

    # Class actions & legal – slow
    "OPENCLASSACTIONS": "Slow",
    "MT_CSI_LEGAL": "Slow",
    "MT_DOJ_SETTLEMENTS": "Slow",
    "FTC_REFUNDS": "Medium",  # NEW: refunds can be slow but are high-value

    # Tax & property
    "MT_DOR_PROGRAMS": "Medium",
    "MT_PROPERTY_TAX_RELIEF": "Medium",

    # Utilities
    "NWENERGY_PROGRAMS": "Medium",
    "OTHER_MT_UTILITIES": "Medium",
    "MT_PSC_PROGRAMS": "Medium",

    # Health & medical
    "MT_HOSPITAL_CHARITY_CARE": "Medium",
    "MT_WORKERS_COMP": "Slow",

    # Social safety net
    "MT_DPHHS_PROGRAMS": "Slow",
    "US_FEDERAL_PROGRAMS": "Slow",
    "MT_CHILD_SUPPORT": "Slow",
    "MT_VICTIM_COMPENSATION": "Slow",

    # Agriculture
    "USDA_PROGRAMS": "Slow",

    # Education
    "STUDENT_LOAN_RELIEF": "Slow",
    "MT_SCHOLARSHIPS": "Medium",

    # Veterans
    "MT_VETERANS": "Slow",

    # Tribal
    "MT_TRIBAL_PROGRAMS": "Slow",

    # Business
    "MT_BUSINESS_GRANTS": "Slow",
}

DIFFICULTY_BY_SOURCE = {
    # Unclaimed-type stuff
    "MT_UNCLAIMED": "Easy",
    "LIFE_INSURANCE_UNCLAIMED": "Medium",
    "CREDIT_UNION_UNCLAIMED": "Easy",
    "MT_LOTTERY": "Easy",
    "MT_COURT_SURPLUS": "Medium",
    "RAILROAD_RETIREMENT": "Medium",
    "MORTGAGE_ESCROW_REFUNDS": "Medium",
    "MT_COOP_DISTRIBUTIONS": "Medium",
    "FTC_REFUNDS": "Medium",  # NEW: usually a bit of paperwork, but manageable

    # Legal
    "OPENCLASSACTIONS": "Medium",
    "MT_CSI_LEGAL": "Hard",
    "MT_DOJ_SETTLEMENTS": "Medium",

    # Tax
    "MT_DOR_PROGRAMS": "Medium",
    "MT_PROPERTY_TAX_RELIEF": "Medium",

    # Utilities
    "NWENERGY_PROGRAMS": "Easy",
    "OTHER_MT_UTILITIES": "Easy",
    "MT_PSC_PROGRAMS": "Medium",

    # Health
    "MT_HOSPITAL_CHARITY_CARE": "Medium",
    "MT_WORKERS_COMP": "Medium",

    # Social safety net
    "MT_DPHHS_PROGRAMS": "Medium",
    "US_FEDERAL_PROGRAMS": "Medium",
    "MT_CHILD_SUPPORT": "Medium",
    "MT_VICTIM_COMPENSATION": "Medium",

    # Agriculture
    "USDA_PROGRAMS": "Medium",

    # Education
    "STUDENT_LOAN_RELIEF": "Hard",
    "MT_SCHOLARSHIPS": "Medium",

    # Veterans
    "MT_VETERANS": "Medium",

    # Tribal
    "MT_TRIBAL_PROGRAMS": "Medium",

    # Business
    "MT_BUSINESS_GRANTS": "Hard",
}


def map_category(source):
    return CATEGORY_BY_SOURCE.get(source, "Other")


def map_speed(source):
    return SPEED_BY_SOURCE.get(source, "Medium")


def map_difficulty(source, proof_required):
    # If we have an explicit mapping, use it
    if source in DIFFICULTY_BY_SOURCE:
        return DIFFICULTY_BY_SOURCE[source]

    # Fallback from proof_required
    pr = (proof_required or "").lower()
    if pr == "easy":
        return "Easy"
    if pr == "medium":
        return "Medium"
    if pr == "high":
        return "Hard"
    return "Medium"


def map_proof_simple(proof_required):
    pr = (proof_required or "").lower()
    if pr == "easy":
        return "Light"
    if pr in ("medium", "high"):
        return "Normal"
    return "Unknown"


def main():
    if not os.path.exists(INPUT_CSV):
        print(f"Input file not found: {INPUT_CSV}")
        return

    with open(INPUT_CSV, newline="", encoding="utf-8") as f_in:
        reader = csv.DictReader(f_in)
        fieldnames = reader.fieldnames + [
            "category",
            "money_speed",
            "difficulty",
            "proof_simple",
        ]

        rows = []
        for row in reader:
            source = row.get("source", "").strip()
            proof_required = row.get("proof_required", "")

            row["category"] = map_category(source)
            row["money_speed"] = map_speed(source)
            row["difficulty"] = map_difficulty(source, proof_required)
            row["proof_simple"] = map_proof_simple(proof_required)

            rows.append(row)

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f_out:
        writer = csv.DictWriter(f_out, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)

    print(f"Wrote {len(rows)} tagged rows to {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
