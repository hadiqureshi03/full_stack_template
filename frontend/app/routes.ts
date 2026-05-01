import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("perioder", "routes/perioder.tsx"),
  route("adgangsstyring", "routes/brugere.tsx"),
  route("afsnit", "routes/afsnit.tsx"),
  route("personalegrupper", "routes/personalegrupper.tsx"),
  route("vagtlag", "routes/vagtlag.tsx"),
  route("ansaettelser", "routes/ansaettelser.tsx"),
  route("personale", "routes/personale.tsx"),
] satisfies RouteConfig;
