def estimate_carbon_sequestration(avg_ndvi, area_ha):
    # Rough estimation: adjust this factor based on region
    sequestration_rate = 0.5  # tons CO2 per hectare per NDVI unit
    return avg_ndvi * sequestration_rate * area_ha
