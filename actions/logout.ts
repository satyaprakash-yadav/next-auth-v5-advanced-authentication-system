'use server'

import { signOut } from "@/auth"

export const logout = async () => {
    // some server stuff (to remove user)
    await signOut();
}