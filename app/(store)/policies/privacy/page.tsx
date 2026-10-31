export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <article className="max-w-2xl space-y-4">
      <h1 className="font-serif text-4xl text-maroon">Privacy</h1>
      <p>
        Checkout details are used to validate your order and send emails. This version of the store does not save order records in the product database.
      </p>
      <p>
        Because emails are the retained order record, please keep your confirmation message. Contact the store if you want a submitted request reviewed.
      </p>
    </article>
  );
}
