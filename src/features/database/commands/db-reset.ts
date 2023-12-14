import { executeCommand } from '@/utils/exec-command';

/**
 * @deprecated
 */
export async function dbReset() {
  const cmd = `npx supabase db reset`;
  executeCommand(cmd);
}
