"use server"

import { ROLES } from "@/app/(protected)/_constants"
import { db } from "@/lib/db"

export async function fetchInstructorsAction() {

    const res = await db.user.findMany({
        where: {
            role: ROLES.INSTRUCTOR
        },
        include: {
            InstructorAdditionalData: true
        },
    })

    return {
        success: res
    }
}