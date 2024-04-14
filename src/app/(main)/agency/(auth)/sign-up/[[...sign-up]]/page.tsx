import { SignUp } from "@clerk/nextjs";
import { constructMetadata } from "@/lib/utils";

const SignUpPage = () => {
  return <SignUp />;
};
export default SignUpPage;

export const metadata = constructMetadata({
  title: "Sign Up | AgencyFlow",
});
