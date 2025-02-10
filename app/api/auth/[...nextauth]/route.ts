import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Adjust the import path as needed

const handler = NextAuth(authOptions);

// Export only the valid HTTP method handlers
export { handler as GET, handler as POST };