export const STUDENT_LINKS = [
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
    path: "/profile",
  },
  {
    title: "Settings",
    path: "/settings",
  },
  {
    title: "Machines",
    path: "/machines"
  }
]

export const INSTRUCTOR_LINKS = [
  {
    title: "Perfil",
    path: "/profile",
  },
  {
    title: "Settings",
    path: "/settings",
  },
]

export const ROLES = {
  INSTRUCTOR: "INSTRUCTOR",
  STUDENT: "STUDENT",
  ADMIN: "ADMIN"
}

export interface Link {
  title: string
  path: string
}

export interface RoleLinks {
  ADMIN: Link[]
  INSTRUCTOR: Link[]
  STUDENT: Link[]
}

export const links: RoleLinks = {
  ADMIN: ADMIN_LINKS,
  INSTRUCTOR: INSTRUCTOR_LINKS,
  STUDENT: STUDENT_LINKS
}
