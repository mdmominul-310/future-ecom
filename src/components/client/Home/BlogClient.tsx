"use client";

import Image from "next/image";
import Link from "next/link";

interface BlogClientProps {
  blog: {
    id: string;
    imageUrl: string;
    title: string;
    content: string;
    author: string;
    date: string;
  };
}

export default function BlogClient({ blog }: BlogClientProps) {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Image
        src={blog.imageUrl}
        alt={blog.title}
        width={1200}
        height={600}
        className="rounded-lg mb-6 object-cover w-full"
      />
      <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        By {blog.author} | {blog.date}
      </p>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      <div className="mt-10">
        <Link href="/blog">
          <span className="text-blue-600 hover:underline">← Back to Blog</span>
        </Link>
      </div>
    </div>
  );
}
