from django.db import models


class RawUserDim(models.Model):
    user_id = models.AutoField(primary_key=True)
    org_id = models.CharField(max_length=255)
    role = models.CharField(max_length=100)
    settings_json = models.JSONField()


class RawFacilityDim(models.Model):
    facility_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    org_id = models.CharField(max_length=255)
    boundary_conditions_json = models.JSONField()


class RawMaterialDim(models.Model):
    material_id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=255)
    blend_ratio = models.CharField(max_length=100)
    source = models.CharField(max_length=255)
    certifications = models.CharField(max_length=255)


class RawTextileProcessDim(models.Model):
    process_id = models.AutoField(primary_key=True)
    process_name = models.CharField(max_length=255)
    stage = models.CharField(max_length=100)
    energy_type = models.CharField(max_length=100)
    unit_of_measurement = models.CharField(max_length=100)
    details_json = models.JSONField()


class RawEmissionFactorDim(models.Model):
    factor_id = models.AutoField(primary_key=True)
    process = models.ForeignKey(RawTextileProcessDim, on_delete=models.CASCADE)
    material_type = models.CharField(max_length=100)
    factor_value = models.FloatField()
    source = models.CharField(max_length=255)
    region = models.CharField(max_length=100)


class RawRegistrySourceDim(models.Model):
    registry_id = models.AutoField(primary_key=True)
    registry_name = models.CharField(max_length=255)
    region = models.CharField(max_length=100)
    ruleset = models.CharField(max_length=255)
    api_endpoint = models.URLField()
    last_sync_time = models.DateTimeField(null=True, blank=True)
    registry_payload_json = models.JSONField()


class RawFacilityProcessMapFact(models.Model):
    id = models.AutoField(primary_key=True)
    facility = models.ForeignKey(RawFacilityDim, on_delete=models.CASCADE)
    process = models.ForeignKey(RawTextileProcessDim, on_delete=models.CASCADE)
    default_energy_source = models.CharField(max_length=100)
    active_from = models.DateField()
    active_to = models.DateField(null=True, blank=True)
    scope_flag = models.CharField(max_length=100)


class RawUnitMappingDim(models.Model):
    mapping_id = models.AutoField(primary_key=True)
    custom_unit = models.CharField(max_length=100)
    kg_equivalent = models.FloatField()
    description = models.CharField(max_length=255)


class RawProcessStageDim(models.Model):
    stage_id = models.AutoField(primary_key=True)
    stage_name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)


class RawLocationStageDim(models.Model):
    location_stage_id = models.AutoField(primary_key=True)
    facility = models.ForeignKey(RawFacilityDim, on_delete=models.CASCADE)
    stage_name = models.CharField(max_length=255)
    estimated_transit_time_to_next = models.DurationField()
    is_dispath_ready = models.BooleanField()


class RawNirDeviceDim(models.Model):
    device_id = models.AutoField(primary_key=True)
    make = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    owner = models.CharField(max_length=255)
    facility = models.ForeignKey(RawFacilityDim, on_delete=models.CASCADE)
    location_metadata_json = models.JSONField()


class RawMaterialUploadFact(models.Model):
    upload_id = models.AutoField(primary_key=True)
    batch_id = models.CharField(max_length=255)
    material = models.ForeignKey(RawMaterialDim, on_delete=models.CASCADE)
    source_type = models.CharField(max_length=100)
    upload_time = models.DateTimeField()
    stage = models.CharField(max_length=100)


class RawProductLinkFact(models.Model):
    product_id = models.AutoField(primary_key=True)
    batch = models.ForeignKey(RawMaterialUploadFact, on_delete=models.CASCADE)
    category = models.CharField(max_length=255)
    SKU = models.CharField(max_length=255)
    brand = models.CharField(max_length=255)
    quantity_output_kg = models.FloatField()


class RawMarketplaceListingFact(models.Model):
    listing_id = models.AutoField(primary_key=True)
    facility = models.ForeignKey(RawFacilityDim, on_delete=models.CASCADE)
    material = models.ForeignKey(RawMaterialDim, on_delete=models.CASCADE)
    quantity = models.FloatField()
    timestamp = models.DateTimeField()
    status = models.CharField(max_length=100)


class RawInputManualFact(models.Model):
    input_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(RawUserDim, on_delete=models.CASCADE)
    stage = models.CharField(max_length=100)
    material = models.ForeignKey(RawMaterialDim, on_delete=models.CASCADE)
    facility = models.ForeignKey(RawFacilityDim, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    values_json = models.JSONField()
    source_type = models.CharField(max_length=100)


class RawInputGSheetFact(models.Model):
    sheet_id = models.CharField(primary_key=True, max_length=255)
    source_url = models.URLField()
    import_timestamp = models.DateTimeField()
    row_hash = models.CharField(max_length=255)
    stage = models.CharField(max_length=100)
    facility = models.ForeignKey(RawFacilityDim, on_delete=models.CASCADE)


class RawInputRFIDFact(models.Model):
    tag_id = models.CharField(primary_key=True, max_length=255)
    batch_id = models.CharField(max_length=255)
    facility = models.ForeignKey(RawFacilityDim, on_delete=models.CASCADE)
    scan_time = models.DateTimeField()
    context_json = models.JSONField()


class RawInputNIRFact(models.Model):
    scanner_id = models.CharField(primary_key=True, max_length=255)
    facility = models.ForeignKey(RawFacilityDim, on_delete=models.CASCADE)
    scan_time = models.DateTimeField()
    composition_json = models.JSONField()
    stage = models.CharField(max_length=100)


class RawOrderSubmissionFact(models.Model):
    order_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(RawUserDim, on_delete=models.CASCADE)
    material_ids = models.JSONField()
    timestamp = models.DateTimeField()
    quantity_kg = models.FloatField()
    unit_mapping_json = models.JSONField()


