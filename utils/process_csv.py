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

    properties_df = pd.read_csv(csv_path)
    address_col = "Address"
    id_col = "Primary ID"
    addresses = properties_df[address_col].tolist()
    ids = properties_df[id_col].tolist()

    property_info = properties_df[['Address', 'Primary ID', 'Tree Number', 'Latitude', 'Longitude', 'Last Watered']]

    for i, row in enumerate(property_info.head(5).itertuples(index=False), start=1):
        print(f"{i}. Address: {row[0]}, ID: {row[1]}, Tree Number: {row[2]}, Latitude: {row[3]}, Longitude: {row[4]}, Last Watered: {row[5]}")

    # Print preview
    print(f"{len(property_info)} property records.")

    return property_info


if __name__ == "__main__":
    csv_path = "../public/trees_data/planitgeo_trees_10_9.csv"
    process_planitgeo_csv(csv_path)
    