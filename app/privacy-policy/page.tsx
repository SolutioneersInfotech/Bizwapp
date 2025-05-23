"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, Shield, Eye, Lock, Users, Globe, FileText, Mail } from "lucide-react"

export default function PrivacyPolicyPage() {
  const lastUpdated = "December 15, 2024"

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-start mb-8">
          <Link href="/" className="text-sm text-primary hover:underline mb-4 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
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
              Welcome to WhatsApp Business Messaging Platform ("we," "our," or "us"). We are committed to protecting
              your privacy and ensuring the security of your personal information. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use our WhatsApp Business API integration
              platform and related services.
            </p>
            <p>
              By using our services, you agree to the collection and use of information in accordance with this Privacy
              Policy. If you do not agree with our policies and practices, please do not use our services.
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
              <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
              <p className="mb-3">We may collect the following types of personal information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Account Information:</strong> Name, email address, phone number, business name, and business
                  category
                </li>
                <li>
                  <strong>Authentication Data:</strong> WhatsApp Business Account ID, Phone Number ID, and access tokens
                </li>
                <li>
                  <strong>Business Information:</strong> Company website, business description, and verification
                  documents
                </li>
                <li>
                  <strong>Contact Information:</strong> Customer contact details including phone numbers and names
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Message Data</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Message content sent and received through our platform</li>
                <li>Message delivery status and read receipts</li>
                <li>Message templates and their usage statistics</li>
                <li>Conversation metadata and analytics</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Technical Information</h3>
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
            <p>We use the collected information for the following purposes:</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold">Service Provision</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Facilitate WhatsApp Business API integration</li>
                  <li>Process and deliver messages</li>
                  <li>Manage your account and preferences</li>
                  <li>Provide customer support</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Analytics & Improvement</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Generate usage analytics and reports</li>
                  <li>Improve our services and features</li>
                  <li>Monitor system performance</li>
                  <li>Detect and prevent fraud</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Communication</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Send service notifications</li>
                  <li>Provide technical support</li>
                  <li>Share product updates</li>
                  <li>Respond to inquiries</li>
                </ul>
              </div>
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

        {/* Information Sharing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Information Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We may share your information in the following circumstances:</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">With Meta/WhatsApp</h4>
                <p className="text-sm">
                  We share necessary information with Meta (WhatsApp) to facilitate the WhatsApp Business API
                  integration, including business verification data and message delivery information.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Service Providers</h4>
                <p className="text-sm">
                  We may share information with trusted third-party service providers who assist us in operating our
                  platform, such as cloud hosting providers, analytics services, and customer support tools.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Legal Requirements</h4>
                <p className="text-sm">
                  We may disclose information when required by law, court order, or government request, or to protect
                  our rights, property, or safety.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Business Transfers</h4>
                <p className="text-sm">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred as part
                  of the transaction.
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
            <p>
              We implement appropriate technical and organizational security measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Technical Safeguards</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>End-to-end encryption for message data</li>
                  <li>Secure HTTPS connections</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Organizational Measures</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Employee training on data protection</li>
                  <li>Limited access on a need-to-know basis</li>
                  <li>Regular security assessments</li>
                  <li>Incident response procedures</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              While we strive to protect your information, no method of transmission over the internet or electronic
              storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We retain your information for as long as necessary to provide our services and fulfill the purposes
              outlined in this Privacy Policy:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Account Information:</strong> Retained while your account is active and for 30 days after
                account deletion
              </li>
              <li>
                <strong>Message Data:</strong> Retained for up to 90 days for delivery and support purposes
              </li>
              <li>
                <strong>Analytics Data:</strong> Aggregated and anonymized data may be retained indefinitely
              </li>
              <li>
                <strong>Legal Requirements:</strong> Some data may be retained longer to comply with legal obligations
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Access and Portability</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Request access to your personal data</li>
                  <li>Receive a copy of your data in a portable format</li>
                  <li>Request information about data processing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Control and Deletion</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your data</li>
                  <li>Restrict or object to processing</li>
                </ul>
              </div>
            </div>
            <p className="text-sm">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section
              below.
            </p>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your information may be transferred to and processed in countries other than your country of residence.
              These countries may have different data protection laws than your country.
            </p>
            <p>
              When we transfer your information internationally, we ensure appropriate safeguards are in place to
              protect your data, including:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Standard contractual clauses approved by relevant authorities</li>
              <li>Adequacy decisions by regulatory bodies</li>
              <li>Certification schemes and codes of conduct</li>
            </ul>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our services are not intended for children under the age of 13 (or the minimum age in your jurisdiction).
              We do not knowingly collect personal information from children under 13.
            </p>
            <p>
              If you are a parent or guardian and believe your child has provided us with personal information, please
              contact us immediately. We will take steps to remove such information from our systems.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Privacy Policy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or
              legal requirements. We will notify you of any material changes by:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Posting the updated policy on our website</li>
              <li>Sending you an email notification</li>
              <li>Displaying a prominent notice in our application</li>
            </ul>
            <p>
              Your continued use of our services after the effective date of the updated Privacy Policy constitutes
              acceptance of the changes.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices,
              please contact us:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Email</h4>
                <p className="text-sm">privacy@whatsappbusiness.com</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Phone</h4>
                <p className="text-sm">+1 (555) 123-4567</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Address</h4>
                <p className="text-sm">
                  WhatsApp Business Platform
                  <br />
                  123 Business Street
                  <br />
                  San Francisco, CA 94105
                  <br />
                  United States
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                <p className="text-sm">dpo@whatsappbusiness.com</p>
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
  )
}
