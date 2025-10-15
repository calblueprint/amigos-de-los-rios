import pandas as pd
from pathlib import Path

def process_planitgeo_csv(csv_path: str):
    """
    Reads a PlanIt Geo CSV export and extracts tree IDs and addresses.

    Args:
        csv_path (str): Path to the CSV file (e.g. "data/planitgeo_trees.csv")

    Returns:
        list[dict]: List of addresses
    """

    path = Path(csv_path)
    if not path.exists():
        raise FileNotFoundError(f"CSV not found at {csv_path}")

    trees_df = pd.read_csv(csv_path)
    address_col = "Address"
    addresses = trees_df[address_col].tolist()
    
    for i, addr in enumerate(addresses[:5], start=1):
        print(f"{i}. {addr}")

    # Print preview
    print(f"{len(trees_df)} tree records.")

    return addresses


if __name__ == "__main__":
    csv_path = "../public/trees_data/planitgeo_trees_10_9.csv"
    process_planitgeo_csv(csv_path)