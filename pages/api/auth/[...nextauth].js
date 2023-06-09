import { PrismaClient } from '@prisma/client';
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import prisma from '../../../lib/prisma';


export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  secret: process.env.SESSION_SECRET,
  callbacks: {
    async signIn({user, account, profile}) {
      const existingUser = await prisma.user.findFirst({
        where:{
          [`${account.provider}Id`] : user.id
        },
        include:{
          role:true
        }
      });

      if (!existingUser) {
        // Create the user in your database
        const newUser = await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            [`${account.provider}Id`] : user.id,
            // Set other user properties as needed
          },
          include:{
            role:true
          }
        });
             // Return the updated token object
      return true
      }
        // Return the updated token object
      return true
  },
    async session({session, token, user}) {

      const existingUser = await prisma.user.findFirst({
        where:{
          email: session.user.email
        },
        include:{
          role:true
        }
      });

      //combine nextauth user with db user props
      //session.accessToken = ``;
      session.user = { ...session.user, ...existingUser};
      //make role the string, rather than the embedded role object
      session.user.role = existingUser.role.name;
      return session;
    },
  },
}

export default NextAuth(authOptions)