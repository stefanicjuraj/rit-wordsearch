export const sanitizeEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const sanitizeString = (input: string) =>
  input.replace(/[^a-zA-Z0-9 .,!?'"-]/g, "");

export const sanitizeInput = ({
  message,
  uid,
  email,
  displayName,
}: {
  message: string;
  uid: unknown;
  email: string;
  displayName: string;
}): { message: string; uid: unknown; email: string; displayName: string } => {
  if (
    typeof message !== "string" ||
    typeof displayName !== "string" ||
    !sanitizeEmail(email) ||
    (typeof uid !== "string" && typeof uid !== "number")
  ) {
    throw new Error("Invalid input types or formats");
  }

  return {
    message: sanitizeString(message),
    uid,
    email,
    displayName: sanitizeString(displayName),
  };
};
