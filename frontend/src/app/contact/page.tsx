import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { PageHead } from "@/components/sections/PageHead";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main>
      <PageHead
        eyebrow="Contact"
        title={"Let's start a\nconversation."}
        description="Tell us about your project. The more detail you share, the sharper our first response will be."
        splitTitle
      />
      <ContactForm />
    </main>
  );
}
