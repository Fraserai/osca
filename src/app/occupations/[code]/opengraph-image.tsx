import { createRoleSocialImageResponse, socialImageContentType, socialImageSize } from '@/lib/socialImage';
import { getRoleByCode } from '@/lib/roles/lookup';

export const alt = 'OSCA occupation report share image';
export const size = socialImageSize;
export const contentType = socialImageContentType;

type OccupationImageProps = {
  params: Promise<{ code: string }>;
};

export default async function OpenGraphImage({ params }: OccupationImageProps) {
  const { code } = await params;
  const role = await getRoleByCode(code);

  if (!role) {
    return new Response('Not found', { status: 404 });
  }

  return createRoleSocialImageResponse(role);
}
