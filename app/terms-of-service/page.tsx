"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  TimerReset,
  FileText,
  Mail,
  Building2,
  UserCheck,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-foreground">
            BizWapp Terms of Service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-10 text-sm text-muted-foreground">
          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <FileText className="w-5 h-5" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using any of the services provided by BizWapp, including our APIs,
              dashboards, or documentation, you agree to comply with and be bound by these Terms of Service.
              If you do not agree, you may not access or use our services.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <UserCheck className="w-5 h-5" />
              2. Eligibility
            </h2>
            <p>
              You must be at least 18 years old and capable of forming a binding contract in your jurisdiction
              to use BizWapp. You may use the platform on behalf of an organization only if authorized.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <ShieldCheck className="w-5 h-5" />
              3. Account Security
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your API credentials and account information.
              You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <ShieldAlert className="w-5 h-5" />
              4. Acceptable Use Policy
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>You may not use BizWapp for illegal, harmful, or abusive purposes.</li>
              <li>You must not interfere with or disrupt the integrity or performance of our services.</li>
              <li>You agree not to reverse-engineer, copy, or exploit the platform without permission.</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Globe className="w-5 h-5" />
              5. API Usage Limits
            </h2>
            <p>
              BizWapp may impose limits on the number of API requests per day or per second to ensure fair usage.
              Exceeding these limits may result in throttling or suspension of access.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <TimerReset className="w-5 h-5" />
              6. Modification of Terms
            </h2>
            <p>
              BizWapp reserves the right to modify these Terms at any time. Updates will be posted on this page.
              Continued use of our services after changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Building2 className="w-5 h-5" />
              7. Termination
            </h2>
            <p>
              We may suspend or terminate your access to BizWapp without notice if we determine you violated
              these Terms. You may stop using our services at any time.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Mail className="w-5 h-5" />
              8. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about these Terms, please contact our support team:
              <br />
              <a href="mailto:bizwapp@solutioneers.in" className="text-primary underline">
                bizwapp@solutioneers.in
              </a>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
