from django.db import models

class OutCertificateIssueLogFact(models.Model):
    """Record of certificate issuances."""
    issued_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)


class OutCreditGrantLogFact(models.Model):
    """Record of credit grants."""
    granted_at = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
