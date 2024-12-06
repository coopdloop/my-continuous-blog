// you can add more to the PageMetaData type (such as Open Graph data) to be consumed by your PageTemplate component
export interface PageMetaData {
    url: string; // required by plugin
    bundleEntryPoint: string; // required by plugin
    title: string;
    description: string;
    ogImage?: string;
    ogType?: string;
}

// here you will list all your pages and their needed meta data.
export const pages: PageMetaData[] = [
    {
        url: "index.html",
        bundleEntryPoint: "/src/main.tsx",
        title: "Engineering Insights",
        description:
            "Explore the intersection of innovation and engineering excellence",
        ogImage: "/assets/me.jpg",
        ogType: "website",
    },
    {
        url: "rss.xml",
        bundleEntryPoint: "/src/components/RSSFeedPage.tsx",
        title: "Engineering Insights RSS Feed",
        description: "RSS feed for the Engineering Insights blog",
    },
    {
        url: "post/[slug].html",
        bundleEntryPoint: "/src/components/BlogPost.tsx",
        title: "Post Title", // Replace with dynamic title
        description: "Post description", // Replace with dynamic description
        ogImage: "post-image-url", // Replace with dynamic image URL
        ogType: "article",
    },
];
