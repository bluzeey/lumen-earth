from django.db import models


class ProcInventoryFact(models.Model):
    inventory_id = models.AutoField(primary_key=True)
    facility = models.ForeignKey('raw_data.RawFacilityDim', on_delete=models.CASCADE)
    material = models.ForeignKey('raw_data.RawMaterialDim', on_delete=models.CASCADE)
    batch_id = models.CharField(max_length=255)
    quantity_kg = models.FloatField()
    custom_unit = models.CharField(max_length=100, blank=True)
    unit_mapping = models.ForeignKey('raw_data.RawUnitMappingDim', on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=100)
    timestamp = models.DateTimeField()


class ProcTraceChainFact(models.Model):
    trace_id = models.AutoField(primary_key=True)
    batch_id = models.CharField(max_length=255)
    prev_step_id = models.CharField(max_length=255, null=True, blank=True)
    next_step_id = models.CharField(max_length=255, null=True, blank=True)
    timestamp = models.DateTimeField()
    hash = models.CharField(max_length=255)


class ProcProofOfGoodFact(models.Model):
    proof_id = models.AutoField(primary_key=True)
    batch_id = models.CharField(max_length=255)
    verifier_id = models.CharField(max_length=255)
    source_batch = models.CharField(max_length=255)
    timestamp = models.DateTimeField()
    proof_doc_url = models.URLField()
    methodology_ref = models.CharField(max_length=255)


class ProcEmissionsCalcFact(models.Model):
    calc_id = models.AutoField(primary_key=True)
    batch_id = models.CharField(max_length=255)
    process = models.ForeignKey('raw_data.RawTextileProcessDim', on_delete=models.CASCADE)
    material = models.ForeignKey('raw_data.RawMaterialDim', on_delete=models.CASCADE)
    facility = models.ForeignKey('raw_data.RawFacilityDim', on_delete=models.CASCADE)
    factor = models.ForeignKey('raw_data.RawEmissionFactorDim', on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=100)
    emissions_kgco2 = models.FloatField()
    timestamp = models.DateTimeField()


class ProcOrderFulfillmentFact(models.Model):
    order = models.ForeignKey('raw_data.RawOrderSubmissionFact', on_delete=models.CASCADE)
    material = models.ForeignKey('raw_data.RawMaterialDim', on_delete=models.CASCADE)
    facility = models.ForeignKey('raw_data.RawFacilityDim', on_delete=models.CASCADE)
    listing = models.ForeignKey('raw_data.RawMarketplaceListingFact', on_delete=models.CASCADE)
    quantity_required_kg = models.FloatField()
    quantity_matched_kg = models.FloatField()
    order_fulfillment_status = models.CharField(max_length=100)
    risk_reason = models.CharField(max_length=255, blank=True)
    stock_status = models.CharField(max_length=100)
    updated_at = models.DateTimeField()


class ProcMarketplaceStateFact(models.Model):
    state_id = models.AutoField(primary_key=True)
    listing = models.ForeignKey('raw_data.RawMarketplaceListingFact', on_delete=models.CASCADE)
    inventory = models.ForeignKey(ProcInventoryFact, on_delete=models.CASCADE)
    state = models.CharField(max_length=100)
    timestamp = models.DateTimeField()

