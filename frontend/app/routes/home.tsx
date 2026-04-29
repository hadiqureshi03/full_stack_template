import { redirect } from "react-router";

export function loader() {
  return redirect("/perioder");
}

export default function Home() {
  return null;
}
