export const STUDENT_LINKS = [
  {
    title: "Home",
    path: "/home"
  },
  {
    title: "Perfil",
    path: "/profile",
  },
  {
    title: "Pagamento",
    path: "/payment"
  },
  {
    title: "Treino",
    path: "/user-workout"
  },
  {
    title: "Evolução",
    path: "user-evolution"
  },
  {
    title: "Settings",
    path: "/settings",
  }
]

export const ADMIN_LINKS = [
  {
    title: "Home",
    path: "/home"
  },
  {
    title: "Perfil",
    path: "/profile",
  },
  {
    title: "Settings",
    path: "/settings",
  },
  {
    title: "Máquinas",
    path: "/machines"
  },
  {
    title: "Instrutores",
    path: "/instructors"
  },
  {
    title: "Usuários",
    path: "/users"
  },
  {
    title: "Dashboard",
    path: "/dashboard"
  }
]

export const INSTRUCTOR_LINKS = [
  {
    title: "Home",
    path: "/home"
  },
  {
    title: "Perfil",
    path: "/profile",
  },
  {
    title: "Associar aluno",
    path: "/link-user"
  },
  {
    title: "Treino",
    path: "/training"
  },
  {
    title: "Máquinas",
    path: "/machines"
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
