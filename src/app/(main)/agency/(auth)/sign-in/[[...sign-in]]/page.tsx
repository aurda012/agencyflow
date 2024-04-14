import { SignIn } from "@clerk/nextjs";
import { constructMetadata } from "@/lib/utils";

const SignInPage = () => {
  return <SignIn />;
};
export default SignInPage;

export const metadata = constructMetadata({
  title: "Sign In | AgencyFlow",
});
