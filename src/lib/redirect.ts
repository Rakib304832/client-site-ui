export function getSafePath(from: string | null): string{
    if (!from) return "/dashboard";
    if(!from.startsWith("/") || from.startsWith("//")) return "/dashboard"
    return from;

}