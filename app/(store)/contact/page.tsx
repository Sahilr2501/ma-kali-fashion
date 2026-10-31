import { ContactForm } from "@/components/ContactForm";
import { storeContact } from "@/lib/constants";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  const contact = storeContact();

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <h1 className="font-serif text-4xl text-maroon">Contact</h1>
        <p className="mt-3 text-[#5c534b]">
          Questions about sizes, jewellery care, or an order email can be sent here. Please include your order reference if you have one.
        </p>
        <div className="mt-6 space-y-1 text-sm">
          {contact.phone ? <p>{contact.phone}</p> : null}
          {contact.email ? <p>{contact.email}</p> : null}
          {contact.address ? <p>{contact.address}</p> : null}
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
