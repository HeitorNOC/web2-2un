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

export async function createInstructor(data: {
    name: string
    email: string
    cpf: string
    password: string
    image?: string
    phone?: string
    cref?: string
    }
    ) {
    try {
      const user = await db.user.create({
        data: {
          name: data.name,
          email: data.email,
          cpf: data.cpf,
          password: data.password,
          image: data.image,
          role: 'INSTRUCTOR',
          isActive: true,
          InstructorAdditionalData: {
            create: {
              phone: data.phone,
              cref: data.cref,
            },
          },
        },
        include: {
          InstructorAdditionalData: true,
        },
      })
  
      return user
    } catch (error) {
      console.error('Erro ao criar o instrutor:', error)
      throw new Error('Erro ao criar o instrutor.')
    }
  }

export async function getInstructors() {
    try {
        const instructors = await db.user.findMany({
            where: {
                role: 'INSTRUCTOR',
            },
            include: {
                InstructorAdditionalData: true,
            },
        })

        return {
            instructors,
            total: instructors.length 
        }
    } catch (error) {
        console.error('Erro ao buscar os instrutores:', error)
        throw new Error('Erro ao buscar os instrutores.')
    }
}

export async function updateInstructor(
    id: string,
    data: {
      name?: string
      email?: string
      password?: string
      image?: string
      phone?: string
      cref?: string
    }
  ) {
    try {
      const updateData: any = {
        name: data.name,
        email: data.email,
        password: data.password,
        image: data.image,
      }
  
      if (data.phone || data.cref) {
        updateData.InstructorAdditionalData = {
          update: {
            phone: data.phone,
            cref: data.cref,
          },
        }
      }
  
      const user = await db.user.update({
        where: {
          id: id,
        },
        data: updateData,
        include: {
          InstructorAdditionalData: true,
        },
      })
  
      return user
    } catch (error) {
      console.error('Erro ao atualizar o instrutor:', error)
      throw new Error('Erro ao atualizar o instrutor.')
    }
  }

export async function deleteInstructor(id: string) {
    try {
        console.log(id)
        await db.user.delete({
            where: {
                id: id,
            },
        })
        return { success: true }
    } catch (error) {
        console.error('Erro ao excluir o instrutor:', error)
        throw new Error('Erro ao excluir o instrutor.')
    }
}
