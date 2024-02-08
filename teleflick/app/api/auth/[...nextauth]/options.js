// set up how you want people to authenticate with your application
import GoogleProvider from "next-auth/providers/google";

export const options = {
    providers: [
        GoogleProvider({
            profile(profile) {
                console.log("Profile Google: ", profile);

                const createTable = client.sql`
                CREATE TABLE IF NOT EXISTS users (
                  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                  name VARCHAR(255) NOT NULL,
                  email VARCHAR(255) NOT NULL,
                );
              `;
                
                createTable();

          
              console.log(`Created "customers" table`);
          
            //   // Insert data into the "customers" table
            //   const insertedCustomers = await Promise.all(
            //     customers.map(
            //       (customer) => client.sql`
            //       INSERT INTO customers (id, name, email, image_url)
            //       VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
            //       ON CONFLICT (id) DO NOTHING;
            //     `,
            //     ),

            //     const user = await sql<User>`SELECT * FROM users WHERE email=${email}`
                return {
                    ...profile,
                    id: profile.sub,
                };
            },
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_Secret
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) token.role = user.role;
            return token;
        },
        async session({session, token}) {
            if (session?.user) session.user.role = token.role;
            return session;
        }
    }
};