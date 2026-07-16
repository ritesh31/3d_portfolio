import { CTA, BlogSkeleton } from "../components";
import { BlogPostRow } from "../types";
import { useTable } from "../hooks/useTable";
import { arrow } from "../assets/icons/index";

function Blog() {
  const { data: posts, loading } = useTable<BlogPostRow>("blog_posts");

  return (
    <section className="max-container">
      <h1 className="head-text">
        My{" "}
        <span className="blue-gradient_text drop-shadow font-semibold">
          Blog
        </span>
      </h1>

      <div className="mt-5 flex flex-col gap-3 text-slate-500">
        <p>
          Thoughts, notes, and things I've learned along the way. Click
          through to read the full posts.
        </p>
      </div>

      {loading ? (
        <BlogSkeleton />
      ) : (
        <div className="flex flex-wrap my-20 gap-16">
          {posts.map((post) => (
            <div className="lg:w-[400px] w-full" key={post.id}>
              {post.icon_url && (
                <img
                  src={post.icon_url}
                  alt={post.title}
                  className="w-full h-40 object-cover rounded-xl"
                />
              )}

              <div className="mt-5 flex flex-col">
                <h4 className="text-2xl font-poppins font-semibold">
                  {post.title}
                </h4>
                <p className="mt-2 text-slate-500">{post.excerpt}</p>
                <div className="mt-5 flex items-center gap-2 font-poppins">
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600"
                  >
                    Read post
                  </a>
                  <img
                    src={arrow}
                    alt="arrow"
                    className="w-4 h-4 object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr className="border-slate-200" />

      <CTA />
    </section>
  );
}

export default Blog;
