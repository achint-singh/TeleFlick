import NextAuth from "next-auth/next";
import {options} from "./options";

/* this is the route handler file
we have defined NextAuth and passed in the options object in the other file
When the GET and POST methods are hit, they will be the result of the handler function 
*/

const handler = NextAuth(options);
export { handler as GET, handler as POST };