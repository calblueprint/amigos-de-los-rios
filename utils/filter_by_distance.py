import pandas as pd
import math
from process_csv import process_planitgeo_csv

def haversine(lat1, lon1, lat2, lon2):
    """
    Compute the great-circle distance between two points on Earth in miles.
    """
    R = 3958.8  # Earth radius in miles

    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


def properties_within_radius(df, center_lat, center_lon, radius_miles):
    if not {"Latitude", "Longitude"}.issubset(df.columns):
        raise ValueError("DataFrame must have 'Latitude' and 'Longitude' columns")

    def calc_distance(row):
        return haversine(center_lat, center_lon, row["Latitude"], row["Longitude"])

    # Compute distances and filter
    df["distance_miles"] = df.apply(calc_distance, axis=1)
    nearby_properties = df[df["distance_miles"] <= radius_miles]

    print(f"Found {len(nearby_properties)} properties within {radius_miles} miles.")
    return nearby_properties[["Primary ID", "Address", "Latitude", "Longitude", "distance_miles"]]


if __name__ == "__main__":
    csv_path = "../public/properties_data/planitgeo_properties_10_26.csv"
    csv_df = process_planitgeo_csv(csv_path)
    center_lat = 34.204689
    center_lon = -118.132674
    radius = 0.1  # miles

    nearby = properties_within_radius(csv_df, center_lat, center_lon, radius)
    print(nearby.head(34))