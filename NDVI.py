import rasterio
import numpy as np
import json
import os

# Set file paths for Site 3
pre_path = r"ml\data\sentinel\site_3\RioDoce_2018_pre_NDVI.tif"
post_path = r"ml\data\sentinel\site_3\RioDoce_2020_post_NDVI.tif"

# Load NDVI .tif as array
def load_ndvi(path):
    with rasterio.open(path) as src:
        ndvi = src.read(1).astype(np.float32)
        ndvi[ndvi == src.nodata] = np.nan
    return ndvi

# Load and compute mean NDVI
ndvi_pre = load_ndvi(pre_path)
ndvi_post = load_ndvi(post_path)

mean_pre = np.nanmean(ndvi_pre)
mean_post = np.nanmean(ndvi_post)
delta_ndvi = round(float(mean_post - mean_pre), 4)

print(f"Site 3 — Rio Doce Park")
print(f"Mean NDVI (2018): {mean_pre:.4f}")
print(f"Mean NDVI (2020): {mean_post:.4f}")
print(f"ΔNDVI: {delta_ndvi}")

# Save result as JSON
result = {
    "site_id": "site_003",
    "location": {
        "lat": -19.5236,
        "lon": -42.6394
    },
    "planting_date": "2019-06-01",
    "satellite_data": {
        "pre_image": "RioDoce_2018_pre_NDVI.tif",
        "post_image": "RioDoce_2020_post_NDVI.tif",
        "ndvi_change": delta_ndvi
    },
    "verification_result": {
        "status": "verified" if delta_ndvi > 0.1 else "uncertain",
        "confidence": round(float(min(1.0, max(0.5, delta_ndvi * 2.5))), 2),
        "notes": "Positive NDVI change detected." if delta_ndvi > 0 else "No significant NDVI gain."
    }
}

# Save to file
os.makedirs("ml/results", exist_ok=True)
with open("ml/results/site_003.json", "w") as f:
    json.dump(result, f, indent=2)

print("✅ Result saved to ml/results/site_003.json")
