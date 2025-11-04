import admin from 'firebase-admin';

export const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      const serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      console.log('🔥 Firebase Admin SDK initialized successfully');
    }
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error);
    process.exit(1);
  }
};

// Firebase Auth service
export class FirebaseAuthService {
  static async verifyIdToken(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return {
        success: true,
        uid: decodedToken.uid,
        phoneNumber: decodedToken.phone_number,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        customClaims: decodedToken,
      };
    } catch (error) {
      console.error('Firebase token verification failed:', error);
      return {
        success: false,
        error: 'Invalid or expired token',
      };
    }
  }

  static async getUserByUID(uid: string) {
    try {
      const userRecord = await admin.auth().getUser(uid);
      return {
        success: true,
        user: {
          uid: userRecord.uid,
          phoneNumber: userRecord.phoneNumber,
          email: userRecord.email,
          emailVerified: userRecord.emailVerified,
          disabled: userRecord.disabled,
          metadata: {
            creationTime: userRecord.metadata.creationTime,
            lastSignInTime: userRecord.metadata.lastSignInTime,
          },
        },
      };
    } catch (error) {
      console.error('Firebase get user failed:', error);
      return {
        success: false,
        error: 'User not found',
      };
    }
  }

  static async setCustomClaims(uid: string, claims: object) {
    try {
      await admin.auth().setCustomUserClaims(uid, claims);
      return { success: true };
    } catch (error) {
      console.error('Firebase set custom claims failed:', error);
      return { success: false, error: 'Failed to set custom claims' };
    }
  }

  static async deleteUser(uid: string) {
    try {
      await admin.auth().deleteUser(uid);
      return { success: true };
    } catch (error) {
      console.error('Firebase delete user failed:', error);
      return { success: false, error: 'Failed to delete user' };
    }
  }

  static async listUsers(maxResults: number = 1000, pageToken?: string) {
    try {
      const listUsersResult = await admin.auth().listUsers(maxResults, pageToken);
      return {
        success: true,
        users: listUsersResult.users,
        pageToken: listUsersResult.pageToken,
      };
    } catch (error) {
      console.error('Firebase list users failed:', error);
      return { success: false, error: 'Failed to list users' };
    }
  }
}

export default admin;
