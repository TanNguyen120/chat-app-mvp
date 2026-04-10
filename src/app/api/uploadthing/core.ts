import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@/auth'; // Your NextAuth/Auth.js setup

const f = createUploadthing();

export const ourFileRouter = {
  // Define the "imageUploader" endpoint
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new Error('Unauthorized');
      return { userId: session.user?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);
      console.log('file url', file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
