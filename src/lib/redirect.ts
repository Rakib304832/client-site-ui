export function getSafePath(from: string | null): string{
    if (!from) return "/studios";
    if(!from.startsWith("/") || from.startsWith("//")) return "/studios"
    return from;

}