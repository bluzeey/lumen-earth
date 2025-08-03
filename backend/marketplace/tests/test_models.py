from django.test import TestCase

from marketplace.models import (
    OutMarketplaceActiveListingFact,
    ProcMarketplaceStateFact,
    RawMarketplaceListingFact,
)


class MarketplaceModelTests(TestCase):
    """Basic interaction tests for marketplace models."""

    def test_active_listing_creation(self) -> None:
        raw = RawMarketplaceListingFact.objects.create(
            listing_id="listing-1", payload={"key": "value"}
        )
        processed = ProcMarketplaceStateFact.objects.create(
            raw_listing=raw, state="processed"
        )
        active = OutMarketplaceActiveListingFact.objects.create(
            processed_state=processed
        )

        self.assertTrue(active.is_active)
        self.assertEqual(active.processed_state, processed)
        self.assertEqual(active.processed_state.raw_listing, raw)
