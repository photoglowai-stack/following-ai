import CheckoutExperience from "./checkout-experience";

type CheckoutPageProps = {
  searchParams?: Promise<{
    username?: string;
    type?: string;
  }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const username = typeof params?.username === "string" ? params.username : "";
  const type = params?.type === "followers" || params?.type === "following" ? params.type : "both";

  return <CheckoutExperience initialUsername={username} initialType={type} />;
}
