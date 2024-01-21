import { validateNotBlank } from "@src/app/util/validation";

export function getHeaderWithAuthorization(accessToken: string): Record<string, unknown> {
    validateNotBlank(accessToken, "accessToken");

    return { headers: { 'Authorization': `Bearer ${accessToken}` } };
}