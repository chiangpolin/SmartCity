import requests
import json
import os


def load_data():
    with open("./parking_json/parking_algorithm.json", "r") as f:
        data = json.load(f)
    return data

def get_routes(start, end):
    url = "https://routes.googleapis.com/directions/v2:computeRoutes"

    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    if not api_key:
        raise ValueError("API key not found. Please set GOOGLE_MAPS_API_KEY in your environment.")

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.geoJsonLinestring"
    }

    data = {
        "origin": {
            "location": {
                "latLng": {
                    "latitude": start['y'],
                    "longitude": start['x']
                }
            }
        },
        "destination": {
            "location": {
                "latLng": {
                    "latitude": end['y'],
                    "longitude": end['x']
                }
            }
        },
        "travelMode": "DRIVE",
        "routingPreference": "TRAFFIC_AWARE",
        "polylineEncoding": "GEO_JSON_LINESTRING",
        "computeAlternativeRoutes": False,
        "routeModifiers": {
            "avoidTolls": False,
            "avoidHighways": False,
            "avoidFerries": False
        },
        "languageCode": "en-US",
        "units": "METRIC"
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        data = response.json()
        return {
            **data['routes'][0],
            'name': f'Lot {i+1}',
            'x': end['x'],
            'y': end['y']
        }
    else:
        print("Error:", response.status_code, response.text)


if __name__ == "__main__":
    data = load_data()
    start_point = data["start_point"]
    parking_lots = data["parking_lots"]
    
    results = {
        'start_point': {
            "x": round(start_point['x']/100, 3),
            "y": round(start_point['y']/100, 3),
        },
        'parking_lots': []
    }
    for i, lot in enumerate(parking_lots):
        end = {
            "x": round(lot['x']/100, 3),
            "y": round(lot['y']/100, 3),
        }
        result = get_routes(results['start_point'], end)
        results['parking_lots'].append(result)

    with open(f"./parking_json/route_results.json", "w") as f:
        json.dump(results, f, indent=2)