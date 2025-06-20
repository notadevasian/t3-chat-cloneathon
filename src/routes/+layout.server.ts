import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  const { user, session } = locals;
  
  return {
    user,
    session
  };
}