'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BLOGS } from '@/lib/blogData';

export default function BlogPost() {
  const params = useParams();
  const slug = params?.slug as string;
  const blog = BLOGS.find(b => b.id === slug);
  const [comments, setComments] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchComments = async () => {
    if (!slug) return;
    try {
      const resp = await fetch(`http://localhost:8000/api/comments?blogId=${slug}`);
      const data = await resp.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchComments();
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !commentText) return;

    try {
      const resp = await fetch('http://localhost:8000/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          blogId: slug,
          name: name,
          comment: commentText // Sent RAW for XSS demonstration
        })
      });

      if (resp.ok) {
        setName('');
        setCommentText('');
        setSuccess(true);
        fetchComments();
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center p-6 text-center">
        <div className="glass-card p-12 max-w-lg">
          <h1 className="text-3xl font-bold mb-4">Post not found</h1>
          <Link href="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
            Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh animate-fade-in">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-strong border-b border-glass px-12 py-4 flex items-center gap-4">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">
          ← Back
        </Link>
        <div className="h-4 w-[1px] bg-border/40 mx-2"></div>
        <span className="text-xl font-bold text-gradient">The Grey Journal</span>
      </nav>

      {/* Blog Content */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="glass-card p-10 mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-white/10 text-muted-foreground">
            {blog.category}
          </span>
          <h1 className="text-4xl font-bold text-foreground mt-4 mb-2">
            {blog.title}
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            {blog.date} · {blog.read_time}
          </p>
          <div className="space-y-5">
            {blog.paragraphs.map((p, idx) => (
              <p key={idx} className="text-foreground/80 leading-relaxed text-base opacity-90">
                {p}
              </p>
            ))}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            Comments ({comments.length})
          </h2>
          <div className="h-0.5 flex-1 bg-border/20 ml-8"></div>
        </div>

        {comments.length === 0 ? (
          <p className="text-muted-foreground text-sm mb-6 italic">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-4 mb-12">
            {comments.map((comment: any) => (
              <div key={comment.id} className="glass p-5 rounded-2xl animate-fade-in border border-white/5">
                <div className="flex items-center justify-between mb-3 bg-white/5 p-2 rounded-lg">
                  <span className="text-sm font-bold text-foreground px-2">{comment.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {/* VULNERABLE RENDER: Dangerous rendering for XSS demo */}
                <div 
                  className="text-sm text-foreground/80 leading-relaxed px-2 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: comment.comment }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Comment Form */}
        <div className="glass-card p-10 mt-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
          <h3 className="text-lg font-bold text-foreground mb-8 flex items-center gap-2">
            Leave a Comment
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Your Identity</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/30 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 smooth-transition focus:bg-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Your Thoughts</label>
              <textarea 
                rows={4} 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment here..."
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/30 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 smooth-transition mb-4 resize-none focus:bg-white/10"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm smooth-transition hover:opacity-90 active:scale-95 shadow-lg shadow-primary/10"
            >
              Post Comment
            </button>
          </form>
          {success && (
            <p className="text-green-400 text-sm mt-4 font-bold animate-fade-in flex items-center justify-center gap-2 bg-green-400/10 p-3 rounded-lg border border-green-400/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Comment successfully deployed!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
