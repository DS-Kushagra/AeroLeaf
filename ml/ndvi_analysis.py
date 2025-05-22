import ee
ee.Initialize()

def get_ndvi_timeseries(lat, lon, start_year=2020, end_year=2024):
    point = ee.Geometry.Point(lon, lat)
    collection = (
        ee.ImageCollection("COPERNICUS/S2")
        .filterBounds(point)
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    )

    results = []
    for year in range(start_year, end_year + 1):
        for month in range(1, 13):
            start = f"{year}-{month:02d}-01"
            end = f"{year}-{month:02d}-28"

            monthly = collection.filterDate(start, end).map(
                lambda img: img.addBands(img.normalizedDifference(['B8', 'B4']).rename('NDVI'))
            )

            mean_ndvi = monthly.select('NDVI').mean().reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=point,
                scale=10
            ).getInfo()

            results.append({
                "year": year,
                "month": month,
                "ndvi": mean_ndvi.get('NDVI') if mean_ndvi else None
            })
    return results
