import AnalyzeExperience from "./analyze-experience";

type AnalyzePageProps = {
  searchParams?: Promise<{
    username?: string;
    type?: string;
  }>;
};

export default async function AnalyzePage({ searchParams }: AnalyzePageProps) {
  const params = await searchParams;
  const username = typeof params?.username === "string" ? params.username : "";
  const type = params?.type === "followers" || params?.type === "following" ? params.type : "both";

  return <AnalyzeExperience initialUsername={username} initialType={type} />;
}
