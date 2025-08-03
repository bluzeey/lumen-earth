"""Marketplace models.

These models are intentionally lightweight and capture the lifecycle of a
marketplace listing as it moves through various processing stages.  The
``RawMarketplaceListingFact`` represents the initial ingested data, the
``ProcMarketplaceStateFact`` captures processed state, and the
``OutMarketplaceActiveListingFact`` represents an active listing ready for
exposure in the product.
"""

from django.db import models


class RawMarketplaceListingFact(models.Model):
    """Raw data captured directly from the marketplace source."""

    listing_id = models.CharField(max_length=255, unique=True)
    payload = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:  # pragma: no cover - simple data repr
        return f"RawListing<{self.listing_id}>"


class ProcMarketplaceStateFact(models.Model):
    """Processed state derived from a raw marketplace listing."""

    raw_listing = models.ForeignKey(
        RawMarketplaceListingFact,
        on_delete=models.CASCADE,
        related_name="processed_states",
    )
    state = models.CharField(max_length=50)
    processed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:  # pragma: no cover - simple data repr
        return f"State<{self.state}> for {self.raw_listing}"


class OutMarketplaceActiveListingFact(models.Model):
    """Representation of an active listing available to consumers."""

    processed_state = models.ForeignKey(
        ProcMarketplaceStateFact,
        on_delete=models.CASCADE,
        related_name="active_listings",
    )
    is_active = models.BooleanField(default=True)
    activated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:  # pragma: no cover - simple data repr
        return f"Active<{self.processed_state.raw_listing.listing_id}>"


__all__ = [
    "RawMarketplaceListingFact",
    "ProcMarketplaceStateFact",
    "OutMarketplaceActiveListingFact",
]

