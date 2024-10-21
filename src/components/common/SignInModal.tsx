import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { SignInForm } from "@/pages/sign-in/SignInForm.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "@/common/constant/query-key.ts";
import AuthService from "@/services/auth.service.ts";
import { useAppDispatch } from "@/hooks";
import { signIn } from "@/store/user/userSlice.ts";

export function SignInModal(props: {
  open: boolean;
  onOpenChange: (value: ((prevState: boolean) => boolean) | boolean) => void;
}) {
  const { open, onOpenChange } = props;
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  async function handleSignInSuccess() {
    const data = await queryClient.fetchQuery({
      queryKey: [QueryKey.Me],
      queryFn: AuthService.me,
    });
    dispatch(signIn(data));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={"text-2xl"}>Sign In</DialogTitle>
          <DialogDescription>
            Please sign in to use this feature
          </DialogDescription>
        </DialogHeader>
        <div className={"mt-8"}>
          <SignInForm onSuccess={handleSignInSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
