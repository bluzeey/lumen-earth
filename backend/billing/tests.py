from django.test import TestCase

from .models import OutCertificateIssueLogFact, OutCreditGrantLogFact


class BillingModelTests(TestCase):
    def test_create_certificate_issue_log(self):
        log = OutCertificateIssueLogFact.objects.create(description="example")
        self.assertIsNotNone(log.id)

    def test_create_credit_grant_log(self):
        log = OutCreditGrantLogFact.objects.create(amount=5)
        self.assertEqual(log.amount, 5)
