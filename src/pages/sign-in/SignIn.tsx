import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { SignInForm } from "@/pages/sign-in/SignInForm.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function onSignInSuccess() {
    const redirect = searchParams.get("redirect");
    navigate(redirect ? `${redirect}` : "/");
  }
  return (
    <div>
      <Card className={"w-[420px] mx-auto mt-48"}>
        <CardHeader>
          <CardTitle className={"text-center"}>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm onSuccess={onSignInSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}

export default SignIn;
