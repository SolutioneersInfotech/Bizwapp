import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  MessageSquare,
  Users,
  FileText,
  BarChart2,
  Shield,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-2 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/BIZWAPP.png"
              alt="Biz Wapp Logo"
              width={54}
              height={54}
            />
            <span className="text-3xl font-semibold" style={{ color: "#105a01" }}>
              BizWApp
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium px-5 py-2.5 rounded-md hover:bg-green-200 transition-colors"
            >
              Log In
            </Link>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-t from-green-100 to-muted py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Streamline Your Business Communication with WhatsApp
        </h1>
        <p className="text-xl text-muted-foreground">
          Connect with customers, automate responses, and manage
          conversations all in one place with our WhatsApp Business
          Messaging platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
        <Link href="/signup">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
        <a
          href="https://developers.facebook.com/docs/whatsapp/cloud-api"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More
        </a>
          </Button>
        </div>
          </div>
          <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md aspect-square">
          <Image
        src="/bizwapp_poster_1.png"
        alt="Whatsapp Business Messaging"
        width={500}
        height={500}
        className="object-contain"
          />
        </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Powerful Features for Your Business
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides everything you need to leverage WhatsApp for
              business communication and customer engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-primary" />}
              title="Messaging"
              description="Send and receive messages, manage conversations, and respond to customers in real-time."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary" />}
              title="Contact Management"
              description="Organize your contacts, create groups, and segment your audience for targeted messaging."
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-primary" />}
              title="Templates"
              description="Create and manage message templates for quick responses and consistent communication."
            />
            <FeatureCard
              icon={<BarChart2 className="h-8 w-8 text-primary" />}
              title="Analytics"
              description="Track message delivery, engagement, and customer interactions with detailed analytics."
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8 text-primary" />}
              title="Automation"
              description="Set up automated responses, welcome messages, and scheduled broadcasts to save time."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-primary" />}
              title="Security"
              description="End-to-end encryption and secure authentication to protect your business communications."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Connect your WhatsApp Business account and start engaging with your
            customers today.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">Sign Up Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-4">
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <Image
          src="/BIZWAPP.png"
          alt="Biz Wapp Logo"
          width={54}
          height={54}
        />
        <span className="text-lg font-semibold">BizWApp</span>
      </div>

      <div className="text-sm text-muted-foreground text-center md:text-left">
        &copy; 2025 Bizwapp (Solutioneers Infotech Private Limited). All rights reserved.
      </div>

      <div className="flex gap-4 mt-2 md:mt-0 text-sm text-muted-foreground">
        <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
        <a href="/terms-of-service" className="hover:underline">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>

    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
