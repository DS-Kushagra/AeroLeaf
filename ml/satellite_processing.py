import ee
ee.Initialize()

def get_sentinel_ndvi(lat, lon, start_date, end_date):
    point = ee.Geometry.Point(lon, lat)
    collection = (
        ee.ImageCollection("COPERNICUS/S2")
        .filterBounds(point)
        .filterDate(start_date, end_date)
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
        .map(lambda img: img.addBands(img.normalizedDifference(['B8', 'B4']).rename('NDVI')))
    )

    ndvi_stats = collection.select('NDVI').mean().reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=point,
        scale=10
    )

    return ndvi_stats.getInfo()
