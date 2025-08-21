import {initializeApp, getApps, cert} from 'firebase-admin/app'

const initFirebaseAdmin = () => {
    const apps = getApps();

    if(!app.length) {
        initializeApp({
            credential : cert({
                projectId : process.env.FIREBASE_PROJECT_ID,
                clientEmail : process.env.FIREBASE_CLIENT_EMAIL,
                privateKey : process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") //this will help to git rid of the new line that we don't need
            })
        })
    }

    return {
        auth : getAuth(),
        db : getFirestore()
    }
}

export const {auth, db} = initFirebaseAdmin();