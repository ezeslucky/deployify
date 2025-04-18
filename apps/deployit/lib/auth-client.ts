import { organizationClient } from "better-auth/client/plugins";
import { twoFactorClient } from "better-auth/client/plugins";
import { apiKeyClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"


export const  authCliend = createAuthClient({
    plugins: [organizationClient(),twoFactorClient(),apiKeyClient()]
})