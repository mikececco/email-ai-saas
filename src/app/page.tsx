import { UserButton, UserProfile } from "@clerk/nextjs";
import LinkAccountButton from "~/components/link-account-button";

export default async function Home() {

  return (

    <div>

      <h1 className="text-4xl font-bold">Hello World</h1>

      <LinkAccountButton />
      <UserButton />
    </div>
  );
}
