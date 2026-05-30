import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize core Firebase Applet
const app = initializeApp(firebaseConfig);

// DB & Auth Export (Critical for app lifecycle)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Strict Error Types as specified in the Firebase Skill Guide
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Custom High-Fidelity error handler.
 * Mandatory to format errors as highly structured JSON for CORTEX diagnostics.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Security Rule Violation or Quota Block: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validate connection to Firestore on initial boot.
 */
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test-connection-doc-holder', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration: Client is offline.");
    }
  }
}

/**
 * Perform automatic silent authentication if not signed in,
 * ensuring all Firestore rules work seamlessly under a valid auth token.
 */
export async function ensureSilentAuth() {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
      console.log('Successfully signed in anonymously for secure Firestore synchronization: ', auth.currentUser?.uid);
    } catch (err) {
      console.warn('Silent anonymous sign-in status (unauthenticated fallback active): ', err);
    }
  }
}
export { signInAnonymously };
