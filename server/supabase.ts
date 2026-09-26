import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createStarterUserData, seedDefaultUser, type DBUser, usersDB, userStoresDB } from './db.js';

let supabaseClient: SupabaseClient | null | undefined;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient !== undefined) return supabaseClient;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url && !serviceRoleKey) {
    supabaseClient = null;
    return supabaseClient;
  }

  if (!url || !serviceRoleKey) {
    throw new Error('Set SUPABASE_URL and a server-side SUPABASE_SECRET_KEY to enable Supabase persistence.');
  }

  if (serviceRoleKey.startsWith('sb_publishable_')) {
    throw new Error('A Supabase publishable key cannot access the server database. Use a Secret or service_role key.');
  }

  supabaseClient = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  return supabaseClient;
}

export async function persistUserState(userId: string): Promise<void> {
  const client = getSupabaseClient();
  const user = usersDB.get(userId);
  const store = userStoresDB.get(userId);

  if (!client || !user || !store) return;

  const userResult = await client.from('app_users').upsert({
    id: user.id,
    email: user.email,
    user_data: user
  });
  if (userResult.error) throw userResult.error;

  const storeResult = await client.from('app_user_data').upsert({
    user_id: userId,
    store_data: store
  });
  if (storeResult.error) throw storeResult.error;
}

export async function initializeSupabasePersistence(): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  const [usersResult, storesResult] = await Promise.all([
    client.from('app_users').select('id,user_data'),
    client.from('app_user_data').select('user_id,store_data')
  ]);

  if (usersResult.error) throw usersResult.error;
  if (storesResult.error) throw storesResult.error;

  usersDB.clear();
  userStoresDB.clear();

  for (const row of usersResult.data ?? []) {
    usersDB.set(row.id, row.user_data as DBUser);
  }

  for (const row of storesResult.data ?? []) {
    userStoresDB.set(row.user_id, row.store_data);
  }

  if (usersDB.size === 0) seedDefaultUser();

  for (const user of usersDB.values()) {
    if (!userStoresDB.has(user.id)) {
      userStoresDB.set(user.id, createStarterUserData());
    }
  }

  await Promise.all(Array.from(usersDB.keys(), persistUserState));
  return true;
}