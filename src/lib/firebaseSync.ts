import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  writeBatch,
  query,
  orderBy
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, ensureSilentAuth } from './firebase';
import { 
  INITIAL_COMMUNITIES, 
  INITIAL_INCIDENTS, 
  INITIAL_MARKETPLACE, 
  INITIAL_GROUP_MESSAGES, 
  INITIAL_BROADCASTS 
} from '../utils/initialData';
import { UserProfile } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'user_resident_1',
    name: 'Amit Patel',
    phone: '+91 94501 23456',
    role: 'Resident',
    villageId: 'up_baheri',
    isVerified: true,
    joinedAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    uid: 'user_resident_2',
    name: 'Sanjay Yadav',
    phone: '+91 91223 34455',
    role: 'Resident',
    villageId: 'up_faridpur',
    isVerified: true,
    joinedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    uid: 'user_resident_3',
    name: 'Vijay Maurya',
    phone: '+91 99887 76655',
    role: 'Resident',
    villageId: 'up_baheri',
    isVerified: false,
    joinedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    uid: 'user_pradhan_1',
    name: 'Pradhan Rajesh Kumar',
    phone: '+91 98765 43210',
    role: 'Gram Pradhan',
    villageId: 'up_baheri',
    isVerified: true,
    joinedAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    uid: 'user_pradhan_2',
    name: 'Pradhan Shanti Devi',
    phone: '+91 94567 11223',
    role: 'Gram Pradhan',
    villageId: 'up_faridpur',
    isVerified: true,
    joinedAt: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    uid: 'user_dm_1',
    name: 'Shri Manoj Kumar (DM Bareilly)',
    phone: '+91 91122 33445',
    role: 'DM',
    villageId: 'up_baheri',
    isVerified: true,
    joinedAt: new Date(Date.now() - 30 * 86400000).toISOString()
  }
];

// Helper to seed standard collections if empty on first runtime initialize
export async function seedInitialDataIfEmpty() {
  await ensureSilentAuth();
  
  const collectionsToSeed = [
    { name: 'villages', data: INITIAL_COMMUNITIES },
    { name: 'users', data: INITIAL_USERS },
    { name: 'incidents', data: INITIAL_INCIDENTS },
    { name: 'marketplace', data: INITIAL_MARKETPLACE },
    { name: 'groupMessages', data: INITIAL_GROUP_MESSAGES },
    { name: 'broadcasts', data: INITIAL_BROADCASTS }
  ];

  for (const colSpec of collectionsToSeed) {
    try {
      const colRef = collection(db, colSpec.name);
      const snap = await getDocs(colRef);
      
      if (snap.empty) {
        console.log(`Seeding empty collection "${colSpec.name}" with default values...`);
        const batch = writeBatch(db);
        
        colSpec.data.forEach((item: any) => {
          const docRef = doc(db, colSpec.name, item.id);
          batch.set(docRef, item);
        });
        
        await batch.commit();
        console.log(`Succesfully seeded "${colSpec.name}".`);
      }
    } catch (err) {
      console.warn(`Seeding not fully complete for ${colSpec.name} (This is normal under strict auth simulation): `, err);
    }
  }
}

/**
 * Generic real-time subscription helper for any Firestore collection.
 */
export function subscribeCollection<T>(
  collectionName: string, 
  onUpdate: (data: T[]) => void, 
  onFailure?: (err: any) => void
) {
  const colRef = collection(db, collectionName);
  
  // For group messages and broadcasts, sort chronologically if desirable
  let q = colRef;
  
  return onSnapshot(
    q, 
    (snapshot) => {
      const items: T[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...docSnap.data() } as T);
      });
      onUpdate(items);
    },
    (error) => {
      console.error(`Subscription error on ${collectionName}:`, error);
      if (onFailure) {
        onFailure(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, collectionName);
      }
    }
  );
}

/**
 * Persists a new item in a designated collection in Firestore.
 */
export async function saveRecord(collectionName: string, id: string, data: any) {
  await ensureSilentAuth();
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, data);
    console.log(`Successfully saved document ${id} to ${collectionName}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionName}/${id}`);
  }
}

/**
 * Updates dynamic fields in an existing document.
 */
export async function updateRecord(collectionName: string, id: string, updatedFields: any) {
  await ensureSilentAuth();
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, updatedFields);
    console.log(`Successfully updated document ${id} in ${collectionName}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${id}`);
  }
}

/**
 * Deletes a record from Firestore.
 */
export async function deleteRecord(collectionName: string, id: string) {
  await ensureSilentAuth();
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    console.log(`Successfully deleted document ${id} in ${collectionName}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
  }
}
