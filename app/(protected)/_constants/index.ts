export const USER_LINKS = [
  {
    title: "Perfil",
    path: "/profile",
  },
  {
    title: "Settings",
    path: "/settings",
  },
]

export const ADMIN_LINKS = [
  {
    title: "Admin",
    path: "/admin",
  },
  {
    title: "Settings",
    path: "/settings",
  },
]

export const PROF_LINKS = [
  {
    title: "Professor",
    path: "/client",
  },
  {
    title: "Settings",
    path: "/settings",
  },
]

export const ROLES = {
  PROF: "PROF",
  USER: "USER",
  ADMIN: "ADMIN"
}

export interface Link {
  title: string;
  path: string;
}

export interface RoleLinks {
  ADMIN: Link[];
  PROF: Link[];
  USER: Link[];
}

export const links: RoleLinks = {
  ADMIN: ADMIN_LINKS,
  PROF: PROF_LINKS,
  USER: USER_LINKS
};
