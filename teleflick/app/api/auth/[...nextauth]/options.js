// set up how you want people to authenticate with your application
import GoogleProvider from "next-auth/providers/google";
import { sql, createPool } from '@vercel/postgres';

const pool = createPool({
    connectionString: process.env.DATABASE_URL,
});

export const options = {
    providers: [
        GoogleProvider({
            async profile(profile) {
                console.log("Profile Google: ", profile);
                try {
                    await sql`CREATE TABLE IF NOT EXISTS users ( id serial primary key, name varchar(255), email varchar(255) );`;
                } catch (error) {
                    console.log(error);
                }

                // try {
                //     sql`INSERT INTO users (name, email) 
                //     SELECT '${profile.name}', '${profile.email}'
                //     WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = '${profile.email}')
                //     ON CONFLICT (email) DO NOTHING;`                    
                //   } catch (error) {
                //         console.log(error);
                //   }

            //   console.log(`Created "customers" table`);
          
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
        },
        async signIn({ user, account, profile }) {
            if (account.provider === 'google') {
                // Extract user data from the Google profile
                const { name, email } = profile;
                // Insert the user into the database only if the email does not exist
                try {
                    const client = await pool.connect();
                    const queryText = `
                        INSERT INTO users (name, email)
                        VALUES ($1, $2)
                        ON CONFLICT (email) DO NOTHING;
                    `;
                    const queryValues = [name, email];
                    await client.query(queryText, queryValues);
                    client.release();
                } catch (error) {
                    console.error('Error inserting user into database:', error);
                    // Handle error as needed
                }
            }
            return true; // Return true to allow sign in
        }
    }
};