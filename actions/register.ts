'use server'

import { db } from "@/lib/db";

import bcrypt from "bcryptjs"

import { RegisterSchema } from "@/schema";
import * as z from "zod"
import { getUserByEmail } from "@/data/user";


export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email, password, name  } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email already exist!"}
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    // TODO: Send Verification token email

    return { success: "User Created Successfully!" };
    
}