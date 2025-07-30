"""Simple scraper to collect supplier data for the marketplace."""

import json
from typing import List, Dict

import requests
from bs4 import BeautifulSoup

URL = "https://example.com/recycling-market"


def fetch_suppliers() -> List[Dict[str, str]]:
    """Fetch supplier data from an example marketplace page.

    This function demonstrates how the marketplace data could be collected
    from an online source. The target page is expected to have a table with
    supplier name, material type and rate per tonne.
    """
    resp = requests.get(URL, timeout=10)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    data: List[Dict[str, str]] = []

    table = soup.find("table")
    if not table:
        return data

    for row in table.find_all("tr")[1:]:
        cols = [c.get_text(strip=True) for c in row.find_all("td")]
        if len(cols) >= 3:
            supplier = {
                "name": cols[0],
                "material": cols[1],
                "ratePerTonne": cols[2],
            }
            data.append(supplier)

    return data


def main() -> None:
    suppliers = fetch_suppliers()
    print(json.dumps(suppliers, indent=2))


if __name__ == "__main__":
    main()
