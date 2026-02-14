import RedirectButton from "../RedirectButton";
import { User } from "lucide-react";

const UserProfileButton = () => {
  return (
    <RedirectButton
      Icon={User}
      redirectTo="/profile"
      variant="outline"
      IconHeight={16}
      IconWidth={16}
    />
  );
};

export default UserProfileButton;
