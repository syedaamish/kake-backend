import admin from 'firebase-admin';

export const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      // Prefer a single JSON env var if provided
      let serviceAccount: admin.ServiceAccount | undefined;
      const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

      if (saJson) {
        try {
          const parsed = JSON.parse(saJson);
          // Ensure private_key newlines are correct if it was stringified improperly
          if (typeof parsed.private_key === 'string') {
            parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
          }
          serviceAccount = parsed as admin.ServiceAccount;
        } catch (e) {
          console.error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON. Must be valid JSON string.');
          throw e;
        }
      } else {
        // Fallback to individual env vars
        const envProjectId = process.env.FIREBASE_PROJECT_ID || '';
        const envClientEmail = process.env.FIREBASE_CLIENT_EMAIL || '';
        const envPrivateKeyRaw = process.env.FIREBASE_PRIVATE_KEY || '';
        const envPrivateKey = envPrivateKeyRaw.replace(/\\n/g, '\n');

        // Validate required fields
        const missing: string[] = [];
        if (!envProjectId) missing.push('FIREBASE_PROJECT_ID');
        if (!envClientEmail) missing.push('FIREBASE_CLIENT_EMAIL');
        if (!envPrivateKey) missing.push('FIREBASE_PRIVATE_KEY');

        if (missing.length) {
          throw new Error(`Firebase Admin credentials missing required env vars: ${missing.join(', ')}`);
        }

        serviceAccount = {
          projectId: envProjectId,
          clientEmail: envClientEmail,
          privateKey: envPrivateKey,
        } as admin.ServiceAccount;
      }

      // Final safety check for project_id presence
      const projectId = (serviceAccount as any).projectId || (serviceAccount as any).project_id || process.env.FIREBASE_PROJECT_ID;
      if (!projectId || typeof projectId !== 'string') {
        throw new Error('Service account object must contain a string "project_id" property (set FIREBASE_PROJECT_ID or include in JSON).');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId,
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
