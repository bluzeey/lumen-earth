from django.db import models


class OutInventoryTraceFact(models.Model):
    trace_id = models.AutoField(primary_key=True)
    batch_id = models.CharField(max_length=255)
    facility = models.ForeignKey('raw_data.RawFacilityDim', on_delete=models.CASCADE)
    material = models.ForeignKey('raw_data.RawMaterialDim', on_delete=models.CASCADE)
    path_hash = models.CharField(max_length=255)
    cert_refs = models.JSONField()
    timestamp = models.DateTimeField()
    location_stage = models.ForeignKey('raw_data.RawLocationStageDim', on_delete=models.CASCADE)
    stage = models.CharField(max_length=100)


class OutBlockchainCommitLog(models.Model):
    commit_id = models.AutoField(primary_key=True)
    linked_table = models.CharField(max_length=255)
    linked_id = models.CharField(max_length=255)
    hash = models.CharField(max_length=255)
    tx_hash = models.CharField(max_length=255)
    commit_date = models.DateTimeField()


class OutCertificateIssueLogFact(models.Model):
    cert_id = models.AutoField(primary_key=True)
    batch_id = models.CharField(max_length=255)
    material = models.ForeignKey('raw_data.RawMaterialDim', on_delete=models.CASCADE)
    cert_type = models.CharField(max_length=100)
    issue_date = models.DateField()
    verifier_id = models.CharField(max_length=255)
    zk_hash = models.CharField(max_length=255)


class OutCreditGrantLogFact(models.Model):
    credit_id = models.AutoField(primary_key=True)
    batch_id = models.CharField(max_length=255)
    carbon_tonnes = models.FloatField()
    certificate = models.ForeignKey(OutCertificateIssueLogFact, on_delete=models.CASCADE)
    price = models.FloatField()
    methodology_ref = models.CharField(max_length=255)
    grant_date = models.DateField()


class OutMarketplaceActiveListingFact(models.Model):
    listing = models.OneToOneField('raw_data.RawMarketplaceListingFact', on_delete=models.CASCADE, primary_key=True)
    inventory = models.ForeignKey('process_data.ProcInventoryFact', on_delete=models.CASCADE)
    current_status = models.CharField(max_length=100)
    offer_price = models.FloatField()
    buyer_id = models.CharField(max_length=255, null=True, blank=True)


class OutAuditReportDim(models.Model):
    report_id = models.AutoField(primary_key=True)
    report_type = models.CharField(max_length=100)
    generation_date = models.DateField()
    linked_cert_ids = models.JSONField()
    reviewer_id = models.CharField(max_length=255)

