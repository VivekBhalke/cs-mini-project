'use client';

import Link from 'next/link';
import { BLOGS } from '@/lib/blogData';

export default function Home() {
  return (
    <div className="min-h-screen bg-mesh animate-fade-in">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-strong border-b border-glass px-12 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-gradient">The Grey Journal</span>
        <span className="text-sm text-muted-foreground">A space to think</span>
      </nav>

      {/* Hero Section */}
      <section className="px-12 py-24 flex flex-col items-center text-center">
        <div className="glass-card p-12 max-w-2xl w-full mx-auto glow-indigo">
          <p className="text-xs tracking-widest text-muted-foreground mb-4 uppercase">
            WELCOME TO THE JOURNAL
          </p>
          <h1 className="text-5xl font-bold text-gradient mb-4">
            Thoughts, Stories & Ideas
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A personal space to explore technology, culture, and everything in between.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="px-12 pb-24 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOGS.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.id}`} className="block group">
              <div className="glass-card p-8 flex flex-col gap-4 h-full smooth-transition group-hover:glow-indigo group-hover:scale-[1.01] cursor-pointer">
                <span className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-white/10 text-muted-foreground w-fit">
                  {blog.category}
                </span>
                <h3 className="text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-glass">
                  <span className="text-xs text-muted-foreground">
                    {blog.date} · {blog.read_time}
                  </span>
                  <div className="text-sm font-semibold px-4 py-2 rounded-full bg-primary text-primary-foreground smooth-transition group-hover:opacity-80">
                    Read More →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-muted-foreground border-t border-glass">
        © 2025 The Grey Journal. All rights reserved.
      </footer>
    </div>
  );
}
