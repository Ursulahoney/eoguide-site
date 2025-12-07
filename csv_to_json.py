import csv, json

input_file = "opportunities_tagged_with_state.csv"
output_file = "opportunities_tagged_with_state.json"

rows = []

with open(input_file, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        rows.append(row)

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(rows, f, ensure_ascii=False, indent=2)

print(f"Saved {len(rows)} records to {output_file}")
