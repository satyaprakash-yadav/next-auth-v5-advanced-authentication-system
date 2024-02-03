'use server'

import { db } from "@/lib/db";

import bcrypt from "bcryptjs"

import { RegisterSchema } from "@/schema";
import * as z from "zod"
import { getUserByEmail } from "@/data/user";

import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";


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

    const verificationToken = await generateVerificationToken(email);
    // TODO: Send Verification token email
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
    );

    // User Created Successfully
    return { success: "Confirmation email sent!" };
    
}