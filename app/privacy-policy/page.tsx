"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Users,
  Globe,
  FileText,
  Mail,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 17, 2025";

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-start mb-8">
          <Link
            href="/"
            className="text-sm text-primary hover:underline mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Welcome to <strong>BizWapp</strong> ("we," "our," or "us"). We are
              committed to protecting your privacy and ensuring the security of
              your personal information. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our WhatsApp Business API integration platform and related
              services.
            </p>
            <p>
              By using BizWapp’s services, you agree to the collection and use
              of information in accordance with this Privacy Policy. If you do
              not agree with our policies and practices, please do not use our
              services.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Personal Information
              </h3>
              <ul className="space-y-4">
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Facebook Platform Data:
                  </span>{" "}
                  When you use{" "}
                  <span className="font-medium text-blue-600">BizWapp</span>{" "}
                  through Login or other Meta integration, we collect your
                  public profile information (name, profile picture), email
                  address, and page-related data necessary to manage WhatsApp
                  Business accounts. This data is handled in accordance with
                  Facebook's Platform Terms and used solely to provide and
                  improve our services.
                </li>
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Facebook Data Use:
                  </span>{" "}
                  We access and use Facebook Platform Data in accordance with
                  Meta's policies, including to authenticate users, manage
                  WhatsApp Business accounts, and facilitate message delivery.
                  We do not sell or misuse Facebook data in any way. This data
                  is only shared with Meta as required for WhatsApp Business API
                  operations.
                </li>
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Account Information:
                  </span>{" "}
                  Name, email address, phone number, business name, and business
                  category.
                </li>
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Authentication Data:
                  </span>{" "}
                  WhatsApp Business Account ID, Phone Number ID, and access
                  tokens.
                </li>
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Business Information:
                  </span>{" "}
                  Company website, business description, and verification
                  documents.
                </li>
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Contact Information:
                  </span>{" "}
                  Customer contact details including phone numbers and names.
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Message Data</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Message content sent and received through BizWapp</li>
                <li>Message delivery status and read receipts</li>
                <li>Message templates and their usage statistics</li>
                <li>Conversation metadata and analytics</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">
                Technical Information
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP addresses and device information</li>
                <li>Browser type and version</li>
                <li>Usage patterns and feature interactions</li>
                <li>Error logs and performance data</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use the collected information to:</p>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Service Provision */}
              <div className="space-y-3">
                <h4 className="font-semibold">Service Provision</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Facilitate WhatsApp Business API integration via BizWapp
                  </li>
                  <li>Process and deliver messages</li>
                  <li>Manage your account and preferences</li>
                  <li>Provide customer support</li>
                </ul>
              </div>

              {/* Analytics */}
              <div className="space-y-3">
                <h4 className="font-semibold">Analytics & Improvement</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Generate usage analytics and reports</li>
                  <li>Improve BizWapp services and features</li>
                  <li>Monitor system performance</li>
                  <li>Detect and prevent fraud</li>
                </ul>
              </div>

              {/* Communication */}
              <div className="space-y-3">
                <h4 className="font-semibold">Communication</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Send service notifications</li>
                  <li>Provide technical support</li>
                  <li>Share product updates</li>
                  <li>Respond to inquiries</li>
                </ul>
              </div>

              {/* Legal Compliance */}
              <div className="space-y-3">
                <h4 className="font-semibold">Legal Compliance</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Comply with legal obligations</li>
                  <li>Enforce our terms of service</li>
                  <li>Protect our rights and property</li>
                  <li>Ensure platform security</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sharing Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Information Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>BizWapp may share your data:</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">With Meta/WhatsApp</h4>
                <p className="text-sm">
                  For WhatsApp Business API functionality, including
                  verification and message delivery.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Service Providers</h4>
                <p className="text-sm">
                  We partner with third-party vendors for cloud hosting,
                  analytics, and support services.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Legal Requirements</h4>
                <p className="text-sm">
                  If required by law or to protect our legal rights.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Business Transfers</h4>
                <p className="text-sm">
                  In case of acquisition or merger, your data may be transferred
                  to the new entity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>BizWapp implements security measures including:</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Technical Safeguards</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>End-to-end encryption</li>
                  <li>HTTPS encryption</li>
                  <li>Regular audits</li>
                  <li>Strict access control</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Organizational Measures</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Employee training</li>
                  <li>Need-to-know access</li>
                  <li>Security assessments</li>
                  <li>Incident response plan</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              However, no system is 100% secure. Use BizWapp at your own
              discretion.
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Account Data:</strong> Retained while account is active,
                deleted after 30 days of deactivation
              </li>
              <li>
                <strong>Messages:</strong> Stored for up to 90 days
              </li>
              <li>
                <strong>Analytics:</strong> Retained indefinitely in anonymized
                form
              </li>
              <li>
                <strong>Legal:</strong> Retained as required by law
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold">Access & Portability</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>View or export your data</li>
                  <li>Understand data usage</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Manage & Delete</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Request data deletion</li>
                  <li>Update incorrect information</li>
                  <li>Restrict processing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>International Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              Your data may be processed outside your country. BizWapp ensures:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Standard contractual clauses</li>
              <li>Legal adequacy approvals</li>
              <li>Certification schemes</li>
            </ul>
          </CardContent>
        </Card>

        {/* Children */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              BizWapp is not intended for children under 13. We do not knowingly
              collect data from minors.
            </p>
          </CardContent>
        </Card>

        {/* Changes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>BizWapp may update this policy. You will be notified via:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Our website</li>
              <li>Email</li>
              <li>In-app notification</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>For any queries regarding privacy:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-sm">bizwapp@solutioneers.in</p>
              </div>
              <div>
                <h4 className="font-semibold">DPO</h4>
                <p className="text-sm">dpo@solutioneers.com</p>
              </div>
              <div>
                <h4 className="font-semibold">Phone</h4>
                <p className="text-sm">+917376700783</p>
              </div>
              <div>
                <h4 className="font-semibold">Address</h4>
                <p className="text-sm">
                  solutioneers Infotech
                  <br />
                  Indira Nagar
                  <br />
                  Lucknow , Uttar Pradesh
                  <br />
                  India
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 border-t">
          <Button asChild variant="outline">
            <Link href="/terms-of-service">View Terms of Service</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/help-support">Contact Support</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
