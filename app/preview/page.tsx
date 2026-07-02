import PreviewExperience from "./preview-experience";

type PreviewPageProps = {
  searchParams?: Promise<{
    username?: string;
    type?: string;
  }>;
};

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const params = await searchParams;
  const username = typeof params?.username === "string" ? params.username : "";
  const type = params?.type === "followers" || params?.type === "following" ? params.type : "both";

  return <PreviewExperience initialUsername={username} initialType={type} />;
}
