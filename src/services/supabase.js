import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://xxxx.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || 'xxxx';
export const supabase = createClient(supabaseUrl, supabaseKey);
export const listService = {
  getAll: async (userId) => supabase.from('lists').select('*, items(count), reservations(count)').eq('user_id', userId).order('created_at', { ascending: false }),
  create: async (listData) => supabase.from('lists').insert([listData]).select(),
  update: async (id, updates) => supabase.from('lists').update(updates).eq('id', id).select(),
  delete: async (id) => supabase.from('lists').delete().eq('id', id),
};
export const itemService = {
  getByList: async (listId) => supabase.from('items').select('*').eq('list_id', listId),
  create: async (itemData) => supabase.from('items').insert([itemData]).select(),
  update: async (id, updates) => supabase.from('items').update(updates).eq('id', id).select(),
  delete: async (id) => supabase.from('items').delete().eq('id', id),
};
export const reservationService = {
  reserve: async (itemId, userId) => supabase.from('reservations').insert([{ item_id: itemId, reserved_by_user_id: userId }]).select(),
  cancel: async (id) => supabase.from('reservations').delete().eq('id', id),
};
