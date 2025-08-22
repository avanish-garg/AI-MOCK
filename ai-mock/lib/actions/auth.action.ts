'use server';

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";
import { success } from "zod";

const ONE_WEEK = 60* 60 * 24 * 7;

//this function is handling registration of user's logic
export async function signUp(params : SignUpParams) {
    const {uid , name, email} = params;

    try {
        //we will sign-up a user
        
        const userRecord = await db.collection('users').doc(uid).get();//checking already exist krta hai kya 

        if(userRecord.exists) //agar user exist krta hai toh
         {
            return {
                success : false,
                message : "User already exists. Please sign in instead"
            }
        }

        //agar nhi krt toh
        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success : true,
            message : "Registered succesfully. Please sign in."

        }


    } catch(e : any) {
        console.error('Error creating a user', e);

        if(e.code === 'auth/email-already-exists') {
            return {
                success : false,
                message : 'This email is already in use.'
            }
        }

        return  {
            success : false, 
            message : 'Failed to create an account'
        }
    }
}


//this function is to handle login of user
export async function signIn(params : SignInParams) {
    const {email, idToken} = params;

    try {

        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord) {
            return {
                success : false,
                message : 'User does not exist. Create an account instead.'
            }
        }

        //if user exists 
        await setSessionCookie(idToken);

    } catch(e) {
        console.log(e);

        return {
            success : false,
            message : 'Failed to log into an account.'
        }
    }
}

//this function is to generate token and store it in cookie
export async function setSessionCookie(idToken : string) {
    const cookieStore = await cookies(); //this is coming next headers

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn : ONE_WEEK * 1000,
    })

    cookieStore.set('session', sessionCookie, {
        maxAge : ONE_WEEK,
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production', 
        path : '/', 
        sameSite : 'lax'
    })
}

//this function returns a promise either a user is there or not ? 
export async function getCurrentUser() : Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        //we need user from database
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if(!userRecord.exists) return null;

        return {
            ...userRecord.data(), 
            id : userRecord.id
        } as User;
    } catch(e) {
        console.log(e);

        return null;
    }
}

//check user is authenticated or not 
export async function isAuthenticated() {

    const user = await getCurrentUser();

    return !!user; //a little trick to convert a truthy or falsy value to convert into boolean variable
}