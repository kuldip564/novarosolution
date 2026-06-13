import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import type { BlogAuthor } from "@/lib/blog";
import { cloudinaryTransformUrl, parseCloudinaryAsset } from "@/lib/media";

type BlogAuthorMetaProps = {
  author: BlogAuthor;
  className?: string;
};

export function BlogAuthorMeta({ author, className = "" }: BlogAuthorMetaProps) {
  const avatar = parseCloudinaryAsset(author.avatar);
  const avatarUrl = avatar
    ? cloudinaryTransformUrl(avatar, { width: 64, crop: "fill" }) ?? avatar.secureUrl
    : null;

  return (
    <span className={`blog-author-meta ${className}`.trim()}>
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt="" className="blog-author-avatar" />
      ) : (
        <span className="blog-author-avatar-fallback">{author.name.charAt(0)}</span>
      )}
      <span>{author.name}</span>
    </span>
  );
}

export function BlogCoverThumb({
  coverImage,
  title,
  category,
  size = 52,
}: {
  coverImage: unknown;
  title: string;
  category?: string;
  size?: number;
}) {
  const asset = parseCloudinaryAsset(coverImage);
  if (asset?.secureUrl) {
    return (
      <CloudinaryImage
        asset={asset}
        alt={title}
        width={size}
        height={size}
        transformWidth={size * 2}
        className="blog-cover-thumb"
      />
    );
  }

  return (
    <div className="blog-cover-thumb blog-cover-thumb-fallback">
      {(category ?? "Blog").slice(0, 2).toUpperCase()}
    </div>
  );
}
