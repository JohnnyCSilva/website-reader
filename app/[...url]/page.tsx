import { ChatWrapper } from "@/components/ChatWrapper";
import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import React from "react";

interface PageProps {
  params: {
    url: string | string[] | undefined;
  };
}

function reconstructURL({ url }: { url: string[] }) {
  const decodedComponenets = url.map((component) =>
    decodeURIComponent(component)
  );

  return decodedComponenets.join("/");
}

const Page = async ({ params }: PageProps) => {
  const sessionCookie = cookies().get("sessionId")?.value;
  const reconstructedURL = reconstructURL({ url: params.url as string[] });

  const sessionId = (reconstructURL + "--" + sessionCookie).replace(/\//g, "");

  const isAlreadyIndexed = await redis.sismember(
    "indexed-urls",
    reconstructedURL
  );

  const initialMessages = await ragChat.history.getMessages({
    amount: 10,
    sessionId,
  });

  if (!isAlreadyIndexed) {
    await ragChat.context.add({
      type: "html",
      source: reconstructedURL,
      config: { chunkOverlap: 50, chunkSize: 200 },
    });

    await redis.sadd("indexed-urls", reconstructedURL);
  }

  return (
    <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />
  );
};

export default Page;
