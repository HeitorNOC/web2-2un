const ACTIVE = 1
const INACTIVE = 2

const PLAN_TYPE_ANNUAL = 1
const PLAN_TYPE_MONTHLY = 2

enum Roles {
    User = "instructor",
    Admin = "adm",
    Student = "user"
}

enum PaymentMethod {
    creditCard = 1,
    debitCard = 2,
    money = 3
}

export {
    Roles,
    ACTIVE,
    INACTIVE,
    PLAN_TYPE_ANNUAL,
    PLAN_TYPE_MONTHLY,
    PaymentMethod
}